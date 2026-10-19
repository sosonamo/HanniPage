# 한늬 Google 로그인 설정

코드는 Google 로그인과 Firestore 회원 승인 방식으로 전환되어 있습니다. Firebase 설정 전에는 회원 페이지에 ‘회원 로그인 준비 중’이 표시됩니다. 기존 Google 시트 비밀번호는 새 로그인에 사용하지 않습니다. 홈페이지는 계속 GitHub Pages에서 운영할 수 있습니다.

## 1. Firebase 프로젝트와 웹 앱 만들기

1. https://console.firebase.google.com 에 운영진 Google 계정으로 접속합니다.
2. 프로젝트를 만들거나 한늬 전용 프로젝트를 선택합니다. Analytics는 이번 기능에 필요하지 않습니다.
3. 프로젝트 설정 → 일반 → 내 앱 → 웹 앱(`</>`)을 등록합니다. Firebase Hosting 설정은 필요하지 않습니다.
4. SDK 설정의 `firebaseConfig`에서 `apiKey`, `authDomain`, `projectId`, `appId`를 확인합니다.
5. 기존 `.env.local` 또는 `.env`에 아래 네 값을 추가합니다. 기존 캘린더 설정은 유지합니다.

```dotenv
VITE_FIREBASE_API_KEY=복사한_apiKey
VITE_FIREBASE_AUTH_DOMAIN=복사한_authDomain
VITE_FIREBASE_PROJECT_ID=복사한_projectId
VITE_FIREBASE_APP_ID=복사한_appId
```

이 값들은 브라우저용 공개 설정입니다. 서비스 계정 JSON, private_key, Google 비밀번호는 입력하거나 공유하지 않습니다. 값 추가 후 개발 서버를 재시작하고, 배포할 때 다시 빌드합니다. 과거 `VITE_MEMBERS_API_URL`은 더 이상 사용하지 않습니다.

## 2. Google 로그인 켜기

1. Authentication → 시작하기 → 로그인 방법에서 Google을 활성화합니다.
2. 지원 이메일을 선택하고 저장합니다. 이메일/비밀번호 제공자는 이번 기능에 필요하지 않습니다.
3. Authentication → Settings → Authorized domains에 실제 사이트 호스트를 추가합니다.
   - 현재 저장소의 기본 GitHub Pages 호스트: `sosonamo.github.io`
   - 개발용: `localhost`, `127.0.0.1`
   - 별도 도메인으로 운영한다면 그 호스트도 추가합니다.
4. 도메인에는 `https://`나 `/HanniPage/`를 붙이지 않습니다. `authDomain`은 임의로 GitHub 주소로 바꾸지 않고 Firebase 설정값을 그대로 사용합니다.

로그인은 팝업 방식입니다. 팝업을 허용하고, 카카오톡 등 앱 내부 브라우저에서 실패하면 Safari나 Chrome으로 열어 테스트합니다.

## 3. Firestore 만들고 접근 규칙 적용하기

1. Firestore Database → 데이터베이스 만들기로 이동합니다.
2. Standard edition, 기본 데이터베이스 `(default)`를 선택합니다. 테스트 모드 대신 프로덕션 모드로 시작합니다.
3. 위치를 선택합니다. 한국 중심 서비스라면 서울 위치가 제공되는지 확인하고 선택합니다. 위치는 신중하게 결정합니다.
4. Rules 탭에 저장소의 `firestore.rules` 전체 내용을 붙여넣고 Publish를 누릅니다. 기존의 전체 공개 규칙과 함께 두지 마세요.

이 규칙은 본인 승인 상태 조회만 허용하고, 검증된 Google 계정이면서 `memberUID/{UID}.active`가 boolean `true`일 때에만 `memberContent/main`을 읽게 합니다. 회원 목록 조회, 자기 승인, 콘텐츠 쓰기는 브라우저에서 모두 금지합니다. 운영진은 Firebase 콘솔에서 관리합니다.

## 4. 회원 공지와 영상 데이터 준비하기

Firestore Data 탭에서 다음 문서를 만듭니다.

- 컬렉션: `memberContent`
- 문서 ID: `main`
- `notice`: string, 실제 회원 공지
- `playlists`: array, 처음에는 빈 배열로 저장해도 됩니다.

영상 하나마다 `playlists` 배열에 map 항목을 추가합니다. 각 map에는 다음 string 필드를 넣습니다.

```json
{
  "id": "고유한-영상목록-ID",
  "title": "2026 정모",
  "url": "https://www.youtube.com/playlist?list=실제재생목록ID"
}
```

기존 영상 목록 11개는 이 컴퓨터의 `firebase-private/member-content.json`으로 옮겨 두었습니다. `.gitignore`에 포함되어 저장소와 사이트 빌드에는 들어가지 않습니다. 이 파일을 보면서 실제 목록을 등록하세요. ‘2026 교류전’ 주소는 올바른 주소인지 먼저 확인해야 합니다. Firebase 콘솔의 Data 탭은 JSON 파일을 그대로 업로드하는 화면이 아니므로 필드를 생성해 넣습니다.

기존 주소는 이전 배포·Git 기록에 남아 있을 수 있습니다. 새 빌드에서 제거하는 것으로 과거에 공개된 링크가 회수되지는 않습니다. YouTube 일부 공개 영상은 링크를 아는 사람이 계속 볼 수 있습니다.

## 5. 이메일 사전 승인 또는 UID 승인

`memberUID/{UID}` 문서로 UID 승인을 관리합니다. 이전 `members` 문서는 아래 이름 전환 절차에 따라 먼저 복사합니다. UID 승인 또는 이메일 승인 중 하나가 true이면 접근할 수 있습니다. 먼저 수정된 `firestore.rules` 전체를 Firebase Rules 탭에 다시 게시하세요.

### 이메일을 미리 등록하는 방법

1. Firestore Data 상단의 집 아이콘을 눌러 최상위로 이동합니다. `memberContent/main` 안에서 만들지 않습니다.
2. 최상위 컬렉션 `memberEmails`를 만듭니다.
3. 문서 ID에 팀원이 Google 로그인에 사용할 이메일을 **앞뒤 공백 없이 소문자**로 입력합니다. 예: `player@gmail.com`.
4. `active` 필드를 boolean `true`로 저장합니다.
5. 팀원은 해당 Google 계정으로 로그인하면 바로 이용할 수 있습니다. UID 사전 등록은 필요 없습니다.

이메일은 정확히 일치해야 합니다. Gmail의 점이나 `+별칭`을 임의로 제거하지 않습니다. Google이 인증한 이메일만 검사하며 다른 사용자의 이메일 승인 문서나 전체 명단을 읽을 수 없습니다.

**승인 취소:** 이메일과 UID 양쪽에 등록한 회원은 양쪽의 `active`를 모두 false로 바꿔야 합니다. 한쪽을 false로 바꿔도 다른 쪽이 true이면 계속 승인됩니다.

### 기존 UID 승인 방법


1. 로컬 서버에서 `/HanniPage/members.html`을 열고 Google로 로그인합니다.
2. 처음에는 ‘팀원 승인 대기’가 나오는 것이 정상입니다. 표시된 UID를 복사합니다.
3. Firebase Authentication → Users에서 해당 UID의 이메일이 실제 승인할 팀원의 계정인지 확인합니다.
4. Firestore에서 `memberUID` 컬렉션을 만들고, 문서 ID를 그 UID와 정확히 같게 지정합니다.
5. 필드 `active`를 **boolean** 타입 **true**로 저장합니다. 문자열 `"true"`가 아닙니다.
6. 열려 있는 회원 페이지에 공지와 영상 목록이 표시되는지 확인합니다.

Google로 로그인한 모든 사람이 회원으로 자동 승인되지는 않습니다. 팀원마다 처음 한 번 위 절차로 승인합니다. 탈퇴 시 해당 UID 문서와 등록된 이메일 문서의 `active`를 모두 false로 바꿉니다. 이미 사용자가 읽거나 복사한 정보는 회수할 수 없습니다.

## 6. 배포 전 확인과 기존 인증 중지

1. 승인 계정은 공지·영상을 읽고, 미승인 계정은 승인 대기만 보이는지 확인합니다.
2. 승인 취소 시 열려 있는 화면에서 콘텐츠가 사라지는지 확인합니다.
3. 로그아웃 후 콘텐츠가 보이지 않는지, 새로고침·다른 계정 로그인도 확인합니다.
4. Firestore 규칙 테스트도 실행하거나 Rules Playground에서 미인증 접근과 비회원 접근 거절을 확인합니다.
5. Firebase 환경값이 들어 있는 상태에서 `npm run lint`, `npm test`, `npm run build` 후 기존 배포 방식(`npm run deploy`)으로 배포합니다.
6. 실제 사이트에서도 로그인·승인·차단을 확인합니다.
7. 기존 Apps Script의 배포 → 배포 관리에서 로그인 웹 앱 배포를 보관 처리하여 이전 `/exec` 엔드포인트를 중지합니다. 활성 배포가 여러 개면 모두 확인합니다.
8. 기존 로그인 시트의 평문 비밀번호를 제거하고 공유 권한·사본·기록에 남은 정보를 확인합니다. 단순 셀 삭제가 이전 버전까지 지우는 것은 아닙니다. 기존 서비스용 비밀번호는 폐기하고 재사용하지 않습니다.

저장소의 `google-apps-script/Members.gs`와 기존 인증 테스트는 이전 구현 기록입니다. 새 회원 화면은 호출하지 않습니다. 코드 수정만으로 이미 배포된 Apps Script가 중지되지는 않습니다.

## 개발 검증

`npm test`는 콘텐츠 검증과 승인 상태 변경 등 클라이언트 테스트를 실행합니다. 실제 Firestore 규칙 실행과는 별개입니다.

Firestore 규칙 테스트에는 Firebase CLI와 에뮬레이터가 지원하는 Java 런타임이 필요합니다. 다음 명령은 테스트용 프로젝트 ID만 사용합니다.

```sh
npx firebase-tools emulators:exec --only firestore --project demo-hanni-auth "npm run test:rules"
```

`tests/firestore/access.test.cjs`는 승인 회원, 비회원, 미인증 사용자, 미검증 이메일, 다른 인증 방식, 자기 승인 시도, 목록 조회, 콘텐츠 쓰기, 승인 취소를 검사합니다. 운영 프로젝트에 연결해 실행하지 않습니다.

## 공식 문서

- [Google 로그인](https://firebase.google.com/docs/auth/web/google-signin)
- [Firestore 보안 규칙](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [보안 규칙 테스트](https://firebase.google.com/docs/rules/unit-tests)

## 기존 members 컬렉션에서 이름 전환

코드와 규칙은 이제 `memberUID/{UID}`를 사용합니다. 기존 Firebase 문서는 자동으로 이동하지 않습니다.

1. 기존 최상위 `members`의 승인 문서마다 UID와 active 값을 확인합니다.
2. 최상위에 `memberUID` 컬렉션을 만들고, 동일한 문서 ID와 active 값으로 복사합니다. false인 회원을 true로 바꾸지 않습니다.
3. 복사가 끝나면 새 `firestore.rules`를 게시하고 새 사이트 코드를 배포합니다.
4. 기존 UID 회원의 로그인을 확인합니다. 기존 `members`는 더 이상 승인에 사용되지 않으며, 확인 전에는 삭제하지 않습니다.
5. 이메일 승인 컬렉션 `memberEmails`는 그대로 유지합니다.


## 접속 중인 팀원 표시

회원 페이지 헤더에서 `접속 중 N명`을 누르면 현재 접속한 팀원의 Google 표시 이름이 펼쳐집니다. 이름이 없는 계정은 `회원`으로 표시하며 접속 문서에 이메일은 저장하지 않습니다. 승인 상태가 확인되고 회원 콘텐츠가 로드된 페이지에서만 동작합니다.

**배포 순서:** 변경된 `firestore.rules` 전체를 Firebase 콘솔의 Firestore → Rules에 먼저 게시한 다음 사이트를 빌드·배포합니다. 이전 규칙에서는 새 `memberPresence` 컬렉션 접근이 차단되어 `접속 확인 불가`가 표시됩니다. 컬렉션은 최초 접속 시 자동 생성됩니다.

- UID 또는 이메일로 승인된 Google 사용자만 접속 명단을 읽고 자기 접속 정보를 기록할 수 있습니다. 미승인·로그아웃 사용자의 조회 및 타인의 접속 정보 변경은 규칙에서 차단됩니다.
- 페이지마다 별도 접속 문서를 생성하고 UID로 중복을 제거합니다. 같은 사람이 여러 탭이나 기기를 열어도 한 명으로 집계합니다.
- 30초마다 서버 시간으로 접속을 갱신합니다. 마지막 갱신 후 90초가 지나면 목록에서 제외하며 화면은 5초 간격으로 만료를 확인합니다. 창 닫기·로그아웃 시에는 자기 세션 삭제도 시도합니다.
- 연결 끊김, 기기 절전, 백그라운드 탭의 타이머 제한으로 표시가 지연되거나 열린 탭이 일시적으로 제외될 수 있습니다. 다시 활성화하면 접속 상태를 갱신합니다.
- 주기적인 문서 쓰기와 실시간 조회가 발생합니다. 비정상 종료로 남은 오래된 문서는 조회에서 제외되지만 저장소에서는 자동 삭제되지 않습니다. 필요 시 운영진이 오래된 `memberPresence` 문서를 정리합니다.
- `npm test`에 중복 탭·만료·구독 해제·캐시 차단 검증을 포함했습니다. `npm run test:rules`에는 승인 여부, 본인 세션만 수정·삭제, 임의 타임스탬프 및 추가 필드 차단 검증을 포함했습니다.

Firestore는 기본 접속 감지 기능을 제공하지 않으므로 이 구현은 주기적인 갱신으로 접속 상태를 추정합니다. [Firebase 접속 상태 문서](https://firebase.google.com/docs/firestore/solutions/presence)
