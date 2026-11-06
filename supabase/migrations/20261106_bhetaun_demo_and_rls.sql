-- Safe, additive Bhetaun demo and approval migration.
-- Run in Supabase SQL Editor after confirming the services column names in your project.

alter table public.businesses add column if not exists is_demo boolean not null default false;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and lower(role) = 'admin'
  );
$$;

alter table public.businesses enable row level security;
drop policy if exists "Approved businesses are public" on public.businesses;
create policy "Approved businesses are public" on public.businesses for select using (lower(status) = 'approved');
drop policy if exists "Owners manage their businesses" on public.businesses;
create policy "Owners manage their businesses" on public.businesses for all using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());

-- Demo listings use an existing authorized profile as owner so no fake auth users are created.
with demo_owner as (select id from public.profiles where lower(role) = 'admin' order by created_at limit 1),
active_categories as (select id, name from public.categories where name in ('Salons & Haircut', 'Beauty Parlour'))
insert into public.businesses (owner_id, category_id, name, slug, description, logo_url, cover_image_url, phone, email, address, city, status, rating, review_count, is_demo)
select demo_owner.id, category.id, demo.name, demo.slug, demo.description, demo.logo_url, demo.cover_image_url, 'DEMO ONLY — do not call', demo.email, demo.address, demo.city, 'approved', demo.rating, demo.review_count, true
from demo_owner cross join active_categories category join (values
 ('Glow Beauty Salon','glow-beauty-salon','Warm, modern hair styling and grooming appointments for every day.','/glow-salon.png','/salon-hero.png','hello@demo.bhetaun.local','Jhamsikhel','Lalitpur',4.9,128,'Salons & Haircut'),
 ('Classic Men''s Salon','classic-mens-salon','Classic cuts, beard care and relaxing grooming in a friendly studio.','/salon-hero.png','/salon-hero.png','classic@demo.bhetaun.local','New Baneshwor','Kathmandu',4.8,86,'Salons & Haircut'),
 ('Urban Style Hair Studio','urban-style-hair-studio','Contemporary cuts, colour and styling from a creative local team.','/salon-hero.png','/bhetaun-professionals.png','urban@demo.bhetaun.local','Pulchowk','Lalitpur',4.7,64,'Salons & Haircut'),
 ('Royal Hair Studio','royal-hair-studio','Premium cuts, styling and occasion looks from a polished local studio.','/salon-hero.png','/bhetaun-professionals.png','royal@demo.bhetaun.local','Maharajgunj','Kathmandu',4.8,73,'Salons & Haircut'),
 ('Aura Beauty Parlour','aura-beauty-parlour','Personalized beauty care and occasion-ready services in a calm space.','/aura-beauty.png','/aura-beauty.png','aura@demo.bhetaun.local','Lazimpat','Kathmandu',4.8,96,'Beauty Parlour'),
 ('Radiance Beauty Studio','radiance-beauty-studio','Facials, brows and gentle beauty treatments with clear pricing.','/aura-beauty.png','/aura-beauty.png','radiance@demo.bhetaun.local','Boudha','Kathmandu',4.6,51,'Beauty Parlour'),
 ('Elegant Beauty Lounge','elegant-beauty-lounge','A polished beauty lounge for self-care appointments and events.','/aura-beauty.png','/aura-beauty.png','elegant@demo.bhetaun.local','Lakeside','Pokhara',4.7,42,'Beauty Parlour'),
 ('Glamour Beauty Parlour','glamour-beauty-parlour','Beauty, brows and event-ready treatments with transparent NPR pricing.','/aura-beauty.png','/aura-beauty.png','glamour@demo.bhetaun.local','Thamel','Kathmandu',4.7,58,'Beauty Parlour')
) as demo(name,slug,description,logo_url,cover_image_url,email,address,city,rating,review_count,category_name) on demo.category_name = category.name
on conflict (slug) do update set status = 'approved', is_demo = true;

-- To disable email confirmation for demo day: Supabase Dashboard → Authentication → Providers → Email → turn off "Confirm email".
-- Keep RLS enabled and never add the service-role key to browser code.
