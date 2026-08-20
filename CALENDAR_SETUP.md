# 한늬 Google Calendar 연동

홈페이지는 Google Calendar의 공개 일정 중 오늘 이후 일정을 시작 시각순으로 가져옵니다. 캘린더 연결이 없거나 API 호출에 실패하면 기존 샘플 일정이 표시됩니다.

## 1. Google Calendar 공개 설정

1. Google Calendar에서 한늬 전용 캘린더를 만듭니다.
2. **설정 및 공유 → 일정의 액세스 권한**에서 캘린더를 공개합니다.
3. **캘린더 통합 → 캘린더 ID**를 복사합니다.

비공개 캘린더를 읽으려면 사용자 로그인과 OAuth 서버 연동이 별도로 필요합니다. 현재 구현은 홈페이지 방문자에게 공개해도 되는 팀 일정 전용 캘린더를 대상으로 합니다.

## 2. Google Calendar API 키 준비

1. Google Cloud 프로젝트에서 **Google Calendar API**를 활성화합니다.
2. API 키를 만들고 API 제한을 **Google Calendar API**로 지정합니다.
3. 애플리케이션 제한을 **웹사이트**로 지정한 뒤 다음 HTTP 리퍼러를 등록합니다.
   - 로컬: `http://localhost:5173/*`, `http://127.0.0.1:5173/*`
   - 배포: 실제 GitHub Pages 주소(예: `https://<계정>.github.io/HanniPage/*`)

`VITE_` 환경 변수는 빌드 결과에 포함되므로 API 키를 비밀번호처럼 사용하면 안 됩니다. 반드시 Calendar API와 위 리퍼러만 허용하도록 제한합니다.

## 3. 프로젝트 환경 변수 설정

`.env.example`을 참고해 커밋하지 않는 `.env.local` 파일을 만듭니다.

```dotenv
VITE_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
VITE_GOOGLE_CALENDAR_API_KEY=your_restricted_api_key
VITE_CALENDAR_TIME_ZONE=Asia/Seoul
VITE_GOOGLE_CALENDAR_MAX_RESULTS=12
VITE_GOOGLE_CALENDAR_LOOKAHEAD_DAYS=120
```

설정 후 개발 서버를 다시 시작합니다.

```bash
npm run dev
```

## 4. 일정 작성 규칙

제목, 시작/종료 시각, 장소는 Google Calendar의 기본 필드를 그대로 사용합니다. 아래 정보가 필요하면 일정의 **설명**에 `항목: 값` 형식으로 적습니다.

```text
종류: 전술
장소: 부천 소사체육센터
주소: 경기도 부천시 ...
코트: 실내 우드 코트
주차: 지하 주차장 2시간 무료
정원: 20
신청: 16
코치: 한늬 코치진
설명: 기본기 훈련 후 5:5 자체전을 진행합니다.
지도: https://map.example.com/...
```

`종류`는 `정기`, `전술`, `매치`, `입문` 중 하나를 권장합니다. 생략하면 제목과 설명의 키워드를 기준으로 자동 분류합니다. `정원`과 `신청`을 모두 생략하면 참석 현황 막대는 표시하지 않습니다.

Google 공식 문서:

- [Events: list](https://developers.google.com/workspace/calendar/api/v3/reference/events/list)
- [Calendar API 인증과 권한](https://developers.google.com/workspace/calendar/api/auth)
