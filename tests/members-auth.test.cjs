const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const source = fs.readFileSync('google-apps-script/Members.gs', 'utf8');
function setup(rows) {
  const cache = new Map();
  const context = vm.createContext({
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (alg, text) => crypto.createHash(alg).update(text).digest(), base64EncodeWebSafe: bytes => bytes.toString('base64url') },
    CacheService: { getScriptCache: () => ({ get: key => cache.get(key), put: (key, value) => cache.set(key, value) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => ({ getLastRow: () => rows.length + 1, getRange: () => ({ getDisplayValues: () => rows }) }) }) },
  });
  vm.runInContext(source, context);
  return { login: (email, password) => context.doPost({ parameter: { action: 'login', email, password } }), context };
}
test('same-row credentials required; email normalized; leading zero password preserved', () => {
  const { login } = setup([['a@example.com', '0012'], ['b@example.com', 'different']]);
  assert.equal(login(' A@EXAMPLE.COM ', '0012').ok, true);
  for (const [email, password] of [['a@example.com', 'different'], ['a@example.com', '12'], ['unknown@example.com', '0012'], ['a@example.com', '']]) {
    const result = login(email, password);
    assert.equal(result.ok, false);
    assert.equal(result.content, undefined);
  }
  const result = login('b@example.com', 'different');
  assert.equal(result.content.videoId, 'nirLJaNBQXY');
  assert.equal(JSON.stringify(result).includes('different'), false);
});
test('duplicate and empty accounts rejected; GET never returns content', () => {
  const { login, context } = setup([['a@example.com', 'one'], ['A@example.com', 'two']]);
  assert.equal(login('a@example.com', 'one').ok, false);
  assert.equal(setup([]).login('a@example.com', 'one').ok, false);
  assert.equal(context.doGet().content, undefined);
  assert.equal(context.doPost({}).ok, false);
});
test('repeated attempts blocked', () => {
  const { login } = setup([['a@example.com', 'correct']]);
  for (let i = 0; i < 10; i++) assert.equal(login('a@example.com', 'wrong').ok, false);
  assert.match(login('a@example.com', 'correct').message, /10분/);
});
