# 홈페이지 내용 관리

- `about.json`: 한늬 소개 문구, 핵심 가치
- `membership.json`: 가입 안내, 모집 대상, 가입비·월 회비, 안내 링크
- `timeline.json`: 한늬 발자국 제목과 연혁
- `faq.json`: FAQ 제목·설명, 카테고리, 질문·답변, 문의 링크
- `gallery.json`: 갤러리 사진 링크와 제목·날짜·카테고리·설명
- `roster.json`: 선수 사진 링크와 프로필
- `drive-images.json`: 공통 로고·마스코트 사진 링크

## 가입비·월 회비 변경

`membership.json`의 `fees`만 수정하세요. 단위는 원이며 쉼표나 따옴표 없이 숫자를 입력합니다.

```json
"fees": {
  "joining": 30000,
  "monthly": 30000
}
```

- `joining`: 가입비
- `monthly`: 월 회비

소개 화면에서는 `30,000원`으로 표시됩니다. FAQ의 질문이나 답변에 `{{joiningFee}}`, `{{monthlyFee}}`를 쓰면 같은 금액이 자동으로 표시됩니다. FAQ에 금액을 직접 쓰면 자동 연동되지 않으니 금액 자리의 표시 이름은 유지하세요.

```json
"answer": "월 정기 회비는 {{monthlyFee}}입니다."
```

## 소개 수정

`label`, `title`, `titleAccent`, `description`은 소개 제목과 본문입니다. `values`는 핵심 가치 카드입니다. 가입 안내는 `membership.json`에서 수정합니다. `values`의 아이콘은 Heart, Sparkles, Shield를 사용할 수 있습니다. `\n`으로 본문 줄바꿈을 입력할 수 있습니다.

## 한늬 발자국 수정

`timeline.json`의 `title`은 섹션 제목, `items`는 연혁 목록입니다. 각 항목의 `year`(시기), `title`(제목), `description`(설명), `badge`(분류)를 수정하세요. 목록 순서대로 표시되며 항목 추가·삭제도 가능합니다.

## FAQ 수정

`items` 배열에서 질문(`question`), 답변(`answer`), 분류(`category`)를 수정하거나 항목을 추가·삭제하세요. `id`는 다른 질문과 겹치지 않게 지정하세요. `categories` 배열은 분류 버튼의 순서이며, 질문에만 추가한 새 분류도 버튼에 자동 추가됩니다. `contact`에서 문의 문구와 링크를 수정합니다.

내용 수정 후 `npm run dev`로 확인하고 `npm run deploy`로 배포합니다. 사진 링크의 동기화 방법은 프로젝트의 `DRIVE_IMAGES.md`를 참고하세요.


### 갤러리 카테고리와 사진 순서

`src/data/gallery.json`의 `categories`는 버튼 순서, `items`는 사진 목록입니다. 두 순서는 서로 독립적입니다.

```json
"categories": ["대회", "정모", "교류전", "행사"]
```

`categories`의 이름 순서를 바꾸면 버튼 순서만 바뀝니다. `전체`는 자동으로 맨 앞에 표시됩니다. `items`의 순서를 바꾸면 사진 순서만 바뀝니다. 순서 목록에 없는 새 사진 카테고리는 버튼 목록 뒤에 자동으로 추가됩니다. 사진이 없는 카테고리도 명시한 목록에 있으면 버튼으로 표시됩니다.
