const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const vm = require('node:vm');
const code = buildSync({ entryPoints: ['src/services/memberPresence.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['firebase/*'] }).outputFiles[0].text;
function setup() {
  let now = 1000000;
  const timers = new Map(), events = new Map(), listeners = [], states = [], writes = [], deletes = [];
  class Timestamp { constructor(ms) { this.ms = ms; } toMillis() { return this.ms; } static fromMillis(ms) { return new Timestamp(ms); } }
  const firebase = {
    Timestamp, collection: (_, name) => name, doc: () => 'session', query: (...args) => args, where: (...args) => args,
    serverTimestamp: () => 'server-time', setDoc: async (ref, data) => writes.push(data), deleteDoc: async ref => { deletes.push(ref); },
    onSnapshot: (_, options, next, error) => { const listener = { next, error, stopped: false }; listeners.push(listener); return () => { listener.stopped = true; }; },
  };
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: () => firebase, Date: { now: () => now },
    document: { visibilityState: 'visible', addEventListener: (event, fn) => events.set(event, fn), removeEventListener: event => events.delete(event) },
    window: { setInterval: (fn, ms) => { timers.set(ms, fn); return ms; }, clearInterval: id => timers.delete(id),
      addEventListener: (event, fn) => events.set(event, fn), removeEventListener: event => events.delete(event) },
  });
  const stop = module.exports.startMemberPresence({}, 'one', '한늬', state => states.push(state));
  const snapshot = (rows, fromCache = false) => listeners.at(-1).next({ metadata: { fromCache }, docs: rows.map(row => ({ data: () => ({ ...row, lastSeen: new Timestamp(row.lastSeen) }) })) });
  return { api: module.exports, stop, states, writes, deletes, timers, events, listeners, snapshot, advance: ms => { now += ms; } };
}
test('deduplicates multiple tabs by UID, retains distinct people with identical names, expires without snapshots', async () => {
  const app = setup();
  app.snapshot([{ uid: 'one', name: '한늬', lastSeen: 1000000 }, { uid: 'one', name: '한늬', lastSeen: 999000 }, { uid: 'two', name: '한늬', lastSeen: 1000000 }, { uid: 'old', name: '이전', lastSeen: 900000 }]);
  assert.equal(app.states.at(-1).members.length, 2);
  app.advance(90001); app.timers.get(5000)();
  assert.equal(app.states.at(-1).members.length, 0);
  await app.stop();
});
test('cleanup removes only this session, stops timers/listeners and ignores late snapshots', async () => {
  const app = setup();
  assert.equal(app.writes[0].uid, 'one');
  assert.equal(app.writes[0].lastSeen, 'server-time');
  const previous = app.listeners[0];
  const pending = app.stop();
  assert.equal(app.stop(), pending);
  await pending;
  assert.equal(app.deletes.length, 1);
  assert.equal(app.events.size, 0); assert.equal(app.timers.size, 0);
  assert.equal(previous.stopped, true);
  const count = app.states.length;
  app.snapshot([{ uid: 'one', name: '한늬', lastSeen: 1000000 }]); previous.error();
  assert.equal(app.states.length, count);
});
test('cached and denied results clear displayed names; reconnect renews heartbeat and subscription', async () => {
  const app = setup();
  app.snapshot([{ uid: 'one', name: '한늬', lastSeen: 1000000 }]);
  app.snapshot([{ uid: 'one', name: '한늬', lastSeen: 1000000 }], true);
  assert.equal(app.states.at(-1).status, 'loading'); assert.equal(app.states.at(-1).members.length, 0);
  app.listeners.at(-1).error();
  assert.equal(app.states.at(-1).status, 'error');
  await new Promise(resolve => setImmediate(resolve));
  app.events.get('online')();
  assert.equal(app.writes.length, 2); assert.equal(app.listeners.length, 2);
  await app.stop();
});
