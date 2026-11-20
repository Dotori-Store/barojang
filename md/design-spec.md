# 바로온장 랜딩 디자인 명세

> 상태: Figma 수치 추출 완료 / 퍼블리싱 승인 대기  
> 작성 기준일: 2026-11-20  
> 대상 파일: `바로온장`  
> 대상 프레임: `Landing` (`4:10`)  
> Figma URL: https://www.figma.com/design/gWfU5DNvVAmAHFMwzsEJ2u/%EB%B0%94%EB%A1%9C%EC%98%A8%EC%9E%A5?node-id=4-10&t=81flELUYER8vxDQR-4

## 1. 기준과 표기

- 이 문서는 Figma 공식 MCP의 디자인 컨텍스트, 메타데이터, 변수 정의 및 프레임 스크린샷을 기준으로 작성했다.
- `추출`은 Figma에서 직접 확인된 값이다.
- `추론`은 브라우저 반응형 동작처럼 Figma에 명시되지 않아 구현 전에 승인이 필요한 값이다.
- 현재 단계에서는 에셋 다운로드, 랜딩 마크업 및 화면 퍼블리싱을 진행하지 않는다.
- Figma 임시 에셋 URL은 런타임 경로로 사용하지 않는다. 퍼블리싱 승인 후 원본을 로컬 에셋으로 내려받아 사용한다.

## 2. 전체 프레임

| 항목 | 값 | 근거 |
| --- | --- | --- |
| 프레임 | `Landing` (`4:10`) | 추출 |
| 크기 | 1920 × 4438px | 추출 |
| 기본 배경 | `#FFFFFF` | 추출, `FFF` 스타일 |
| 기준 화면 | 데스크톱 1920px | 추출 |
| 콘텐츠 기준 폭 | 주로 1440px | 추출 |
| 좌우 여백 | 주로 240px | 추출 |

페이지는 Header → Hero → 소개하기 → How it works → Results → Final CTA → Footer 순서다.

## 3. 섹션 구조와 수치

### 3.1 Header (`4:11`)

- 위치/크기: x 0, y 0, 1920 × 90px — 추출
- 배경: `FFF` (`#FFFFFF`) — 추출
- 로고: x 240, y 23, 109 × 38px — 추출
- 우측 영역: x 1547, y 20, 133 × 38px — 추출
- 우측 요소 간격: 12px — 추출
- 코인 배지: 83 × 38px, 배경 `Carrot`, radius 20px — 추출
- 코인 배지 내부: 좌 8px, 우 14px, 상하 9px, 요소 간격 8px — 추출
- 프로필: 38 × 38px — 추출
- 표시 숫자: Figma 원본은 `8 코인`이다. `project.md` 정책상 고정 목업 값이며 실제 잔액과 연결하지 않는다.

### 3.2 Hero (`4:23` + Center `12:1093`)

- 위치/크기: x 0, y 90, 1921 × 860px — 추출
- 배경: `Olive/Olive100` (`#F6F7F6`) — 추출
- 슬로건 그룹: x 660, y 100, 602 × 389px — 추출
- 그룹 내부 세로 간격: 34px — 추출
- 대표 제목: 48px, A2Z SemiBold, line-height 1.4, letter-spacing -0.48px, 중앙 정렬 — 추출
- 서비스 설명: 20px, A2Z Regular, line-height 1.6, `Carrot` — 추출
- CTA: 260 × 68px, padding 16px 24px, radius 14px — 추출
- CTA 배경: 102.692° 선형 그라디언트, `#FF6430` 0% → `#F24714` 96.731% — 추출
- CTA 텍스트: 20px, A2Z SemiBold, line-height 1, letter-spacing 1px, 흰색 — 추출
- 보조 문구: 16px, A2Z Regular, line-height 21px, `GrayText` — 추출
- 중앙 모바일 이미지: x 790, y 649, 340 × 654px, radius 39px — 추출
- QR: x 1068, y 949(페이지 기준), 124 × 124px — 추출
- 하단 상품 이미지 슬롯은 각각 250~330px이며 radius 40px — 추출

### 3.3 소개하기 (`4:53`)

- 위치/크기: y 950, 1920 × 840px — 추출
- 배경: `FFF` — 추출
- 상단 질문 그룹: x 240, y 100, 465 × 165px — 추출
- 강조 문구: 18px, A2Z Regular, line-height 21px, `Carrot` — 추출
- 제목: 38px, A2Z SemiBold, line-height 1.5, `#24272C` — 추출(직접 색상)
- 우측 스토어 그룹: x 1215, y 100, 465 × 165px — 추출
- 설명 박스: padding 24px, radius 16px, `Pastel/Blue100` — 추출
- 문제 카드 그룹: x 240, y 460, 1440 × 300px, gap 32px — 추출
- 카드: 약 458.67 × 300px, padding 40px, gap 16px, radius 24px, `Pastel/Beige100` — 추출

### 3.4 How it works (`4:69`)

- 위치/크기: y 1790, 1920 × 827px — 추출
- 배경: `Pastel/Blue100` — 추출
- 섹션 padding: 좌우 240px, 상하 130px — 추출
- 제목/설명 간격: 16px — 추출
- 제목: `Hd38` — 추출
- 설명: `Hdsub16`, `GrayText` — 추출
- 카드 그룹: 1440 × 380px, gap 32px — 추출
- 카드: 약 458.67 × 380px, padding 40px, gap 16px, radius 24px, 흰색 — 추출
- 단계 숫자: 24px Inter Bold, line-height 19.5px, `Carrot` — 추출
- 카드 제목: `HdCard24`, `#34373B` — 추출(직접 색상)
- 카드 설명: 16px A2Z Light, line-height 1.5, `#72767D` — 추출(직접 색상)

### 3.5 Results (`4:112`)

- 위치/크기: y 2617, 1920 × 869px — 추출
- 배경: `FFF` — 추출
- 섹션 padding: 좌우 230px, 상하 130px — 추출
- 제목 그룹과 카드 그룹 간격: 92px — 추출
- 카드 그룹: 1460 × 420px, gap 32px — 추출
- 카드: 약 465.33 × 420px, padding 40px, radius 24px — 추출
- 카드 배경: 1번 `#F6F7F6`, 2번 `#F7F8FA`, 3번 `#FAF7F3` — 추출
- 카드 제목/설명 간격: 30px — 추출
- 카드 하단 문구: 14px A2Z Regular, line-height 21px, `Carrot` — 추출

### 3.6 Final CTA (`4:148`)

- 위치/크기: y 3486, 1920 × 662px — 추출
- 배경 이미지 슬롯: 1920 × 662px, 원본 이미지 레이어 1944 × 1094.081px — 추출
- 이미지 효과: blur 5px, 흰색 10% 오버레이 — 추출
- 콘텐츠: 중앙 정렬, gap 60px — 추출
- 제목/설명 그룹: 588 × 103px, gap 16px — 추출
- CTA 버튼은 Hero와 동일한 260 × 68px 및 동일 그라디언트 — 추출

### 3.7 Footer (`4:155`)

- 위치/크기: y 4148, 1920 × 290px — 추출
- 배경: `Pastel/Blue100` — 추출
- 내부 padding: 좌우 832px, 상하 80px — 추출
- 카피 그룹: 256 × 130px, gap 25px, 중앙 정렬 — 추출
- 브랜드명: 25px A2Z Bold, line-height 37.5px, `Dark` — 추출
- 설명: 16px A2Z Regular, line-height 1.5, `GrayText` — 추출
- 저작권: 12px Inter Regular, line-height 18px, `GrayText` — 추출

## 4. 컬러 토큰

### 4.1 Figma에 등록된 컬러 스타일

| CSS 변수 | Figma 이름 | 값 |
| --- | --- | --- |
| `--color-text-dark` | Dark | `#13161C` |
| `--color-text-muted` | GrayText | `#7B818B` |
| `--color-surface-blue` | Pastel/Blue100 | `#F7F8FA` |
| `--color-gray-6` | Gray 6 | `#F2F2F2` |
| `--color-carrot` | Carrot | `#FF6430` |
| `--color-white` | FFF | `#FFFFFF` |
| `--color-olive-400` | Olive/Olive400 | `#7C8576` |
| `--color-green-500` | Accent/Green500 | `#80AE4A` |
| `--color-olive-200` | Olive/Olive200 | `#ECF0EC` |
| `--color-olive-100` | Olive/Olive100 | `#F6F7F6` |
| `--color-beige-100` | Pastel/Beige100 | `#FAF7F3` |
| `--color-olive-800` | Olive/Olive800 | `#375342` |

### 4.2 프레임에서 직접 추출한 미등록 색상

아래 값은 화면에 실제 사용되지만 MCP 변수 정의에는 등록된 스타일로 나타나지 않았다.

| CSS 변수 | 값 | 사용처 |
| --- | --- | --- |
| `--color-text-heading` | `#24272C` | 소개 섹션 제목 |
| `--color-text-card` | `#34373B` | 단계 카드 제목 |
| `--color-text-body` | `#72767D` | 단계 카드 설명 |
| `--color-product-dark` | `#304934` | 미니 상품 카드 텍스트 |
| `--color-ai-surface` | `#FFF4E8` | AI 이미지 영역 배경 |
| `--color-carrot-deep` | `#F24714` | CTA 그라디언트 끝점 |

CSS에서는 색상 리터럴을 컴포넌트에 반복하지 않고 위 변수만 사용한다. 미등록 색상을 Figma 정식 스타일로 승격할지는 디자이너 확인 사항이다.

## 5. 타이포그래피

| 역할 | 패밀리/스타일 | 크기 | 행간 | 자간 | 근거 |
| --- | --- | ---: | ---: | ---: | --- |
| Hero 제목 | A2Z 6 SemiBold | 48px | 1.4 | -0.48px | 추출 |
| 섹션 제목 `Hd38` | A2Z 6 SemiBold | 38px | 1.5 | 0 | 추출 스타일 |
| 카드 제목 `HdCard24` | A2Z 6 SemiBold | 24px | 1.5 | 0 | 추출 스타일 |
| 기본 설명 `Hdsub16` | A2Z 4 Regular | 16px | 1.5 | 0 | 추출 스타일 |
| CTA | A2Z 6 SemiBold | 20px | 1 | 1px | 추출 |
| 단계 번호 | Pretendard GOV Bold | 24px | 19.5px | 0 | Figma의 Inter를 프로젝트 폰트 정책에 따라 매핑 |
| Footer 저작권 | Pretendard GOV Regular | 12px | 18px | 0 | Figma의 Inter를 프로젝트 폰트 정책에 따라 매핑 |

프로젝트에서는 `md/design_guide.md`에 지정된 두 폰트만 사용한다.

- A2z: Noonnu/JSDelivr의 100~900 WOFF2를 `@font-face`로 등록한다.
- Pretendard GOV: Pretendard v1.3.9 정적 웹폰트 CSS를 JSDelivr에서 불러온다.
- 기본 UI는 A2z를 사용하고, Figma의 Inter 및 Noto Sans KR 표기는 Pretendard GOV로 매핑한다.
- 로딩 정의는 `src/styles/fonts.css`에 두고 `src/main.js`에서 전역으로 불러온다.

## 6. 에셋 목록과 예정 경로

| 에셋 | Figma 노드 | 예정 로컬 경로 |
| --- | --- | --- |
| 사이트 로고 | `67:616` | `src/assets/landing/logo.svg` |
| 코인 아이콘 | `4:15` | `src/assets/landing/token-icon.svg` |
| 사용자 프로필 | `4:19` | `src/assets/landing/user-profile.svg` |
| Hero 모바일 화면 | `11:1075` | `src/assets/landing/mobile-screen.png` |
| Hero QR | `12:1094` | `src/assets/landing/hero-qr.svg` |
| Hero 상품 이미지 4종 | `12:1099`, `12:1113`, `12:1104`, `12:1108` | `src/assets/landing/hero-*` |
| 소개 카드 이미지 3종 | `23:46`, `23:48`, `23:50` | `src/assets/landing/problem-*` |
| 상점 인물 이미지 | `13:1133` | `src/assets/landing/store.png` |
| 입력 폼 예시 | `26:41` | `src/assets/landing/product-form.png` |
| AI 생성 이미지 | `26:43` | `src/assets/landing/ai-product.png` |
| 결과 카드 이미지/QR | `31:302`, `33:305`, `30:296`, `28:268` | `src/assets/landing/result-*` |
| Final CTA 배경 | `36:318` | `src/assets/landing/final-cta.png` |

퍼블리싱 승인 후 Figma 원본 에셋을 다운로드하고 파일 크기와 실제 렌더링 크기를 검증한다.

## 7. Auto Layout과 반응형

- Header 우측 그룹, 주요 제목 그룹, 카드 내부, CTA는 Auto Layout 속성이 디자인 컨텍스트에서 확인됐다 — 추출.
- 데스크톱에서 카드 3열과 32px 간격을 유지한다 — 추출.
- 기준 프레임 밖의 모바일/태블릿 재배치 규칙은 제공되지 않았다 — 미확정.
- 좁은 화면에서 가로 스크롤이 생기지 않게 해야 한다는 요구는 `design_guide.md`에 있으나, 구체적인 breakpoint와 카드 적층 방식은 Figma 추출값이 아니다 — 추론 및 승인 필요.
- 퍼블리싱 시 절대 좌표를 그대로 복사하지 않고, 시각 수치를 유지하는 일반 레이아웃으로 변환한다. 단, 장식 이미지의 겹침처럼 고정 배치가 필요한 부분만 제한적으로 absolute를 사용한다.

## 8. 구현 전 확인 사항

1. Figma의 `8 코인`을 그대로 표시할지, `project.md` 예시인 `3개`로 맞출지
2. 미등록 색상 6개를 Figma 정식 컬러 스타일로 등록할지
3. 데스크톱 외 breakpoint 및 3열 카드의 모바일 적층 규칙
4. 이 문서 승인 후 랜딩 화면 퍼블리싱을 시작해도 되는지

