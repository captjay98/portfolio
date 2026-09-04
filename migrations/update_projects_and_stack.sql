-- 1. Autonomous Agents Category
INSERT OR REPLACE INTO categories (id, name, description, parent_id, created_at, updated_at) VALUES (
  'cat-agents',
  'Autonomous Agents',
  'Autonomous AI agents, multi-agent frameworks, and LLMs',
  NULL,
  '2026-09-04T08:44:00.000+00:00',
  '2026-09-04T08:44:00.000+00:00'
);

-- 2. Technologies for Active Stack
INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
  'tech-tanstack',
  'TanStack',
  '67e993a6002bee8a7b4f',
  'https://avatars.githubusercontent.com/u/72518640?s=200&v=4',
  'https://tanstack.com/',
  '2025-03-30T18:55:45.405+00:00',
  '2025-03-30T18:55:45.405+00:00'
);

INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
  'tech-fastapi',
  'FastAPI',
  '67e993a7001622ce05c2',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'https://fastapi.tiangolo.com/',
  '2025-03-30T18:55:45.405+00:00',
  '2025-03-30T18:55:45.405+00:00'
);

INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
  'tech-gcp',
  'GCP',
  '67e993a70035e721c7f7',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  'https://cloud.google.com/',
  '2025-03-30T18:55:45.405+00:00',
  '2025-03-30T18:55:45.405+00:00'
);

INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
  'tech-aws',
  'AWS',
  '67e993a70035e721c7f7',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'https://aws.amazon.com/',
  '2025-03-30T18:55:45.405+00:00',
  '2025-03-30T18:55:45.405+00:00'
);

INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
  'tech-gemini',
  'Gemini',
  'cat-agents',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
  'https://ai.google.dev/',
  '2026-09-04T08:44:00.000+00:00',
  '2026-09-04T08:44:00.000+00:00'
);

INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
  'tech-google-adk',
  'Google ADK',
  'cat-agents',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  'https://github.com/google/adk',
  '2026-09-04T08:44:00.000+00:00',
  '2026-09-04T08:44:00.000+00:00'
);

INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
  'tech-strands',
  'Strands',
  'cat-agents',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
  'https://github.com/awslabs',
  '2026-09-04T08:44:00.000+00:00',
  '2026-09-04T08:44:00.000+00:00'
);

-- 3. Curated Active Stack (Mobile, Frontend, Backend, DevOps, Autonomous Agents)
INSERT OR REPLACE INTO current_tech_stack (id, name, category_id, technology_ids, priority, created_at, updated_at) VALUES (
  '67e993c000074d455e27',
  'Mobile',
  '67e993a700251bfd60ef',
  '["67e993b100115a0255a0"]',
  1,
  '2025-03-30T18:56:00.324+00:00',
  '2025-03-30T18:56:00.324+00:00'
);

INSERT OR REPLACE INTO current_tech_stack (id, name, category_id, technology_ids, priority, created_at, updated_at) VALUES (
  '67e993c0001ad184ca7f',
  'Frontend',
  '67e993a6002bee8a7b4f',
  '["tech-tanstack","67e993ac003e52b71ba3"]',
  2,
  '2025-03-30T18:56:00.572+00:00',
  '2025-03-30T18:56:00.572+00:00'
);

INSERT OR REPLACE INTO current_tech_stack (id, name, category_id, technology_ids, priority, created_at, updated_at) VALUES (
  '67e993c0002b1058ad20',
  'Backend',
  '67e993a7001622ce05c2',
  '["67e993af0033b25e25c9","tech-fastapi"]',
  3,
  '2025-03-30T18:56:00.864+00:00',
  '2025-03-30T18:56:00.864+00:00'
);

INSERT OR REPLACE INTO current_tech_stack (id, name, category_id, technology_ids, priority, created_at, updated_at) VALUES (
  '67e993c0003c2169df9a',
  'DevOps',
  '67e993a70035e721c7f7',
  '["67e993b0003148bd297b","tech-aws","tech-gcp"]',
  4,
  '2025-03-30T18:56:01.000+00:00',
  '2025-03-30T18:56:01.000+00:00'
);

INSERT OR REPLACE INTO current_tech_stack (id, name, category_id, technology_ids, priority, created_at, updated_at) VALUES (
  'stack-ai-agents',
  'Autonomous Agents',
  'cat-agents',
  '["tech-gemini","tech-google-adk","tech-strands"]',
  5,
  '2026-09-04T08:44:00.000+00:00',
  '2026-09-04T08:44:00.000+00:00'
);

-- 4. Featured Projects (LivestockAI, ProJavi, HackSteward, OneSecOS)
INSERT OR REPLACE INTO projects (id, name, description, long_description, image, image_id, category_ids, technology_ids, github, live, featured, is_archived, created_at, updated_at) VALUES (
  'proj-livestockai',
  'LivestockAI',
  'AI-native command center and operating system for commercial livestock farms in Nigeria.',
  'FarmOps LivestockAI is an AI-native operating system turning daily farm operations into a high-precision engine. Features broiler cycle tracking, catfish grow-outs, Naira-native accounting with kobo precision, offline-first data sync, and autonomous WhatsApp assistants.',
  'project/livestockai.webp',
  NULL,
  '["cat-agents","67e993aa000305f8b919"]',
  '["tech-fastapi","tech-tanstack","67e993b000153788d55c","tech-gemini"]',
  'https://github.com/captjay98/farmhand',
  NULL,
  1,
  0,
  '2026-09-01T12:00:00.000+00:00',
  '2026-09-01T12:00:00.000+00:00'
);

-- Update ProJavi timestamp and featured status
UPDATE projects SET
  featured = 1,
  is_archived = 0,
  created_at = '2026-08-15T12:00:00.000+00:00',
  updated_at = '2026-08-15T12:00:00.000+00:00'
WHERE id = '67e993b80018c52b6489';

INSERT OR REPLACE INTO projects (id, name, description, long_description, image, image_id, category_ids, technology_ids, github, live, featured, is_archived, created_at, updated_at) VALUES (
  'proj-hacksteward',
  'HackSteward',
  'Autonomous AI agent for hackathon project analysis, concept scoring, and submission pipelines.',
  'An intelligent platform that evaluates hackathon opportunities, scores concepts against judging rubrics, manages team pipelines, and streamlines final submission materials with automated evidence gathering.',
  'project/hacksteward.webp',
  NULL,
  '["cat-agents","67e993a6002bee8a7b4f"]',
  '["tech-gemini","tech-google-adk","67e993ac003e52b71ba3","tech-fastapi"]',
  'https://github.com/captjay98/hacksteward',
  NULL,
  1,
  0,
  '2026-07-20T12:00:00.000+00:00',
  '2026-07-20T12:00:00.000+00:00'
);

INSERT OR REPLACE INTO projects (id, name, description, long_description, image, image_id, category_ids, technology_ids, github, live, featured, is_archived, created_at, updated_at) VALUES (
  'proj-onesecos',
  'OneSecOS',
  'Real-time security, patrol dispatch, and emergency response operating system.',
  'An enterprise security operations platform featuring live GIS patrol maps, automated checkpoint verification, incident panic response, and cross-platform guard dispatch.',
  'project/onesecos.webp',
  NULL,
  '["67e993a700251bfd60ef","67e993a70035e721c7f7"]',
  '["67e993af0033b25e25c9","67e993b100115a0255a0","67e993b0003148bd297b","67e993b000153788d55c"]',
  'https://github.com/captjay98/onesecos',
  NULL,
  1,
  0,
  '2026-06-10T12:00:00.000+00:00',
  '2026-06-10T12:00:00.000+00:00'
);

-- Set featured status so LivestockAI, ProJavi, HackSteward, OneSecOS are top 4, followed by DeliveryNexus and SchoolTry K12
UPDATE projects SET featured = 1 WHERE id IN ('68de94810038db064ccc', '67e993b8003a7004d797');
UPDATE projects SET featured = 0 WHERE id NOT IN ('proj-livestockai', '67e993b80018c52b6489', 'proj-hacksteward', 'proj-onesecos', '68de94810038db064ccc', '67e993b8003a7004d797');
