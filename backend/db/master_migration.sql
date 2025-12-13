-- MASTER MIGRATION SCRIPT
-- RUN THIS ENTIRE FILE IN SUPABASE SQL EDITOR

-- 1. Add virtual_tokens and selected_character to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS virtual_tokens integer DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS selected_character text DEFAULT 'wizard'; -- 'wizard', 'robot', 'turtle', 'hero'

-- 2. Create Store Items table
CREATE TABLE IF NOT EXISTS public.store_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    cost integer NOT NULL,
    icon_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create User Inventory table
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    item_id uuid REFERENCES public.store_items(id) ON DELETE CASCADE NOT NULL,
    purchased_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Goal Invitations table for Collaborative Goals
CREATE TABLE IF NOT EXISTS public.goal_invitations (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    goal_data jsonb NOT NULL, 
    status text CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Seed Store Items
INSERT INTO public.store_items (name, description, cost, icon_url)
VALUES 
('Themes Pack: Dark Mode', 'Unlock the sleek dark mode theme for your dashboard.', 50, 'moon'),
('Themes Pack: Nature', 'Unlock the refreshing nature theme.', 50, 'leaf'),
('Avatar Frame: Gold', 'A shiny gold frame for your profile avatar.', 100, 'star'),
('Double XP Token', 'Earn double tokens for 24 hours.', 75, 'zap')
ON CONFLICT DO NOTHING;

-- 6. Add NEW Badges (User Request)
INSERT INTO public.achievements (code, title, description, icon_url, criteria)
VALUES 
('DEEP_DIVER', 'Deep Diver', 'Complete a focus session of 4 hours or more.', 'anchor', '{"min_minutes": 240}'),
('WEEKEND_WARRIOR', 'Weekend Warrior', 'Study on a Saturday and Sunday.', 'sun', '{"days": ["Sat", "Sun"]}'),
('STREAK_MASTER', 'Streak Master', 'Study for 7 days in a row.', 'flame', '{"streak_days": 7}')
ON CONFLICT (code) DO NOTHING;

-- 7. Fix Partner Requests Table (Ensure RLS policies exist if RLS is on, OR assume service key usage)
-- If RLS is enabled on users, we might need policy for avatars or virtual_tokens.
-- For now, we assume user will use Service Key or RLS is permissive enough for auth/public.
