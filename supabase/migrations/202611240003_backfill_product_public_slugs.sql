update public.products
set public_slug = substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)
where public_slug is null;

alter table public.products
  alter column public_slug set default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  alter column public_slug set not null;

comment on column public.products.public_slug is
  '로그인 없이 상품 페이지를 조회하는 고유 공개 주소 식별자.';
