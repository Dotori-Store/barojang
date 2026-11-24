create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique
    references public.access_codes(user_id)
    on update cascade
    on delete restrict,
  name text not null,
  price integer not null check (price >= 0),
  weight text not null,
  origin text not null,
  feature text not null,
  description text not null,
  shop_name text not null,
  market_name text not null,
  phone text not null,
  image_path text,
  image_version integer not null default 0 check (image_version >= 0),
  public_slug text unique,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create or replace function public.update_products_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.update_products_updated_at();

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.products is
  '초대코드 사용자별 상품 정보. user_id당 최대 1개만 저장한다.';

comment on column public.products.image_path is
  'product-images 버킷 안의 WebP 이미지 경로.';
