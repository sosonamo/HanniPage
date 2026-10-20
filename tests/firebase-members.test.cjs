const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const vm = require('node:vm');
function bundle(file, mocks = {}, env = {}) {
  const code = buildSync({ entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs',
    external: ['firebase/*'], define: { 'import.meta.env': JSON.stringify(env) } }).outputFiles[0].text;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, URL, require: name => mocks[name] ?? require(name) });
  return module.exports;
}
const { parseMemberContent } = bundle('src/services/memberContent.ts');
test('member content rejects malformed data and non-YouTube URLs', () => {
  const valid = { notice: 'hello', playlists: [{ id: 'one', title: 'game', url: 'https://www.youtube.com/playlist?list=example' }] };
  assert.equal(parseMemberContent(valid).playlists.length, 1);
  for (const url of ['javascript:alert(1)', 'https://youtube.com.evil.example/playlist?list=x', 'http://youtube.com/playlist?list=x', 'https://youtube.com/playlist']) {
    assert.throws(() => parseMemberContent({ ...valid, playlists: [{ ...valid.playlists[0], url }] }));
  }
  assert.throws(() => parseMemberContent({ notice: 'hello' }));
  assert.throws(() => parseMemberContent({ ...valid, playlists: [...valid.playlists, ...valid.playlists] }));
});
function setup() {
  let authChanged; const subscriptions = []; const states = [];
  const api = bundle('src/services/members.ts', {
    'firebase/app': { initializeApp: () => ({}) },
    'firebase/auth': { getAuth: () => ({}), browserSessionPersistence: 'session', setPersistence: async () => {},
      onAuthStateChanged: (_, callback) => { authChanged = callback; return () => {}; },
      GoogleAuthProvider: class {}, signInWithPopup: async () => {}, signOut: async () => {},
    },
    'firebase/firestore': { getFirestore: () => ({}), doc: (_, ...path) => path.join('/'),
      onSnapshot: (path, options, next, error) => {
        const sub = { path, next, error, stopped: false }; subscriptions.push(sub);
        return () => { sub.stopped = true; };
      },
    },
  }, { VITE_FIREBASE_API_KEY: 'test', VITE_FIREBASE_AUTH_DOMAIN: 'test', VITE_FIREBASE_PROJECT_ID: 'test', VITE_FIREBASE_APP_ID: 'test' });
  const stop = api.subscribeMember(state => states.push(state));
  return { login: (uid, email, emailVerified = true) => authChanged(uid ? { uid, email, emailVerified } : null), subscriptions, states, stop };
}
const snapshot = (data, fromCache = false) => ({ metadata: { fromCache }, exists: () => data !== undefined, data: () => data });
test('unapproved users never subscribe to content; cached approval is not trusted', () => {
  const app = setup(); app.login('new');
  app.subscriptions[0].next(snapshot(undefined));
  assert.equal(app.states.at(-1).status, 'pending');
  app.subscriptions[0].next(snapshot({ active: true }, true));
  assert.equal(app.states.at(-1).status, 'loading');
  assert.equal(app.subscriptions.length, 1);
  app.stop();
});
test('revocation and logout clear content; stale callbacks cannot restore it', () => {
  const app = setup(); app.login('approved');
  app.subscriptions[0].next(snapshot({ active: true }));
  const content = app.subscriptions[1];
  const data = snapshot({ notice: 'private', playlists: [] });
  content.next(data); assert.equal(app.states.at(-1).status, 'ready');
  app.subscriptions[0].next(snapshot({ active: false }));
  assert.equal(app.states.at(-1).status, 'pending');
  assert.equal(app.states.at(-1).content, undefined);
  content.next(data); assert.equal(app.states.at(-1).status, 'pending');
  app.login(null); content.next(data);
  assert.equal(app.states.at(-1).status, 'signed-out');
  app.stop();
});
test('permission errors remove displayed private content', () => {
  const app = setup(); app.login('approved');
  app.subscriptions[0].next(snapshot({ active: true }));
  app.subscriptions[1].next(snapshot({ notice: 'private', playlists: [] }));
  app.subscriptions[1].error({ code: 'permission-denied' });
  assert.equal(app.states.at(-1).status, 'error');
  assert.equal(app.states.at(-1).content, undefined);
  app.stop();
});

test('verified email approval works without UID approval, normalizes case and revokes safely', () => {
  const app = setup(); app.login('new', 'Team@Example.com');
  assert.equal(app.subscriptions[1].path, 'memberEmails/team@example.com');
  app.subscriptions[0].next(snapshot(undefined));
  app.subscriptions[1].next(snapshot({ active: true }));
  const content = app.subscriptions[2];
  content.next(snapshot({ notice: 'private', playlists: [] }));
  assert.equal(app.states.at(-1).status, 'ready');
  app.subscriptions[1].next(snapshot({ active: false }));
  content.next(snapshot({ notice: 'stale', playlists: [] }));
  assert.equal(app.states.at(-1).status, 'pending');
  app.stop();
});
test('UID approval survives email denial or revocation; both must be disabled to revoke', () => {
  const app = setup(); app.login('approved', 'team@example.com');
  app.subscriptions[0].next(snapshot({ active: true }));
  app.subscriptions[2].next(snapshot({ notice: 'private', playlists: [] }));
  app.subscriptions[1].error({ code: 'permission-denied' });
  assert.equal(app.states.at(-1).status, 'ready');
  app.subscriptions[1].next(snapshot({ active: true }));
  app.subscriptions[0].next(snapshot({ active: false }));
  assert.equal(app.states.at(-1).status, 'ready');
  app.subscriptions[1].next(snapshot({ active: false }));
  assert.equal(app.states.at(-1).status, 'pending');
  app.stop();
});
test('unverified email is not used for approval', () => {
  const app = setup(); app.login('new', 'team@example.com', false);
  assert.equal(app.subscriptions.length, 1);
  app.subscriptions[0].next(snapshot(undefined));
  assert.equal(app.states.at(-1).status, 'pending');
  app.stop();
});

test('resource parsing supports old documents and rejects unsafe or duplicate Drive entries', () => {
  const base = { notice: '공지', playlists: [] };
  assert.equal(parseMemberContent(base).resources.length, 0);
  const item = { id: 'rules', title: '회칙', url: 'https://drive.google.com/file/d/example/view?usp=sharing' };
  assert.equal(parseMemberContent({ ...base, resources: [item] }).resources[0].title, '회칙');
  for (const resources of [null, {}, [item, item], [{ ...item, title: '' }], [{ ...item, url: 'https://drive.google.com.evil/file/d/example' }], [{ ...item, url: 'javascript:alert(1)' }]]) {
    assert.throws(() => parseMemberContent({ ...base, resources }));
  }
});

test('Google Docs and Sheets links accepted; malformed and spoofed links rejected', () => {
  
  for (const url of ["https://docs.google.com/document/d/doc_123/edit?usp=sharing","https://docs.google.com/spreadsheets/d/sheet-123/edit?usp=sharing#gid=0","https://docs.google.com/document/u/0/d/doc_123/edit"]) assert.doesNotThrow(() => parseMemberContent({ notice: '공지', playlists: [], resources: [{ id: 'id', title: '자료', url }] }));
  for (const url of ["https://docs.google.com.evil/document/d/x/edit","https://docs.google.com@evil.com/document/d/x/edit","http://docs.google.com/document/d/x/edit","https://docs.google.com/document/d/","https://docs.google.com/spreadsheets/","https://evil.com/document/d/x/edit"]) assert.throws(() => parseMemberContent({ notice: '공지', playlists: [], resources: [{ id: 'id', title: '자료', url }] }));
});

test('match resources support old documents and pending links, reject invalid rows', () => {
  const base = { notice: '공지', playlists: [] };
  const item = { id: 'match', title: '경기', url: '' };
  assert.equal(parseMemberContent(base).matchResources.length, 0);
  assert.equal(parseMemberContent({ ...base, matchResources: [item] }).matchResources[0].url, '');
  for (const matchResources of [null, {}, [item, item], [{ ...item, title: '' }], [{ ...item, url: 'javascript:alert(1)' }]]) assert.throws(() => parseMemberContent({ ...base, matchResources }));
});
