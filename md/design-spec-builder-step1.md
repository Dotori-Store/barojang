# 바로온장 상품 만들기 1단계 디자인 명세

> 상태: Figma 수치 추출 완료 / 화면 구현 전 확인 대기  
> 작성 기준일: 2026-11-20  
> 대상 프레임: `상품 만들기 · 1단계` (`47:48`)  
> Figma URL: https://www.figma.com/design/gWfU5DNvVAmAHFMwzsEJ2u/%EB%B0%94%EB%A1%9C%EC%98%A8%EC%9E%A5?node-id=47-48&t=81flELUYER8vxDQR-4

## 1. 화면 해석

- 이 프레임은 **모달이 아니라 독립 페이지**다.
- Figma의 720 × 878px 크기는 디자인 작업용 기준 크기이며, 실제 브라우저에서 720 × 878px 고정 박스나 팝업으로 만들지 않는다.
- 딤드 배경, 모달 외곽선, 그림자, 닫기 버튼을 추가하지 않는다.
- 실제 구현에서는 흰색 전체 페이지 안에 최대 720px의 콘텐츠 영역을 가운데 배치하는 방식이 적합하다. 이 항목은 브라우저 적용 방식에 대한 추론이며 Figma 프레임 자체의 속성은 아니다.
- 화면 역할은 상품 만들기 3단계 중 **1단계: 상품 기본 정보 입력**이다.
- 이번 문서 작성 단계에서는 Vue, CSS, 라우팅을 변경하지 않는다.

## 2. 전체 프레임

| 항목 | 값 | 근거 |
| --- | --- | --- |
| 프레임 | `상품 만들기 · 1단계` (`47:48`) | 추출 |
| 기준 크기 | 720 × 878px | 추출 |
| 배경 | 흰색 | 추출 |
| 루트 좌우 padding | 50px | 추출 |
| 정렬 | 세로 배치, 수평 중앙 정렬 | 추출 |
| 내부 주요 폼 폭 | 560px | 추출 |

## 3. 화면 계층

```text
상품 만들기 · 1단계 / 전체 페이지
├─ Top / 브랜드 영역
│  └─ 바로온장
└─ Main
   ├─ Heading
   │  ├─ 무엇을 판매하시나요?
   │  └─ Step 1 — 2 — 3
   ├─ 상품 정보 입력 폼
   │  ├─ 판매 품목
   │  ├─ 상품명
   │  ├─ 판매 가격
   │  ├─ 중량 / 용량
   │  └─ 원산지
   └─ Bottom
      └─ 다음 버튼
```

구현 시에도 이 정도의 평평한 구조를 유지한다. Figma Auto Layout 레이어를 그대로 중첩된 Vue 컴포넌트로 변환하지 않는다.

## 4. 영역별 수치

### 4.1 Top (`47:49`)

| 항목 | 값 |
| --- | --- |
| 위치 | x 50, y 0 |
| 크기 | 620 × 135px |
| 세로 padding | 50px |
| 정렬 | 수평 중앙 |

브랜드 텍스트 `바로온장`:

- 위치: x 255.5, y 50 — Top 내부 기준
- 크기: 109 × 35px
- A2z Bold 700
- 29px
- 색상 `#24272C`
- 별도 로고 이미지가 아닌 텍스트 레이어다.

### 4.2 Main (`47:51`)

| 항목 | 값 |
| --- | --- |
| 위치 | x 80, y 135 |
| 크기 | 560 × 743px |
| 하단 padding | 60px |
| 정렬 | 세로 배치, 수평 중앙 |

Main의 세로 구성은 Heading 86px + Form 495px + Bottom 102px + 하단 여백 60px이다.

### 4.3 Heading (`47:52`)

- 크기: 560 × 86px
- 하단 padding: 50px
- 실제 제목/진행 표시 행 높이: 36px
- 제목과 진행 표시를 양끝 정렬한다.

제목 `무엇을 판매하시나요?`:

- 223 × 36px
- A2z SemiBold 600
- 24px / line-height 1.5
- 색상 `Dark` (`#13161C`)

진행 표시:

- 전체 영역: 120 × 28px
- 각 원: 28 × 28px
- 원 사이 시각적 간격: 18px
- 숫자: Pretendard GOV Bold 700, 14px, line-height 1
- 원 테두리: 흰색 2px
- 1단계 활성 배경: `Carrot` (`#FF6430`)
- 2·3단계 비활성 배경: `GrayLight` (`#ACB1B8`)
- 연결선: x 470~560, 총 90px, 진행 원 뒤에 배치
- 연결선 원본 노드: `48:119`; 구현 승인 후 Figma SVG 에셋을 내려받아 사용한다.

### 4.4 상품 정보 입력 폼 (`47:61`)

- 크기: 560 × 495px
- 세로 방향
- 필드 간 gap: 20px
- 필드 1개 크기: 560 × 83px
- 필드 내부 label/input 간 gap: 10px

공통 label:

- 높이: 17px
- A2z Regular 400
- 14px
- 색상 `GrayText` (`#7B818B`)

공통 input/select:

- 560 × 56px
- 좌우 padding 16px
- 흰색 배경
- border 1px solid `#D4D8E3`
- border-radius 6px
- placeholder: Pretendard GOV Regular 400, 16px, `GrayLight` (`#ACB1B8`)
- Figma에는 focus, hover, disabled, error 상태가 없다.

| 필드 | UI 성격 | 표시 문구 |
| --- | --- | --- |
| 판매 품목 | 선택 입력으로 해석 | `품목을 선택해 주세요` |
| 상품명 | 텍스트 입력 | `예: 국물용 멸치` |
| 판매 가격 | 입력 형식 미확정 | `예: 15,000원` |
| 중량 / 용량 | 텍스트 입력 | `예: 500g` |
| 원산지 | 텍스트 입력 | `예: 국내산` |

`판매 품목`은 문구상 select로 해석되지만 펼쳐진 옵션 UI와 화살표 아이콘은 프레임에 없다. 구현 전에 상호작용 방식을 확인한다.

### 4.5 Bottom (`47:82`)

- 크기: 560 × 102px
- 상단 padding: 30px

`다음` 버튼:

- 560 × 72px
- 배경 `Dark` (`#13161C`)
- border-radius 6px
- 텍스트 A2z SemiBold 600, 20px
- line-height 1
- 흰색
- Figma에서는 활성 상태처럼 보이지만, 입력 전 활성 여부와 validation 정책은 확인되지 않았다.

## 5. 컬러

### 5.1 Figma 등록 스타일

| CSS 변수 예정 | Figma 이름 | 값 |
| --- | --- | --- |
| `--color-text-dark` | Dark | `#13161C` |
| `--color-carrot` | Carrot | `#FF6430` |
| `--color-gray-light` | GrayLight | `#ACB1B8` |
| `--color-text-muted` | GrayText | `#7B818B` |

### 5.2 프레임 직접 추출 색상

| CSS 변수 예정 | 값 | 사용처 |
| --- | --- | --- |
| `--color-text-heading` | `#24272C` | 상단 브랜드명 |
| `--color-input-border` | `#D4D8E3` | 모든 입력 테두리 |
| `--color-white` | `#FFFFFF` | 페이지/입력 배경, 버튼·단계 숫자 |

`--color-gray-light`, `--color-input-border`는 구현 승인 시 기존 `base.css` 토큰에 추가한다. 컴포넌트 CSS에 색상 리터럴을 반복하지 않는다.

## 6. 폰트

프로젝트 폰트 정책에 따라 두 폰트만 사용한다.

- 제목, label, 버튼, 브랜드: A2z
- input placeholder, 단계 숫자: Pretendard GOV
- Figma의 단계 숫자는 `Pretendard Bold`로 표기되어 있으나 프로젝트 정책에 맞춰 Pretendard GOV Bold로 매핑한다.
- 기존 `src/styles/fonts.css`에 등록된 웹폰트를 재사용하며 새 폰트 패키지를 설치하지 않는다.

## 7. 페이지 구현 방향

구현 승인 후에도 불필요한 컴포넌트 분리는 하지 않는다.

```text
src/pages/BuilderPage.vue
src/styles/builder.css
```

- 1단계 전체 HTML은 `BuilderPage.vue` 한 파일에서 관리한다.
- 필드가 이 화면에서만 사용된다면 `FormField.vue`, `StepIndicator.vue` 같은 컴포넌트를 만들지 않는다.
- 입력 label은 실제 `<label>`, 입력은 `<input>` 또는 확정된 선택 UI를 사용한다.
- 다음 단계가 아직 승인되지 않았으므로 2단계 화면을 미리 만들지 않는다.
- 화면 폭이 넓어져도 폼 폭은 560px을 유지하고 페이지 가운데 배치한다.
- 좁은 화면에서는 560px 고정을 풀고 좌우 안전 여백 안에서 `width: 100%`로 축소한다 — 추론.

## 8. 구현 전 확인사항

1. 랜딩의 `시작하기`가 이 화면으로 직접 이동하면 기존 `/enter` 접속 코드 화면은 어느 시점에 노출되는가?
2. 이 화면의 최종 경로를 기존 `/builder`로 사용할 것인가?
3. 판매 품목은 native select, custom dropdown, 선택 카드 중 무엇인가?
4. 다섯 필드의 필수/선택 여부는 무엇인가?
5. 판매 가격은 숫자만 저장하고 화면에서 원 단위를 포맷할 것인가, 자유 텍스트인가?
6. 입력 전에도 `다음` 버튼이 활성 상태인가, validation 통과 후 활성화되는가?
7. 오류, focus, hover 상태 디자인을 별도로 제공할 것인가?

