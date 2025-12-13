-- Add virtual_tokens to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS virtual_tokens integer DEFAULT 0;

-- Create Store Items table
CREATE TABLE IF NOT EXISTS public.store_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    cost integer NOT NULL,
    icon_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create User Inventory table
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    item_id uuid REFERENCES public.store_items(id) ON DELETE CASCADE NOT NULL,
    purchased_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Goal Invitations table for Collaborative Goals
CREATE TABLE IF NOT EXISTS public.goal_invitations (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    goal_data jsonb NOT NULL, -- Snapshot of goal details (title, description, target_hours, deadline)
    status text CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed defaults Store Items (safe insert)
INSERT INTO public.store_items (name, description, cost, icon_url)
VALUES 
('Themes Pack: Dark Mode', 'Unlock the sleek dark mode theme for your dashboard.', 50, 'moon'),
('Themes Pack: Nature', 'Unlock the refreshing nature theme.', 50, 'leaf'),
('Avatar Frame: Gold', 'A shiny gold frame for your profile avatar.', 100, 'star'),
('Double XP Token', 'Earn double tokens for 24 hours.', 75, 'zap')
ON CONFLICT DO NOTHING; -- Note: This assumes name constraint or similar, but for simple seeding we might duplicate if run multiple times without constraints. 
-- To prevent duplicates properly without unique constraint on name, we can do a check.
-- For now, we will rely on manual execution or just accepting duplicates in dev.
-- Or better:
DELETE FROM public.store_items WHERE name IN ('Themes Pack: Dark Mode', 'Themes Pack: Nature', 'Avatar Frame: Gold', 'Double XP Token'); -- Reset for clean state in dev
INSERT INTO public.store_items (name, description, cost, icon_url)
VALUES 
('Themes Pack: Dark Mode', 'Unlock the sleek dark mode theme for your dashboard.', 50, 'moon'),
('Themes Pack: Nature', 'Unlock the refreshing nature theme.', 50, 'leaf'),
('Avatar Frame: Gold', 'A shiny gold frame for your profile avatar.', 100, 'star'),
('Double XP Token', 'Earn double tokens for 24 hours.', 75, 'zap');
