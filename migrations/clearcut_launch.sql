-- ClearCut launch + featured project adjustments
-- Run: bunx wrangler d1 execute portfolio-db --remote --file=./migrations/clearcut_launch.sql
-- (and locally: wrangler d1 execute portfolio-db --local --file=./migrations/clearcut_launch.sql)

-- 1. ClearCut (newest project, 2026) — live at clearcut.jamalibrahim.dev
INSERT OR REPLACE INTO projects (id, name, description, long_description, image, image_id, category_ids, technology_ids, github, live, featured, is_archived, created_at, updated_at) VALUES (
  'proj-clearcut',
  'ClearCut',
  'Screenplay pre-clearance evidence workspace — autonomous cited research across ten protected categories, with version-bound clearance reports.',
  'ClearCut reads screenplay drafts, detects clearance concerns across ten protected categories (trademarks, brands, real people, music, copyrighted works, and more), and autonomously gathers cited, real-world evidence using bounded agentic research loops. It coordinates accountable human review, re-evaluates scripts as revisions occur, and produces immutable, audit-ready clearance reports.',
  'project/clearcut.webp',
  NULL,
  '["cat-agents","67e993a7001622ce05c2"]',
  '["tech-fastapi","tech-aws-bedrock","tech-strands","tech-tanstack-start","67e993b000153788d55c"]',
  'https://github.com/captjay98/clearcut',
  'https://clearcut.jamalibrahim.dev',
  1,
  0,
  '2026-09-15T12:00:00.000+00:00',
  '2026-09-15T12:00:00.000+00:00'
);

-- 2. Hide HackSteward from the public site (archived, not deleted)
UPDATE projects SET
  featured = 0,
  is_archived = 1,
  updated_at = '2026-09-26T22:00:00.000+00:00'
WHERE id = 'proj-hacksteward';

-- 3. OneSecOS public link now points at the product site
UPDATE projects SET
  live = 'https://onesecos.com',
  updated_at = '2026-09-26T22:00:00.000+00:00'
WHERE id = 'proj-onesecos';

-- 4. Keep the intended featured set on the homepage:
--    LivestockAI, ClearCut, ProJavi, OneSecOS, DeliveryNexus, SchoolTry K12
UPDATE projects SET featured = 1 WHERE id IN ('proj-livestockai', '67e993b80018c52b6489', 'proj-clearcut', 'proj-onesecos', '68de94810038db064ccc', '67e993b8003a7004d797');
UPDATE projects SET featured = 0 WHERE id IN ('proj-hacksteward');

-- 5. LivestockAI public marketing site link
UPDATE projects SET
  live = 'https://livestockai.app',
  updated_at = '2026-09-26T23:59:00.000+00:00'
WHERE id = 'proj-livestockai';
