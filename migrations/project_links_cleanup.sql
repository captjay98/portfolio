-- Strip GitHub "Source" links from products without public repos
-- Run: npx wrangler d1 execute portfolio-db --remote --file=./migrations/project_links_cleanup.sql
UPDATE projects SET github = NULL, updated_at = '2026-09-27T12:00:00.000+00:00'
WHERE name IN (
  'LivestockAI',
  'NIPSMAP',
  'OneSecOS',
  'DeliveryNexus',
  'SchoolTry K12',
  'SchoolTry Tertiary',
  'ProJavi'
);
