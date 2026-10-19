const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('google-apps-script/ContentSync/Code.gs', 'utf8');
function load(extra = {}) { const ctx = vm.createContext(extra); vm.runInContext(source, ctx); return ctx; }
const valid = [['one', '경기', 'https://www.youtube.com/playlist?list=PL_test&si=x']];
test('sheet validation handles blanks and rejects malformed, duplicate or empty lists', () => {
  const c = load();
  assert.equal(c.validateSheetContent_('공지', [...valid, ['', '', '']], false).playlists.length, 1);
  for (const rows of [[], [...valid, ...valid], [['id', '', valid[0][2]]], [['id', 'x', 'https://youtube.com.evil/playlist?list=x']], [['id', 'x', 'https://youtube.com/playlist?x=y#&list=x']]]) {
    assert.throws(() => c.validateSheetContent_('공지', rows, false));
  }
  assert.equal(c.validateSheetContent_('공지', [], true).playlists.length, 0);
  assert.throws(() => c.validateSheetContent_('', valid, false));
  assert.equal(c.validateSheetContent_('공지', [['__proto__', 'test', valid[0][2]]], false).playlists.length, 1);
});
test('encoding preserves order, multiline notice and literal titles', () => {
  const c = load();
  const content = c.validateSheetContent_('첫 줄\n둘째 줄', valid, false);
  const encoded = c.encodeContent_(content);
  assert.equal(encoded.fields.notice.stringValue, '첫 줄\n둘째 줄');
  assert.equal(encoded.fields.playlists.arrayValue.values[0].mapValue.fields.id.stringValue, 'one');
});
for (const resourceRows of [null, [], [['rules', '회칙', 'https://drive.google.com/file/d/example/view']]]) {
test('publish patches only content; resources=' + JSON.stringify(resourceRows), () => {
  const calls = []; const backup = []; const messages = [];
  const current = { updateTime: '2026-10-19T00:00:00Z', fields: { notice: { stringValue: 'old' } } };
  const ui = { ButtonSet: { YES_NO: 'buttons' }, Button: { YES: 'yes' }, alert: (...args) => { messages.push(args); return 'yes'; } };
  const book = { getSheetByName: name => name === '공지' ? { getRange: () => ({ getDisplayValue: () => 'new', getValue: () => false }) }
    : name === '영상목록' ? { getLastRow: () => 2, getRange: () => ({ getDisplayValues: () => valid }) }
    : name === '공유자료' ? (resourceRows === null ? null : { getLastRow: () => resourceRows.length + 1, getRange: () => ({ getDisplayValues: () => resourceRows }) }) : { getLastRow: () => backup.length, appendRow: row => backup.push(row) } };
  let released = false;
  const c = load({ SpreadsheetApp: { getUi: () => ui, getActiveSpreadsheet: () => book },
    ScriptApp: { getOAuthToken: () => 'test-token' },
    LockService: { getDocumentLock: () => ({ tryLock: () => true, releaseLock: () => { released = true; } }) },
    UrlFetchApp: { fetch: (url, options) => {
      calls.push({ url, options });
      return { getResponseCode: () => 200, getContentText: () => JSON.stringify(current) };
    } },
  });
  c.publishMemberContent();
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /memberContent\/main\?updateMask.fieldPaths=notice&updateMask.fieldPaths=playlists/);
  assert.ok(calls[1].url.includes('currentDocument.updateTime='));
  assert.equal(calls[1].url.includes('updateMask.fieldPaths=resources'), resourceRows !== null);
  assert.deepEqual(Object.keys(JSON.parse(calls[1].options.payload).fields), resourceRows === null ? ['notice', 'playlists'] : ['notice', 'playlists', 'resources']);
  if (resourceRows !== null) assert.equal(JSON.parse(calls[1].options.payload).fields.resources.arrayValue.values.length, resourceRows.length);
  assert.equal(released, true);
  assert.match(messages.at(-1)[0], /반영 완료/);
});
}
test('permission and conflict failures are actionable without exposing tokens', () => {
  for (const status of [403, 412, 404]) {
    const c = load({ ScriptApp: { getOAuthToken: () => 'secret' }, UrlFetchApp: { fetch: () => ({ getResponseCode: () => status }) } });
    assert.throws(() => c.contentRequest_('patch', '', {}), error => !error.message.includes('secret') && error.message.length > 10);
  }
});

test('Drive resources validate file and folder links and reject unsafe links', () => {
  const c = load();
  const urls = ['https://drive.google.com/file/d/file_id/view?usp=sharing', 'https://drive.google.com/drive/folders/folder_id?usp=sharing', 'https://drive.google.com/open?id=file_id'];
  const rows = urls.map((url, i) => [String(i), '자료', url]);
  assert.equal(c.validateResources_(rows).length, 3);
  assert.equal(c.validateResources_([]).length, 0);
  for (const url of ['javascript:alert(1)', 'http://drive.google.com/file/d/x', 'https://drive.google.com.evil/file/d/x', 'https://drive.google.com@evil.com/file/d/x', 'https://drive.google.com/', 'https://youtube.com/playlist?list=x']) {
    assert.throws(() => c.validateResources_([['one', '자료', url]]));
  }
  assert.throws(() => c.validateResources_([rows[0], rows[0]]));
  assert.throws(() => c.validateResources_([['one', '', urls[0]]]));
  const encoded = c.encodeContent_({ notice: '공지', playlists: [], resources: c.validateResources_(rows) });
  assert.equal(encoded.fields.resources.arrayValue.values[0].mapValue.fields.url.stringValue, urls[0]);
  assert.equal(c.encodeContent_({ notice: '공지', playlists: [], resources: [] }).fields.resources.arrayValue.values.length, 0);
});


test('Google Docs and Sheets links accepted; malformed and spoofed links rejected', () => {
  const c = load();
  for (const url of ["https://docs.google.com/document/d/doc_123/edit?usp=sharing","https://docs.google.com/spreadsheets/d/sheet-123/edit?usp=sharing#gid=0","https://docs.google.com/document/u/0/d/doc_123/edit"]) assert.doesNotThrow(() => c.validateResources_([['id', '자료', url]]));
  for (const url of ["https://docs.google.com.evil/document/d/x/edit","https://docs.google.com@evil.com/document/d/x/edit","http://docs.google.com/document/d/x/edit","https://docs.google.com/document/d/","https://docs.google.com/spreadsheets/","https://evil.com/document/d/x/edit"]) assert.throws(() => c.validateResources_([['id', '자료', url]]));
});
