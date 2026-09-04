import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const profile = sqliteTable('profile', {
  id: text('id').primaryKey(),
  full_name: text('full_name').notNull(),
  nickname: text('nickname').notNull().default(''),
  title: text('title').notNull().default(''),
  bio_short: text('bio_short').notNull().default(''),
  bio_long: text('bio_long').notNull().default(''),
  location: text('location').notNull().default(''),
  avatar: text('avatar').notNull().default('/profile/default-avatar.webp'),
  avatar_id: text('avatar_id'),
  cover_image: text('cover_image'),
  cover_image_id: text('cover_image_id'),
  resume_url: text('resume_url'),
  meta_description: text('meta_description'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  parent_id: text('parent_id'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const technologies = sqliteTable('technologies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category_id: text('category_id').notNull(),
  icon: text('icon'),
  website: text('website'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const skills = sqliteTable('skills', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category_id: text('category_id').notNull(),
  technology_id: text('technology_id'),
  level: text('level').notNull().default('Beginner'),
  years: integer('years').notNull().default(1),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const experiences = sqliteTable('experiences', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location').notNull().default(''),
  start_date: text('start_date').notNull(),
  end_date: text('end_date'),
  description: text('description').notNull().default(''),
  category_ids: text('category_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  technology_ids: text('technology_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const experienceAccomplishments = sqliteTable('experience_accomplishments', {
  id: text('id').primaryKey(),
  experience_id: text('experience_id').notNull(),
  text: text('text').notNull(),
  order: integer('order').notNull().default(0),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  long_description: text('long_description'),
  image: text('image').notNull().default(''),
  image_id: text('image_id'),
  category_ids: text('category_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  technology_ids: text('technology_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  github: text('github'),
  live: text('live'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  is_archived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const blogSeries = sqliteTable('blog_series', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  image_id: text('image_id'),
  status: text('status').notNull().default('published'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const blogPosts = sqliteTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull().default(''),
  content: text('content').notNull(),
  cover_image: text('cover_image').notNull().default(''),
  cover_image_id: text('cover_image_id'),
  date: text('date').notNull(),
  reading_time: text('reading_time').notNull().default('5 min'),
  category_ids: text('category_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  tag_ids: text('tag_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  technology_ids: text('technology_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  status: text('status').notNull().default('published'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  series_id: text('series_id'),
  series_position: integer('series_position'),
  related_post_ids: text('related_post_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  recommended_next_read_id: text('recommended_next_read_id'),
  read_count: integer('read_count').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const education = sqliteTable('education', {
  id: text('id').primaryKey(),
  degree: text('degree').notNull(),
  institution: text('institution').notNull(),
  location: text('location'),
  start_date: text('start_date').notNull(),
  end_date: text('end_date'),
  description: text('description'),
  is_current: integer('is_current', { mode: 'boolean' }).notNull().default(false),
  priority: integer('priority').notNull().default(0),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const currentTechStack = sqliteTable('current_tech_stack', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category_id: text('category_id').notNull(),
  technology_ids: text('technology_ids', { mode: 'json' }).$type<string[]>().notNull().default([]),
  priority: integer('priority').notNull().default(0),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const uses = sqliteTable('uses', {
  id: text('id').primaryKey(),
  category_id: text('category_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  link: text('link'),
  image: text('image'),
  image_id: text('image_id'),
  is_favorite: integer('is_favorite', { mode: 'boolean' }).notNull().default(false),
  priority: integer('priority').notNull().default(0),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const socialLinks = sqliteTable('social_links', {
  id: text('id').primaryKey(),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  icon: text('icon').notNull().default(''),
  priority: integer('priority').notNull().default(0),
  is_visible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const contactSubmissions = sqliteTable('contact_submissions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull().default(''),
  message: text('message').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const visitors = sqliteTable('visitors', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  referrer: text('referrer'),
  page: text('page').default('/'),
  visit_count: integer('visit_count').notNull().default(1),
  session_id: text('session_id').notNull(),
  country_code: text('country_code').default('Unknown'),
  country_name: text('country_name').default('Unknown'),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  post_id: text('post_id').notNull(),
  author_name: text('author_name').notNull(),
  author_email: text('author_email'),
  content: text('content').notNull(),
  created_at: text('created_at').notNull(),
});

export const guestBook = sqliteTable('guest_book', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  date: text('date').notNull(),
  created_at: text('created_at').notNull(),
});

export const siteSettings = sqliteTable('site_settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  name: text('name').notNull().default('Admin'),
  role: text('role').notNull().default('admin'),
  created_at: text('created_at').notNull(),
});
