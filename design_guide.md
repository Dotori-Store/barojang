프로젝트 루트의 `project.md`를 먼저 읽고 서비스의 목적과 전체 개발 범위를 파악해 줘.

서비스의 현재 이름은 **바로온장**이야.

이번 작업은 Vue 3 + Vite + JavaScript로 진행하고, TypeScript는 사용하지 않아.

### 이번 작업
Figma 디자인을 참조하여 첫 번째 화면 하나만 구현해 줘.

Figma 프레임 URL:
https://www.figma.com/design/gWfU5DNvVAmAHFMwzsEJ2u/%EB%B0%94%EB%A1%9C%EC%98%A8%EC%9E%A5?node-id=4-10&t=81flELUYER8vxDQR-4

### 디자인 구현 원칙
1. Figma MCP를 사용하여 해당 프레임의 실제 디자인 속성을 읽을 것.
2. 컬러는 Figma에 등록된 스타일을 기준으로 CSS 변수로 정의할 것.
3. 폰트는 Figma에 지정된 폰트를 사용하고, 웹폰트 로딩 방법을 확인할 것.
4. 폰트 파일이나 CDN이 없다면 임의로 대체하지 말고 보고할 것.
5. 이미지와 아이콘은 Figma 원본 에셋을 우선 사용할 것.
6. 레이아웃, 간격, 크기, 텍스트, 색상을 임의로 변경하지 말 것.
7. 데스크톱 기준으로 구현하되, 좁은 화면에서 가로 스크롤이 발생하지 않도록 할 것.
8. 코드는 읽기 쉽고 수정하기 쉽게 구성할 것.

### 작업 범위
- 현재는 첫 화면만 구현
- Supabase, AI API 연결 금지
- 로그인, 상품 등록 등 다른 화면 구현 금지
- 불필요한 패키지 설치 금지
- 기존 파일을 임의로 삭제하거나 덮어쓰지 말 것

먼저 Figma를 분석하고 `design-spec.md`를 작성해 줘.

폰트는 두가지만 사용.

1- pretedard GOV : 
https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-gov.min.css

2- 에이투지체 :
@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-1Thin.woff2') format('woff2');
    font-weight: 100;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-2ExtraLight.woff2') format('woff2');
    font-weight: 200;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-3Light.woff2') format('woff2');
    font-weight: 300;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-4Regular.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-5Medium.woff2') format('woff2');
    font-weight: 500;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-6SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-7Bold.woff2') format('woff2');
    font-weight: 700;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-8ExtraBold.woff2') format('woff2');
    font-weight: 800;
    font-display: swap;
}

@font-face {
    font-family: 'A2z';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-9Black.woff2') format('woff2');
    font-weight: 900;
    font-display: swap;
}