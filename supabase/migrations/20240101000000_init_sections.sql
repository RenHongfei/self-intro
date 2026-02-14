-- 1. 创建 Sections 表 (如果不存在)
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text default '',
  order_index integer default 0,
  is_visible boolean default true,
  type text default 'text',
  background_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. 开启行级安全策略 (RLS)
alter table sections enable row level security;

-- 3. 清理旧策略以避免冲突 (可选，但在反复运行时很有用)
drop policy if exists "Public sections are viewable by everyone" on sections;
drop policy if exists "Authenticated users can modify sections" on sections;

-- 4. 允许所有人读取数据
create policy "Public sections are viewable by everyone"
  on sections for select
  using ( true );

-- 5. 仅允许登录用户(您)修改数据
create policy "Authenticated users can modify sections"
  on sections for all
  to authenticated
  using ( true )
  with check ( true );

-- 6. 插入一些初始数据 (仅当表为空时)
insert into sections (title, slug, content, type, order_index, background_image_url)
select 'Hello, I''m a Developer', 'hero', 'I build exceptional digital experiences.

Based in the cloud, working worldwide.', 'hero', 0, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
where not exists (select 1 from sections where slug = 'hero');

insert into sections (title, slug, content, type, order_index, background_image_url)
select 'About Me', 'about', '### Passionate about code

I am a full-stack developer with a love for clean code and intuitive design.

- 5+ years of experience
- Specialized in React & Node.js
- Open source contributor', 'text', 1, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop'
where not exists (select 1 from sections where slug = 'about');

insert into sections (title, slug, content, type, order_index, background_image_url)
select 'Projects', 'projects', '### Featured Work

1. **E-commerce Platform**: A full-featured online store built with Next.js and Stripe.
2. **Task Manager**: A collaborative productivity tool with real-time updates.
3. **AI Chatbot**: An intelligent assistant powered by OpenAI.', 'projects', 2, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
where not exists (select 1 from sections where slug = 'projects');

insert into sections (title, slug, content, type, order_index, background_image_url)
select 'Get in Touch', 'contact', 'Ready to start your next project?

- **Email**: hello@example.com
- **GitHub**: [github.com/example](https://github.com)
- **LinkedIn**: [linkedin.com/in/example](https://linkedin.com)', 'contact', 3, 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop'
where not exists (select 1 from sections where slug = 'contact');
