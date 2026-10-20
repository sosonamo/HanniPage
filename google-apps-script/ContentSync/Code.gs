// Bound to an operator-only Google Sheet. No web-app deployment or triggers required.
const CONTENT_PROJECT_ID = 'hannipage-9c2ff';
const CONTENT_URL = 'https://firestore.googleapis.com/v1/projects/' + CONTENT_PROJECT_ID + '/databases/(default)/documents/memberContent/main';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('한늬 홈페이지')
    .addItem('홈페이지에 반영', 'publishMemberContent')
    .addToUi();
}

function contentRequest_(method, suffix, body) {
  const options = {
    method: method, muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  };
  if (body) { options.contentType = 'application/json'; options.payload = JSON.stringify(body); }
  const response = UrlFetchApp.fetch(CONTENT_URL + (suffix || ''), options);
  const status = response.getResponseCode();
  if (status < 200 || status >= 300) {
    if (status === 401 || status === 403) throw new Error('Firebase 접근 권한을 확인해주세요. 실행 계정의 IAM 권한, Cloud Firestore API, Apps Script OAuth 권한이 필요합니다.');
    if (status === 404) throw new Error('Firebase에 memberContent/main 문서를 먼저 만들어주세요.');
    if (status === 409 || status === 412) throw new Error('다른 곳에서 내용이 변경되어 반영을 중단했습니다. 최신 내용을 확인하고 다시 시도해주세요.');
    throw new Error('Firebase 요청 실패 (HTTP ' + status + '). 잠시 후 다시 시도해주세요.');
  }
  return JSON.parse(response.getContentText());
}

function validateResources_(rows, allowMissingUrl) {
  const ids = Object.create(null);
  const resources = [];
  rows.forEach(function (row, index) {
    const values = row.map(function (value) { return String(value).trim(); });
    if (values.every(function (v) { return !v; })) return;
    const id = values[0], title = values[1], url = values[2];
    if (!id || !title || (!url && !allowMissingUrl) || id.length > 100 || title.length > 200 || url.length > 2000) throw new Error('공유자료 ' + (index + 2) + '행의 id, title, url을 확인해주세요.');
    if (Object.prototype.hasOwnProperty.call(ids, id)) throw new Error('자료 ID가 중복되었습니다: ' + id);
    if (url && !/^https:\/\/(?:drive\.google\.com\/(?:file\/d\/[A-Za-z0-9_-]+|drive\/(?:u\/\d+\/)?folders\/[A-Za-z0-9_-]+|open\?id=[A-Za-z0-9_-]+)|docs\.google\.com\/(?:document|spreadsheets)\/(?:u\/\d+\/)?d\/[A-Za-z0-9_-]+)(?:[/?&#][^\s]*)?$/.test(url)) {
      throw new Error('공유자료 ' + (index + 2) + '행에 Google Drive 파일·폴더 또는 Google 문서·스프레드시트 공유 주소를 입력해주세요.');
    }
    ids[id] = true;
    resources.push({ id: id, title: title, url: url });
  });
  if (resources.length > 100) throw new Error('공유 자료는 최대 100개까지 반영할 수 있습니다.');
  return resources;
}

function validateSheetContent_(notice, rows, allowEmpty) {
  if (!notice.trim() || notice.length > 10000) throw new Error('공지 A2에 1~10,000자의 공지를 입력해주세요.');
  const ids = Object.create(null);
  const playlists = [];
  rows.forEach(function (row, index) {
    const values = row.map(function (value) { return String(value).trim(); });
    if (values.every(function (v) { return !v; })) return;
    const id = values[0], title = values[1], url = values[2];
    if (!id || !title || !url) throw new Error('영상목록 ' + (index + 2) + '행의 id, title, url을 모두 입력해주세요.');
    if (id.length > 100 || title.length > 200 || url.length > 2000) throw new Error('영상목록 ' + (index + 2) + '행의 값이 너무 깁니다.');
    if (Object.prototype.hasOwnProperty.call(ids, id)) throw new Error('영상 ID가 중복되었습니다: ' + id);
    ids[id] = true;
    if (!/^https:\/\/(?:www\.)?youtube\.com\/playlist\?[^\s]+$/.test(url)
      || !/[?&]list=[A-Za-z0-9_-]+(?:&|$)/.test(url.split('#')[0])) {
      throw new Error('영상목록 ' + (index + 2) + '행에 올바른 YouTube 재생목록 주소를 입력해주세요.');
    }
    playlists.push({ id: id, title: title, url: url });
  });
  if (!playlists.length && !allowEmpty) throw new Error('영상 목록이 비어 있어 반영하지 않았습니다. 모두 비우려면 공지 시트 B4를 체크해주세요.');
  if (playlists.length > 100) throw new Error('영상 목록은 최대 100개까지 반영할 수 있습니다.');
  return { notice: notice, playlists: playlists };
}

function encodeContent_(content) {
  const document = { fields: {
    notice: { stringValue: content.notice },
    playlists: { arrayValue: { values: content.playlists.map(function (item) {
      return { mapValue: { fields: { id: { stringValue: item.id }, title: { stringValue: item.title }, url: { stringValue: item.url } } } };
    }) } }
  } };
  if (content.resources !== undefined) document.fields.resources = { arrayValue: { values: content.resources.map(function (item) {
    return { mapValue: { fields: { id: { stringValue: item.id }, title: { stringValue: item.title }, url: { stringValue: item.url } } } };
  }) } };
  if (content.matchResources !== undefined) document.fields.matchResources = { arrayValue: { values: content.matchResources.map(function (item) {
    return { mapValue: { fields: { id: { stringValue: item.id }, title: { stringValue: item.title }, url: { stringValue: item.url } } } };
  }) } };
  return document;
}

function publishMemberContent() {
  const ui = SpreadsheetApp.getUi();
  let content;
  const book = SpreadsheetApp.getActiveSpreadsheet();
  try {
    const announcement = book.getSheetByName('공지');
    const sheet = book.getSheetByName('영상목록');
    if (!announcement || !sheet) throw new Error('공지와 영상목록 탭이 있는지 이름을 확인해주세요.');
    const rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getDisplayValues() : [];
    content = validateSheetContent_(announcement.getRange('A2').getDisplayValue(), rows, announcement.getRange('B4').getValue() === true);
    const matchSheet = book.getSheetByName('경기자료');
    if (matchSheet) {
      const matchRows = matchSheet.getLastRow() > 1 ? matchSheet.getRange(2, 1, matchSheet.getLastRow() - 1, 3).getDisplayValues() : [];
      try { content.matchResources = validateResources_(matchRows, true); }
      catch (error) { throw new Error(error.message.replace(/공유자료|공유 자료/g, '경기자료')); }
    }
    const resourceSheet = book.getSheetByName('공유자료');
    if (resourceSheet) {
      const resourceRows = resourceSheet.getLastRow() > 1 ? resourceSheet.getRange(2, 1, resourceSheet.getLastRow() - 1, 3).getDisplayValues() : [];
      content.resources = validateResources_(resourceRows);
    }
  } catch (error) { ui.alert(error.message); return; }
  if (ui.alert('홈페이지에 반영', '현재 공지와 영상 목록을 시트의 공지 및 영상 ' + content.playlists.length + '개로 교체합니다.' + (content.resources !== undefined ? ' 공유 자료도 ' + content.resources.length + '개로 교체합니다 (0개이면 전체 삭제).' : ' 공유자료 시트가 없어 기존 자료는 유지합니다.') + (content.matchResources !== undefined ? ' 경기자료도 ' + content.matchResources.length + '개로 교체합니다 (0개이면 전체 삭제).' : ' 경기자료 시트가 없어 기존 경기자료는 유지합니다.') + ' 반영할까요?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  // Acquire the lock after the dialog: Apps Script locks do not survive alert suspension.
  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) { ui.alert('다른 반영 작업이 진행 중입니다. 잠시 후 다시 시도해주세요.'); return; }
  let message;
  try {
    const current = contentRequest_('get');
    if (!current.updateTime) throw new Error('Firebase 문서 버전을 확인하지 못했습니다.');
    const query = '?updateMask.fieldPaths=notice&updateMask.fieldPaths=playlists' + (content.resources !== undefined ? '&updateMask.fieldPaths=resources' : '') + (content.matchResources !== undefined ? '&updateMask.fieldPaths=matchResources' : '') + '&currentDocument.updateTime=' + encodeURIComponent(current.updateTime);
    contentRequest_('patch', query, encodeContent_(content));
    message = '반영 완료: 공지와 영상 ' + content.playlists.length + '개' + (content.resources !== undefined ? ', 공유 자료 ' + content.resources.length + '개' : '') + (content.matchResources !== undefined ? ', 경기자료 ' + content.matchResources.length + '개' : '') + '를 저장했습니다. 홈페이지에 자동 반영됩니다.';
  } catch (error) { message = error.message; }
  finally { lock.releaseLock(); }
  ui.alert(message);
}
