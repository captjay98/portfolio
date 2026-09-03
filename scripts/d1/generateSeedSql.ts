import fs from "fs";
import path from "path";

function escapeSql(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "1" : "0";
  if (typeof val === "number") return isNaN(val) ? "0" : val.toString();
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

function loadJson(name: string): any[] {
  const file = path.resolve(`data/appwrite-export/${name}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

const sqlLines: string[] = [];

// Profile
const profiles = loadJson("profile");
for (const p of profiles) {
  sqlLines.push(`INSERT OR REPLACE INTO profile (id, full_name, nickname, title, bio_short, bio_long, location, avatar, avatar_id, cover_image, cover_image_id, resume_url, meta_description, created_at, updated_at) VALUES (
    ${escapeSql(p.$id || p.id)},
    ${escapeSql(p.full_name || "")},
    ${escapeSql(p.nickname || "")},
    ${escapeSql(p.title || "")},
    ${escapeSql(p.bio_short || "")},
    ${escapeSql(p.bio_long || "")},
    ${escapeSql(p.location || "")},
    ${escapeSql(p.avatar || "/profile/default-avatar.webp")},
    ${escapeSql(p.avatar_id || null)},
    ${escapeSql(p.cover_image || null)},
    ${escapeSql(p.cover_image_id || null)},
    ${escapeSql(p.resume_url || null)},
    ${escapeSql(p.meta_description || null)},
    ${escapeSql(p.$createdAt || new Date().toISOString())},
    ${escapeSql(p.$updatedAt || new Date().toISOString())}
  );`);
}

// Categories
const categories = loadJson("categories");
for (const c of categories) {
  sqlLines.push(`INSERT OR REPLACE INTO categories (id, name, description, parent_id, created_at, updated_at) VALUES (
    ${escapeSql(c.$id || c.id)},
    ${escapeSql(c.name || "")},
    ${escapeSql(c.description || null)},
    ${escapeSql(c.parent_id || null)},
    ${escapeSql(c.$createdAt || new Date().toISOString())},
    ${escapeSql(c.$updatedAt || new Date().toISOString())}
  );`);
}

// Technologies
const technologies = loadJson("technologies");
for (const t of technologies) {
  sqlLines.push(`INSERT OR REPLACE INTO technologies (id, name, category_id, icon, website, created_at, updated_at) VALUES (
    ${escapeSql(t.$id || t.id)},
    ${escapeSql(t.name || "")},
    ${escapeSql(t.category_id || "")},
    ${escapeSql(t.icon || null)},
    ${escapeSql(t.website || null)},
    ${escapeSql(t.$createdAt || new Date().toISOString())},
    ${escapeSql(t.$updatedAt || new Date().toISOString())}
  );`);
}

// Skills
const skills = loadJson("skills");
for (const s of skills) {
  sqlLines.push(`INSERT OR REPLACE INTO skills (id, name, category_id, technology_id, level, years, created_at, updated_at) VALUES (
    ${escapeSql(s.$id || s.id)},
    ${escapeSql(s.name || "")},
    ${escapeSql(s.category_id || "")},
    ${escapeSql(s.technology_id || null)},
    ${escapeSql(s.level || "Beginner")},
    ${escapeSql(s.years || 1)},
    ${escapeSql(s.$createdAt || new Date().toISOString())},
    ${escapeSql(s.$updatedAt || new Date().toISOString())}
  );`);
}

// Experiences
const experiences = loadJson("experiences");
for (const e of experiences) {
  sqlLines.push(`INSERT OR REPLACE INTO experiences (id, title, company, location, start_date, end_date, description, category_ids, technology_ids, created_at, updated_at) VALUES (
    ${escapeSql(e.$id || e.id)},
    ${escapeSql(e.title || "")},
    ${escapeSql(e.company || "")},
    ${escapeSql(e.location || "")},
    ${escapeSql(e.start_date || "")},
    ${escapeSql(e.end_date || null)},
    ${escapeSql(e.description || "")},
    ${escapeSql(e.category_ids || [])},
    ${escapeSql(e.technology_ids || [])},
    ${escapeSql(e.$createdAt || new Date().toISOString())},
    ${escapeSql(e.$updatedAt || new Date().toISOString())}
  );`);
}

// Accomplishments
const accs = loadJson("experience_accomplishments");
for (const a of accs) {
  sqlLines.push(`INSERT OR REPLACE INTO experience_accomplishments (id, experience_id, text, \`order\`, created_at, updated_at) VALUES (
    ${escapeSql(a.$id || a.id)},
    ${escapeSql(a.experience_id || "")},
    ${escapeSql(a.text || "")},
    ${escapeSql(a.order || 0)},
    ${escapeSql(a.$createdAt || new Date().toISOString())},
    ${escapeSql(a.$updatedAt || new Date().toISOString())}
  );`);
}

// Education
const edus = loadJson("education");
for (const ed of edus) {
  sqlLines.push(`INSERT OR REPLACE INTO education (id, degree, institution, location, start_date, end_date, description, is_current, priority, created_at, updated_at) VALUES (
    ${escapeSql(ed.$id || ed.id)},
    ${escapeSql(ed.degree || "")},
    ${escapeSql(ed.institution || "")},
    ${escapeSql(ed.location || null)},
    ${escapeSql(ed.start_date || "")},
    ${escapeSql(ed.end_date || null)},
    ${escapeSql(ed.description || null)},
    ${escapeSql(ed.is_current ? 1 : 0)},
    ${escapeSql(ed.priority || 0)},
    ${escapeSql(ed.$createdAt || new Date().toISOString())},
    ${escapeSql(ed.$updatedAt || new Date().toISOString())}
  );`);
}

// Current Tech Stack
const techStacks = loadJson("current_tech_stack");
for (const ts of techStacks) {
  sqlLines.push(`INSERT OR REPLACE INTO current_tech_stack (id, name, category_id, technology_ids, priority, created_at, updated_at) VALUES (
    ${escapeSql(ts.$id || ts.id)},
    ${escapeSql(ts.name || "")},
    ${escapeSql(ts.category_id || "")},
    ${escapeSql(ts.technology_ids || [])},
    ${escapeSql(ts.priority || 0)},
    ${escapeSql(ts.$createdAt || new Date().toISOString())},
    ${escapeSql(ts.$updatedAt || new Date().toISOString())}
  );`);
}

// Projects
const projects = loadJson("projects");
for (const pr of projects) {
  sqlLines.push(`INSERT OR REPLACE INTO projects (id, name, description, long_description, image, image_id, category_ids, technology_ids, github, live, featured, created_at, updated_at) VALUES (
    ${escapeSql(pr.$id || pr.id)},
    ${escapeSql(pr.name || "")},
    ${escapeSql(pr.description || "")},
    ${escapeSql(pr.long_description || null)},
    ${escapeSql(pr.image || "")},
    ${escapeSql(pr.image_id || null)},
    ${escapeSql(pr.category_ids || [])},
    ${escapeSql(pr.technology_ids || [])},
    ${escapeSql(pr.github || null)},
    ${escapeSql(pr.live || null)},
    ${escapeSql(pr.featured ? 1 : 0)},
    ${escapeSql(pr.$createdAt || new Date().toISOString())},
    ${escapeSql(pr.$updatedAt || new Date().toISOString())}
  );`);
}

// Uses
const uses = loadJson("uses");
for (const u of uses) {
  sqlLines.push(`INSERT OR REPLACE INTO uses (id, category_id, name, description, link, image, image_id, is_favorite, priority, created_at, updated_at) VALUES (
    ${escapeSql(u.$id || u.id)},
    ${escapeSql(u.category_id || "")},
    ${escapeSql(u.name || "")},
    ${escapeSql(u.description || "")},
    ${escapeSql(u.link || null)},
    ${escapeSql(u.image || null)},
    ${escapeSql(u.image_id || null)},
    ${escapeSql(u.is_favorite ? 1 : 0)},
    ${escapeSql(u.priority || 0)},
    ${escapeSql(u.$createdAt || new Date().toISOString())},
    ${escapeSql(u.$updatedAt || new Date().toISOString())}
  );`);
}

// Social Links
const socials = loadJson("social_links");
for (const sl of socials) {
  sqlLines.push(`INSERT OR REPLACE INTO social_links (id, platform, url, icon, priority, is_visible, created_at, updated_at) VALUES (
    ${escapeSql(sl.$id || sl.id)},
    ${escapeSql(sl.platform || "")},
    ${escapeSql(sl.url || "")},
    ${escapeSql(sl.icon || "")},
    ${escapeSql(sl.priority || 0)},
    ${escapeSql(sl.is_visible !== false ? 1 : 0)},
    ${escapeSql(sl.$createdAt || new Date().toISOString())},
    ${escapeSql(sl.$updatedAt || new Date().toISOString())}
  );`);
}

// Blog Posts
const blogPosts = loadJson("blog_posts");
for (const bp of blogPosts) {
  let cover = bp.cover_image || "";
  if (cover.includes("cloud.appwrite.io")) {
    cover = "/blog/how-i-built-this-site.png";
  }
  sqlLines.push(`INSERT OR REPLACE INTO blog_posts (id, title, slug, excerpt, content, cover_image, cover_image_id, date, reading_time, category_ids, tag_ids, technology_ids, status, featured, series_id, series_position, related_post_ids, recommended_next_read_id, read_count, likes, created_at, updated_at) VALUES (
    ${escapeSql(bp.$id || bp.id)},
    ${escapeSql(bp.title || "")},
    ${escapeSql(bp.slug || "")},
    ${escapeSql(bp.excerpt || "")},
    ${escapeSql(bp.content || "")},
    ${escapeSql(cover)},
    ${escapeSql(bp.cover_image_id || null)},
    ${escapeSql(bp.date || new Date().toISOString().split("T")[0])},
    ${escapeSql(bp.reading_time || "5 min")},
    ${escapeSql(bp.category_ids || [])},
    ${escapeSql(bp.tag_ids || [])},
    ${escapeSql(bp.technology_ids || [])},
    ${escapeSql(bp.status || "published")},
    ${escapeSql(bp.featured ? 1 : 0)},
    ${escapeSql(bp.series_id || null)},
    ${escapeSql(bp.series_position || null)},
    ${escapeSql(bp.related_post_ids || [])},
    ${escapeSql(bp.recommended_next_read_id || null)},
    ${escapeSql(bp.read_count || 0)},
    ${escapeSql(bp.likes || 0)},
    ${escapeSql(bp.$createdAt || new Date().toISOString())},
    ${escapeSql(bp.$updatedAt || new Date().toISOString())}
  );`);
}

// Comments
const comments = loadJson("comments");
for (const cm of comments) {
  sqlLines.push(`INSERT OR REPLACE INTO comments (id, post_id, author_name, author_email, content, created_at) VALUES (
    ${escapeSql(cm.$id || cm.id)},
    ${escapeSql(cm.post_id || "")},
    ${escapeSql(cm.author_name || "")},
    ${escapeSql(cm.author_email || null)},
    ${escapeSql(cm.content || "")},
    ${escapeSql(cm.$createdAt || new Date().toISOString())}
  );`);
}

// Guest Book
const guestBooks = loadJson("guest_book");
for (const gb of guestBooks) {
  sqlLines.push(`INSERT OR REPLACE INTO guest_book (id, name, message, date, created_at) VALUES (
    ${escapeSql(gb.$id || gb.id)},
    ${escapeSql(gb.name || "")},
    ${escapeSql(gb.message || "")},
    ${escapeSql(gb.date || new Date().toISOString().split("T")[0])},
    ${escapeSql(gb.$createdAt || new Date().toISOString())}
  );`);
}

// Visitors
const visitors = loadJson("visitors");
for (const v of visitors) {
  sqlLines.push(`INSERT OR REPLACE INTO visitors (id, timestamp, ip_address, user_agent, referrer, page, visit_count, session_id, country_code, country_name, created_at, updated_at) VALUES (
    ${escapeSql(v.$id || v.id)},
    ${escapeSql(v.timestamp || new Date().toISOString())},
    ${escapeSql(v.ip_address || null)},
    ${escapeSql(v.user_agent || null)},
    ${escapeSql(v.referrer || null)},
    ${escapeSql(v.page || "/")},
    ${escapeSql(v.visit_count || 1)},
    ${escapeSql(v.session_id || v.$id || "session")},
    ${escapeSql(v.country_code || "Unknown")},
    ${escapeSql(v.country_name || "Unknown")},
    ${escapeSql(v.$createdAt || new Date().toISOString())},
    ${escapeSql(v.$updatedAt || new Date().toISOString())}
  );`);
}

const outFile = path.resolve("migrations/seed.sql");
fs.writeFileSync(outFile, sqlLines.join("\n"), "utf-8");
console.log(`✅ Generated ${sqlLines.length} SQL insert statements in ${outFile}`);
