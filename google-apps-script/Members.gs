// Google 시트 > 확장 프로그램 > Apps Script의 Code.gs에 붙여 넣으세요.
const MEMBER_SHEET_ID = '1qCgvz0Oconrko4l84xHguf4iCYWucwZt9UrGPaMPCfk';

function memberJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return memberJson_({ ok: false, message: '로그인 요청이 필요합니다.' });
}

function doPost(e) {
  const invalid = { ok: false, message: '이메일 또는 비밀번호를 확인해주세요.' };
  try {
    const params = e && e.parameter;
    if (!params || params.action !== 'login') return memberJson_(invalid);
    const email = String(params.email || '').trim().toLowerCase();
    const password = String(params.password || '');
    if (!email || email.length > 254 || !password || password.length > 256) {
      return memberJson_(invalid);
    }

    // 동일 이메일에 대한 반복 시도를 10분에 10회로 제한 (캐시 기반 테스트용).
    const key = 'login:' + Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email)
    );
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(5000)) {
      return memberJson_({ ok: false, message: '잠시 후 다시 시도해주세요.' });
    }
    const cache = CacheService.getScriptCache();
    try {
      const now = Date.now();
      let attempts = JSON.parse(cache.get(key) || 'null');
      if (!attempts || now >= attempts.until) attempts = { count: 0, until: now + 600000 };
      if (attempts.count >= 10) {
        return memberJson_({ ok: false, message: '로그인 시도가 많습니다. 10분 후 다시 시도해주세요.' });
      }
      attempts.count += 1;
      cache.put(key, JSON.stringify(attempts), Math.max(1, Math.ceil((attempts.until - now) / 1000)));
    } finally {
      lock.releaseLock();
    }

    const sheet = SpreadsheetApp.openById(MEMBER_SHEET_ID).getSheetByName('Login');
    if (!sheet) throw new Error('Missing Login sheet');
    const rows = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getDisplayValues();
    const matches = rows.filter(row => row[0].trim().toLowerCase() === email);
    // 중복 이메일은 잘못된 비밀번호 행이 인증되는 것을 막기 위해 거부합니다.
    if (matches.length !== 1 || !matches[0][1] || matches[0][1] !== password) {
      return memberJson_(invalid);
    }

    // 비밀번호와 이메일 목록은 반환하지 않습니다. 콘텐츠는 인증 성공 후에만 반환합니다.
    return memberJson_({
      ok: true,
      content: {
        videoId: 'nirLJaNBQXY',
        videoTitle: '경기 영상',
        notice: '공지내용'
      }
    });
  } catch (error) {
    // 요청 내용이나 비밀번호를 로그에 기록하지 않습니다.
    return memberJson_({ ok: false, message: '로그인 서비스 연결을 확인해주세요. 운영진에게 문의해주세요.' });
  }
}
