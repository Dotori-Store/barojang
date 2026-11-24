update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png']
where id = 'product-images';

comment on column public.products.image_path is
  'product-images 버킷 안의 JPG 또는 PNG 이미지 경로.';
