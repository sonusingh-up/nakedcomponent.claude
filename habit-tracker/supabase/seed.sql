-- Seed catalog of habits. Idempotent: upserts by catalog name
-- (requires the uq_habits_catalog_name index from migration 0008).
-- NEVER deletes — a delete here cascades through user_habits into
-- every user's logs, streaks and reminders.
-- social_proof_count values are illustrative starting numbers and are
-- only applied on first insert (re-running keeps the live counters).

insert into public.habits (name, description, category, icon, color, social_proof_count, sort_order) values
  -- Hydration
  ('Drink more water',        'Sip your way to 8 glasses a day. Better focus, better skin, better you.', 'hydration',   'i-lucide-glass-water', '#5b8bb0', 1312, 1),
  ('Morning glass of water',  'Kick-start your metabolism with water before coffee.',                    'hydration',   'i-lucide-droplet',     '#5b8bb0', 842,  2),
  -- Fitness
  ('Move for 30 minutes',     'A walk, a run, a workout — just move your body daily.',                   'fitness',     'i-lucide-footprints',  '#c96442', 2104, 3),
  ('10,000 steps',            'Hit your step goal and feel the difference by evening.',                  'fitness',     'i-lucide-activity',    '#c96442', 1789, 4),
  ('Stretch & mobility',      'Five minutes of stretching to undo the desk damage.',                     'fitness',     'i-lucide-stretch-horizontal', '#c96442', 654, 5),
  ('Strength training',       'Build muscle and bone density with resistance work.',                     'fitness',     'i-lucide-dumbbell',    '#c96442', 1203, 6),
  -- Nutrition
  ('Eat more greens',         'Add a serving of vegetables to every main meal.',                         'nutrition',   'i-lucide-salad',       '#5a8a4a', 977,  7),
  ('No sugar after 6pm',      'Cut the evening sugar to sleep deeper and wake clearer.',                 'nutrition',   'i-lucide-candy-off',   '#5a8a4a', 588,  8),
  ('Take creatine',           '5g daily — the most researched supplement there is.',                     'nutrition',   'i-lucide-pill',        '#5a8a4a', 1450, 9),
  ('Protein with breakfast',  'Front-load protein to stay full and steady all morning.',                 'nutrition',   'i-lucide-egg',         '#5a8a4a', 712,  10),
  -- Mindfulness
  ('Meditate',                'Ten quiet minutes to reset your nervous system.',                         'mindfulness', 'i-lucide-brain',       '#4a6b8a', 1620, 11),
  ('Gratitude journaling',    'Write down three things you are grateful for.',                           'mindfulness', 'i-lucide-heart',       '#4a6b8a', 893,  12),
  ('Digital sunset',          'No screens 60 minutes before bed.',                                       'mindfulness', 'i-lucide-smartphone',  '#4a6b8a', 467,  13),
  ('Breathwork',              'Two minutes of box breathing to calm down fast.',                         'mindfulness', 'i-lucide-wind',        '#4a6b8a', 538,  14),
  -- Sleep
  ('Sleep by 11pm',           'Protect your circadian rhythm with a consistent bedtime.',                'sleep',       'i-lucide-moon',        '#3f5b7a', 1045, 15),
  ('7+ hours of sleep',       'Give your body the recovery time it actually needs.',                     'sleep',       'i-lucide-bed',         '#3f5b7a', 1330, 16),
  ('No caffeine after 2pm',   'Let the afternoon cup go for deeper sleep tonight.',                      'sleep',       'i-lucide-coffee',      '#3f5b7a', 621,  17),
  -- Productivity
  ('Plan tomorrow tonight',   'Three priorities written before you close the laptop.',                   'productivity','i-lucide-list-todo',   '#b08a2e', 734,  18),
  ('Deep work block',         'One distraction-free hour on what matters most.',                         'productivity','i-lucide-target',      '#b08a2e', 856,  19),
  ('Read 10 pages',           'A book a month, ten pages at a time.',                                    'productivity','i-lucide-book-open',   '#b08a2e', 1198, 20),
  ('Inbox to zero',           'Clear and triage your inbox once a day.',                                 'productivity','i-lucide-inbox',       '#b08a2e', 402,  21),
  ('Tidy for 5 minutes',      'A quick daily reset keeps the space (and mind) clear.',                   'productivity','i-lucide-sparkles',    '#b08a2e', 389,  22)
on conflict (name) where owner_id is null
do update set
  description = excluded.description,
  category    = excluded.category,
  icon        = excluded.icon,
  color       = excluded.color,
  sort_order  = excluded.sort_order,
  is_active   = true;
