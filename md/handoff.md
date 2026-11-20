# 바로온장 DEMO 작업 인계서

이 문서는 다른 PC의 새 Codex 세션에서도 현재 프로젝트 상태와 사용자 결정을 빠르게 복원하기 위한 인계 문서다.

## 1. 저장소와 실행

- 저장소: `https://github.com/Dotori-Store/barojang.git`
- 기본 브랜치: `main`
- 기술 스택: Vue 3, Vue Router, Vite, 일반 JavaScript, 일반 CSS
- 설치: `npm install`
- 개발 서버: `npm run dev`
- 빌드 검증: `npm run build`

집 PC에서는 저장소를 clone 또는 pull한 뒤 이 문서와 아래 필수 문서를 먼저 읽는다.

## 2. 새 세션에서 반드시 읽을 문서

1. `md/project.md`
2. `md/design_guide.md`
3. `md/design-spec.md`
4. `md/design-spec-builder-step1.md`
5. `md/design-spec-builder-flow.md`
6. `md/passcode-guide.md`
7. `md/handoff.md`

## 3. 사용자가 확정한 구현 원칙

- Vue 3 Composition API와 일반 JavaScript를 사용한다.
- 랜딩 페이지는 하나의 Vue 파일에서 HTML 구조를 관리한다.
- 여러 화면에서 실제 재사용하는 요소만 컴포넌트로 분리한다.
- 불필요하게 컴포넌트를 세분화하지 않는다.
- CSS는 별도 `.css` 파일에 작성한다.
- Tailwind, SCSS, CSS-in-JS를 사용하지 않는다.
- `.landing-hero`, `.product-form`처럼 의미를 알 수 있는 클래스명을 사용한다.
- CSS 중첩과 복잡한 선택자를 최소화한다.
- 공통 색상과 폰트는 CSS 변수로 관리한다.
- Figma Auto Layout을 무조건 복잡한 중첩 구조로 옮기지 않는다.
- 기존 HTML/CSS 경험자가 구조와 스타일을 쉽게 파악하고 수정할 수 있어야 한다.
- 문서에 없는 기능을 임의로 추가하지 않는다.
- Figma 화면 구현 전 공식 Figma MCP로 디자인 수치와 에셋을 먼저 확인한다.
- 새 Markdown 문서는 모두 `md/` 폴더에 생성한다.
- Git 커밋과 푸시는 사용자가 요청한 시점에만 한다. 매 변경마다 푸시하지 않는다.

## 4. 디자인 및 폰트

- 폰트 정의와 사용 원칙은 `md/design_guide.md`를 기준으로 한다.
- 주요 폰트: `A2z`, `Pretendard GOV`
- Figma에서 확인한 색상은 `src/styles/base.css`의 CSS 변수로 관리한다.
- 만들기 화면 배경은 Olive100 `#f6f7f6`이다.
- 입력 필드 stroke는 사용자 요청에 따라 제거되어 있다.
- 랜딩의 `landing-final` 이미지는 배경 이미지이며 모든 화면에서 `cover`로 표시한다.

## 5. 주요 Figma 노드

- 전체 만들기 흐름 section: `70:623`
- 1단계 상품 기본 정보: `47:48`
- 2단계 상품 사진과 소개: `48:128`
- 3단계 가게 정보: `65:22`
- 상품 페이지 미리보기: `63:411`
- 완성 및 QR 화면: `67:537`
- AI 사진 꾸미기 3단계 모달: `54:191`
- AI 글 다듬기 완료 버튼: `63:370`
- 미리보기 하단 고정 버튼 영역: `63:414`

Figma 파일 키는 `gWfU5DNvVAmAHFMwzsEJ2u`이다.

## 6. 현재 구현 상태

### 랜딩

- 랜딩 페이지가 구현되어 있다.
- 시작하기 버튼은 `/builder`로 이동한다.
- 랜딩은 과도하게 컴포넌트로 분리하지 않은 구조다.

### 만들기 1단계

- 판매 품목 필드는 사용자 요청으로 제거했다.
- 필수 항목: 상품명, 판매 가격, 중량/용량, 원산지
- 빈 필드 아래에 `필수항목입니다.`를 표시한다.
- 네 필드가 모두 입력되기 전에는 다음 버튼이 비활성화된다.
- 전부 입력하면 다음 버튼이 활성화되고 2단계로 이동한다.

### 만들기 2단계

- 상품 사진 업로드 영역은 현재 DUMMY 디자인이다.
- 필수 항목: 상품특징, 상품소개
- 필수 검증과 다음 버튼 활성화 정책은 1단계와 같다.
- `AI로 사진 꾸미기` 버튼은 실제 AI 없이 더미 화면 과정만 실행한다.
  - 어두운 fixed overlay 위 중앙 모달
  - 분위기 3종 선택
  - `사진을 꾸미고 있어요` 더미 로딩
  - 원본과 꾸민 사진 비교
  - 실제 코인 차감과 AI API 호출 없음
- `AI로 글 다듬기` 버튼은 다음 시각 상태만 전환한다.
  - 기본 `AI로 글 다듬기`
  - `다듬는 중...`
  - 흰색 `원래대로` 버튼
  - `원래대로`를 누르면 기본 버튼으로 복원
  - 실제 상품소개 입력값은 변경하지 않음

### 만들기 3단계

- 필수 항목: 가게 이름, 시장 이름, 주문 전화번호
- 필수 검증 후 미리보기 화면으로 이동한다.

### 미리보기

- 사용자 입력값과 DUMMY 상품 이미지를 사용한다.
- `builder-preview__buttons`는 Figma `63:414`처럼 viewport 하단에 fixed 처리되어 있다.
- 고정 영역은 흰색 배경, 세로 padding 30px, 버튼 간격 20px이다.
- 발행하기와 다시 만들기 버튼은 각각 560×72px을 기준으로 반응형 처리한다.
- 본문에는 고정 버튼 영역에 가리지 않도록 하단 여백이 있다.

### 완성

- DUMMY QR과 DUMMY 상품 이미지가 표시된다.
- QR 다운로드와 주소 복사는 아직 실제 기능이 아니다.

## 7. 보안·사용자·코인 정책

상세 정책은 `md/project.md`와 `md/passcode-guide.md`를 따른다.

- 회원가입과 일반 로그인은 구현하지 않는다.
- 운영자가 발급한 인증코드 3개를 서버에서 검증하는 방향이다.
- 실제 인증코드 원문을 프런트엔드나 저장소에 넣지 않는다.
- 인증코드는 해시로 저장하고 사용자 ID와 연결한다.
- 사용자별 상품은 최대 1개다.
- 현재 해당 서버 인증 기능은 구현하지 않았다.
- 기존 토큰 및 실제 코인 차감 정책은 적용하지 않는다.
- 화면의 코인 수치는 DEMO용 정적 표시다.
- AI 모달의 코인 문구도 디자인 확인용이며 실제 차감하지 않는다.

## 8. DUMMY 및 미구현 범위

- 상품 이미지와 QR은 로컬 DUMMY 에셋이다.
- 상품 이미지 업로드 및 Storage 저장은 구현하지 않았다.
- AI 이미지 생성 및 AI 문구 보정 API는 연결하지 않았다.
- QR 생성, QR 다운로드, 클립보드 복사는 구현하지 않았다.
- 문서에서 승인되지 않은 서버·DB·API 기능을 임의로 추가하지 않는다.

## 9. 주요 구현 파일

- `src/pages/LandingPage.vue`
- `src/pages/BuilderPage.vue`
- `src/styles/landing.css`
- `src/styles/builder.css`
- `src/styles/base.css`
- `src/assets/builder/`

`BuilderPage.vue` 한 파일에서 1단계, 2단계, 3단계, 미리보기, 완성 화면과 AI 더미 상태를 관리한다. 사용자가 단순한 구조를 원하므로 승인 없이 단계별 컴포넌트로 쪼개지 않는다.

## 10. 검증 및 Git 주의사항

- 마지막 구현 작업들은 `npm run build`와 `git diff --check`를 통과했다.
- 작업 시작 시 항상 `git status --short`로 상태를 확인한다.
- 사용자 변경사항과 관계없는 파일을 되돌리거나 삭제하지 않는다.
- `md/passcode-guide.md`에는 정책만 있으며 실제 인증코드는 없다.
- `.env`, 인증코드, 비밀번호, API 키는 Git에 커밋하지 않는다.
- 이 인계 커밋은 로컬 커밋이며, 집에서 받으려면 별도로 `git push origin main`이 필요하다.

## 11. 집에서 새 Codex 세션을 시작할 때 사용할 문장

```text
프로젝트 루트의 md/project.md, md/design_guide.md, md/design-spec.md,
md/design-spec-builder-step1.md, md/design-spec-builder-flow.md,
md/passcode-guide.md, md/handoff.md를 모두 읽고 git status를 확인해 줘.
현재 Vue/CSS 구조와 사용자 결정을 유지하면서 이어서 작업하고,
문서에 없는 기능은 추가하지 마. Figma 구현은 공식 Figma MCP로 먼저 확인하고,
Git 푸시는 내가 요청할 때만 해.
```

