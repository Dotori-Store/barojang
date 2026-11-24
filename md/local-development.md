# 로컬 전체 기능 테스트

배포하지 않고 Vue 화면, 초대코드 로그인, Vercel API 호환 라우트, Supabase 이미지 업로드와 상품 저장을 함께 테스트할 수 있다.

## 준비

프로젝트 루트의 `.env.admin.local`에 다음 환경변수가 있어야 한다.

```dotenv
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=<server-only secret key>
SESSION_SECRET=<32자 이상의 임의 문자열>
```

`.env.admin.local`은 Git에서 제외되며 브라우저 번들에 포함되지 않는다. 실제 값은 `.env.example`이 아니라 `.env.admin.local`에만 저장한다.

## 실행

```powershell
npm run dev:full
```

브라우저에서 `http://127.0.0.1:5173`을 연다. 랜딩 화면의 시작 버튼을 눌러 실제 초대코드로 로그인한 뒤 상품을 작성하고 JPG 또는 PNG 이미지를 선택해 발행한다. `/builder` 주소로 바로 이동하면 세션 쿠키가 없으므로 업로드 API가 `Unauthorized`를 반환한다.

## 확인 항목

1. 가로 또는 세로 이미지가 중앙 기준 정사각형으로 보인다.
2. 발행 후 완료 화면으로 이동한다.
3. Supabase Storage의 `product-images/<user-id>/`에 JPG 또는 PNG 파일이 생성된다.
4. `products.image_path`에 같은 Storage 경로가 저장된다.
5. WebP 등 허용되지 않은 형식과 크롭 후 5MB를 넘는 이미지는 거부된다.

공개 화면의 UI만 확인할 때는 기존 `npm run dev`를 사용할 수 있다. 초대코드 인증, 보호 화면, 실제 `/api/*` 호출과 Supabase 저장까지 확인하려면 `npm run dev:full`을 사용한다.
