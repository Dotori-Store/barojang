create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique check (user_id ~ '^[a-z0-9][a-z0-9_-]{2,49}$'),
  passcode_hash text not null check (passcode_hash like '$argon2id$%'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.access_codes enable row level security;

comment on table public.access_codes is
  '관리자 등록용 초대코드 해시. service_role을 사용하는 서버에서만 접근한다.';

comment on column public.access_codes.passcode_hash is
  '초대코드 원문이 아닌 Argon2id 해시만 저장한다.';
