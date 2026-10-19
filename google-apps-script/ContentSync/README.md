# 스프레드시트에서 회원 공지와 영상 관리하기

운영진 전용 Google 스프레드시트에 공지와 영상 목록을 작성한 뒤, 메뉴의 ‘한늬 홈페이지 → 홈페이지에 반영’을 누르면 `hannipage-9c2ff`의 `memberContent/main`에 함께 저장됩니다. 사이트의 Google 로그인, memberUID 및 memberEmails 승인, Firestore 보안 규칙은 그대로 사용합니다. 웹 앱 배포나 자동 트리거는 필요 없습니다.

## 1. 운영진 전용 시트 만들기

Firebase 프로젝트 소유자 계정으로 새 Google 스프레드시트를 만듭니다. 이름은 ‘한늬 홈페이지 관리’처럼 정합니다. 이 시트에는 실제 영상 주소가 저장되므로 운영진만 공유받도록 합니다. 시트 편집자는 바인딩된 스크립트도 편집할 수 있으므로 신뢰하는 운영진만 편집자로 지정합니다.

## 2. Apps Script 코드 붙여넣기

1. 시트의 확장 프로그램 → Apps Script를 엽니다.
2. 기본 Code.gs 내용을 교체합니다.
   - 이 컴퓨터의 `firebase-private/ContentSync-ready.gs`: 바로 붙여넣을 수 있는 최신 코드입니다. 초기 영상 데이터는 포함하지 않습니다.
   - `google-apps-script/ContentSync/Code.gs`: 저장소에 보관한 원본이며 실제 영상 주소는 포함하지 않습니다.
3. 프로젝트 설정의 ‘편집기에 appsscript.json 매니페스트 파일 표시’를 켭니다.
4. 편집기에서 appsscript.json을 열고 이 폴더의 appsscript.json 전체로 교체한 뒤 저장합니다.

기존 로그인용 Members.gs에 합치지 않고 새 스프레드시트의 별도 프로젝트로 사용합니다. 서비스 계정 비공개 키는 만들거나 붙여넣지 않습니다.

## 3. Firebase와 같은 Google Cloud 프로젝트 연결

1. Firebase 프로젝트 설정 → 일반에서 **프로젝트 번호**를 확인합니다. 현재 전달받은 앱 설정 기준으로 `174785447489`이며 콘솔에서 다시 확인합니다. 프로젝트 ID `hannipage-9c2ff`와는 다른 숫자입니다.
2. Apps Script → 프로젝트 설정 → Google Cloud Platform 프로젝트 → 프로젝트 변경에서 그 프로젝트 번호를 입력합니다.
3. 해당 Google Cloud 프로젝트의 API 및 서비스에서 **Cloud Firestore API**가 사용 설정되어 있는지 확인합니다.
4. OAuth 동의 화면 설정을 요구하면 기존 프로젝트의 Google Auth Platform 설정을 확인합니다. 개인 Gmail 운영 프로젝트에서 테스트 모드라면 실행할 운영진 계정을 테스트 사용자로 추가합니다. 기존 Google 로그인 설정을 삭제하지 않습니다.

권한 승인 화면에서 시트 접근과 Firebase 데이터 접근 권한을 승인해야 합니다. 실행한 운영자의 OAuth 토큰으로 요청합니다. Firebase 프로젝트 소유자 계정으로 시작하면 별도의 서비스 계정이 필요 없습니다. 다른 운영자 계정은 프로젝트 관리자에게 필요한 Firestore IAM 접근을 요청해야 하며, 단순 시트 공유 또는 홈페이지 회원 승인은 관리자 쓰기 권한이 아닙니다. 기본 `Cloud Datastore User` 역할은 이 문서 하나보다 넓은 데이터 접근 권한이므로 신뢰하는 운영자에게만 부여합니다.

## 4. 입력 탭 준비

기존 탭은 그대로 사용합니다. 새로 시작한다면 직접 아래 형식으로 준비합니다. Apps Script는 탭을 생성하거나 초기화하지 않습니다.

- 공지: A2에 공지. 영상을 모두 비울 경우에만 B4에 체크박스를 추가하고 체크합니다.
- 영상목록: A1~C1에 id, title, url. 2행부터 입력합니다.
- 공유자료(선택): A1~C1에 id, title, url. 2행부터 Drive 자료를 입력합니다.

Firebase의 memberContent/main 문서는 미리 있어야 합니다. 스프레드시트를 새로고침하면 ‘한늬 홈페이지 → 홈페이지에 반영’ 메뉴가 표시됩니다.

## 5. 수정과 반영

- ‘공지’ 시트 **A2**: 홈페이지에 표시할 공지 전체. 줄바꿈을 사용할 수 있습니다.
- ‘영상목록’ 시트: 1행은 `id`, `title`, `url` 머리글입니다. 2행부터 영상 재생목록을 입력합니다.
- id는 고유한 값, title은 표시 제목, url은 HTTPS YouTube 재생목록 주소입니다.
- 행 순서대로 표시하며 완전히 빈 행은 무시합니다. 한 항목만 비었거나 ID가 중복되면 반영을 중단합니다.
- 메뉴 ‘한늬 홈페이지 → 홈페이지에 반영’을 누르고 확인하면 **공지와 전체 영상 배열을 시트 내용으로 교체**합니다. Firebase에서 별도로 추가한 영상도 시트에 없으면 반영 후 사라집니다.
- 영상을 전부 비우려는 경우에만 ‘공지’ B4 체크박스를 켭니다. 공지 자체는 빈 값으로 반영하지 않습니다.
- 저장은 하나의 문서 요청으로 이루어집니다. 읽기와 저장 사이에 다른 관리자가 변경하면 버전 충돌로 중단합니다.
- 홈페이지의 회원 콘텐츠는 자동 갱신됩니다. 콘텐츠 편집 때마다 홈페이지 재배포는 필요 없습니다. 줄바꿈 표시 개선 코드는 한 번 사이트 배포가 필요합니다.

관리 기준은 이 시트로 통일하세요. Firebase 콘솔에서 직접 바꾼 공지나 영상은 다음 시트 반영 때 교체됩니다. 회원 승인은 계속 Firebase에서 관리합니다.

## 비용

2026-10-19 공식 문서 기준, 이 구성 때문에 Blaze 전환이 필수인 서비스는 없습니다. Google 로그인과 Firestore의 무료 할당량, Apps Script 실행 한도 안에서 Spark 요금제를 유지할 수 있습니다.

Firestore 무료 할당량은 기본 무료 대상 데이터베이스 기준 저장 1 GiB, 하루 문서 읽기 50,000회·쓰기 20,000회·삭제 20,000회, 월 외부 전송 10 GiB입니다. 이 메뉴는 반영 1회당 기존 문서 읽기 1회와 쓰기 1회를 사용합니다. 접속 중인 회원의 실시간 갱신과 접근 규칙 확인은 별도 읽기 사용량을 발생시킵니다. 한도 초과 시 Spark에서는 요청이 제한될 수 있습니다.

Cloud Functions, Firebase Storage, 유료 백업/PITR, SMS 인증은 이 구현에 사용하지 않습니다. Firebase 웹 설정에 storageBucket 값이 있어도 그 버킷을 사용한다는 뜻은 아닙니다. 전체 프로젝트의 현재 결제 설정·사용량은 Firebase 콘솔에서 별도로 확인합니다.

## 검증 범위

로컬 모의 테스트로 입력 검증, 데이터 인코딩, 반영, 업데이트 범위 및 버전 조건, 오류 처리를 검증했습니다. 권한 승인, Firebase 쓰기는 운영 계정에서 설정 후 첫 반영으로 확인해야 합니다.

## 공식 참고 문서

- https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- https://firebase.google.com/docs/firestore/quotas
- https://developers.google.com/apps-script/guides/cloud-platform-projects
- https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken
- https://docs.cloud.google.com/firestore/docs/reference/rest/v1/projects.databases.documents/patch

## 공유 자료 추가 (기존 운영 시트)

1. Apps Script의 PlayLists.gs 전체를 최신 `firebase-private/ContentSync-ready.gs` 내용으로 교체하고 저장합니다. 매니페스트와 프로젝트 연결은 그대로 둡니다.
2. 스프레드시트를 새로고침합니다.
3. 공유자료 탭이 없다면 직접 추가하고 A1~C1에 id, title, url을 입력합니다.
4. 공유자료 탭의 2행부터 A열 id(예: rules), B열 title(예: 팀 회칙), C열 url(Google Drive 파일/폴더 공유 링크)을 입력합니다. 1행 머리글은 유지합니다.
5. ‘한늬 홈페이지 → 홈페이지에 반영’을 누르고 공지·영상·자료 개수를 확인합니다. 자료는 행 순서대로 표시됩니다. 빈 행은 무시하며, 미완성 행·중복 ID·Drive 이외 주소는 반영을 중단합니다.
6. 홈페이지 코드도 한 번 빌드·배포해야 공유 자료 영역이 표시됩니다. 이후 자료 수정은 시트 반영만 하면 됩니다.

Firestore `memberContent/main`에 resources 배열을 함께 저장합니다. 기존 문서에 resources가 없어도 홈페이지는 정상 동작합니다. 공유자료 탭이 없으면 기존 resources를 유지하고, 탭이 있고 데이터 행이 없으면 확인 후 자료 전체를 비웁니다. Firebase 규칙과 회원 승인 문서는 변경하지 않습니다.

Drive의 공유 메뉴에서 복사한 `https://drive.google.com/file/d/...` 또는 `https://drive.google.com/drive/folders/...` 링크를 사용합니다 (`open?id=...`도 지원). Drive 파일 권한은 별도입니다. 팀원 전용 파일/폴더는 제한됨으로 설정하고 해당 Google 계정에 보기 권한을 부여하세요. 이 기능은 파일 자체를 Firebase에 업로드하지 않습니다.

자동 탭 생성과 자동 백업 기록 기능은 없습니다. 기존 반영전백업 탭은 수정하거나 삭제하지 않습니다. 반영 전 확인과 동시 수정 충돌 검사는 유지합니다.

Google 문서와 스프레드시트의 공유 링크도 지원합니다: https://docs.google.com/document/d/... 및 https://docs.google.com/spreadsheets/d/... . C열에는 공유 메뉴에서 복사한 URL을 그대로 입력합니다. 스크립트 코드 교체와 홈페이지 재배포 후 사용할 수 있습니다.
