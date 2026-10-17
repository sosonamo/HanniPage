const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const vm = require('node:vm');
function load(file, overrides = {}) {
  const result = buildSync({
    entryPoints: [file], bundle: true, write: false, platform: 'node', format: 'cjs',
    define: { 'import.meta.env': JSON.stringify({ VITE_GOOGLE_CALENDAR_ID: 'test', VITE_GOOGLE_CALENDAR_API_KEY: 'test' }) },
  });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, require,
    URLSearchParams, AbortController, setTimeout, clearTimeout, ...overrides });
  return module.exports;
}
const dates = load('src/services/scheduleDates.ts');
test('Seoul date and Monday week cross UTC day, month and year boundaries', () => {
  const now = new Date('2026-12-31T15:01:00Z');
  assert.equal(dates.calendarDateKey(now, 'Asia/Seoul'), '2027-01-01');
  assert.equal(dates.calendarWeek(now, 'Asia/Seoul').startDate, '2026-12-28');
  assert.equal(dates.calendarWeek(now, 'Asia/Seoul').endDateExclusive, '2027-01-04');
  assert.equal(dates.calendarWeek(new Date('2026-10-18T15:01:00Z'), 'Asia/Seoul').startDate, '2026-10-19');
});
test('next schedule excludes elapsed events, sorts input and retains current all-day event', () => {
  const now = new Date('2026-10-18T03:00:00Z');
  const events = [
    { id: 'later', date: '2026-10-20', startDateTime: '2026-10-20T13:00:00+09:00' },
    { id: 'past', date: '2026-10-18', startDateTime: '2026-10-18T11:00:00+09:00' },
    { id: 'next', date: '2026-10-18', startDateTime: '2026-10-18T13:00:00+09:00' },
  ];
  assert.equal(dates.nextSchedule(events, now, 'Asia/Seoul').id, 'next');
  assert.equal(dates.nextSchedule([events[1]], now, 'Asia/Seoul'), undefined);
  assert.equal(dates.nextSchedule([{ id: 'all', date: '2026-10-18' }, ...events], now, 'Asia/Seoul').id, 'all');
});
test('calendar fetch follows pagination and honors explicit regular metadata', async () => {
  const calls = [];
  const api = load('src/services/googleCalendar.ts', { fetch: async url => {
    calls.push(new URL(url));
    const page = calls.length;
    return { ok: true, json: async () => ({
      items: Array.from({ length: page === 1 ? 50 : 1 }, (_, i) => ({
        id: `${page}-${i}`, summary: '정모 (검암) 훈련', description: '종류: 정모',
        start: { dateTime: '2026-10-18T13:00:00+09:00' },
      })), nextPageToken: page === 1 ? 'second' : undefined,
    }) };
  } });
  const events = await api.fetchGoogleCalendarSchedules();
  assert.equal(events.length, 51);
  assert.equal(events[0].type, 'regular');
  assert.equal(calls[1].searchParams.get('pageToken'), 'second');
  assert.equal(calls[0].searchParams.get('maxResults'), '50');
});
test('HTTP errors do not attempt JSON parsing; malformed success is explained', async () => {
  const api = load('src/services/googleCalendar.ts', { fetch: async () => ({
    ok: false, status: 503, json: () => { throw new Error('unexpected JSON parse'); },
  }) });
  await assert.rejects(api.fetchGoogleCalendarSchedules(), /HTTP 503/);
  const malformed = load('src/services/googleCalendar.ts', { fetch: async () => ({
    ok: true, json: async () => { throw new Error('HTML'); },
  }) });
  await assert.rejects(malformed.fetchGoogleCalendarSchedules(), /응답을 읽을 수/);
});
test('calendar request abort is propagated to fetch', async () => {
  const api = load('src/services/googleCalendar.ts', { fetch: async (_, { signal }) => {
    assert.equal(signal.aborted, true);
    throw new Error('aborted');
  } });
  const controller = new AbortController(); controller.abort();
  await assert.rejects(api.fetchGoogleCalendarSchedules(controller.signal), /aborted/);
});
test('next schedule orders mixed UTC offsets by actual instant', () => {
  const events = [
    { id: 'later', date: '2026-10-18', startDateTime: '2026-10-18T05:00:00Z' },
    { id: 'earlier', date: '2026-10-18', startDateTime: '2026-10-18T13:00:00+09:00' },
  ];
  assert.equal(dates.nextSchedule(events, new Date('2026-10-18T03:00:00Z'), 'Asia/Seoul').id, 'earlier');
});
test('calendar timeout aborts a pending request and clears the timer', async () => {
  let timeoutCallback;
  let cleared = false;
  const api = load('src/services/googleCalendar.ts', {
    setTimeout: (callback, ms) => { assert.equal(ms, 15000); timeoutCallback = callback; return 1; },
    clearTimeout: () => { cleared = true; },
    fetch: (_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('timeout')));
    }),
  });
  const request = api.fetchGoogleCalendarSchedules();
  timeoutCallback();
  await assert.rejects(request, /timeout/);
  assert.equal(cleared, true);
});
