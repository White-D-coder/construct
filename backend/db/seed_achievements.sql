-- Seed 'Goal Crusher' Achievement
INSERT INTO public.achievements (code, title, description, icon_url, criteria)
VALUES (
  'GOAL_CRUSHER',
  'Goal Crusher',
  'Completed your first goal!',
  'trophy',
  '{"type": "goal_completion", "count": 1}'
)
ON CONFLICT (code) DO NOTHING;
