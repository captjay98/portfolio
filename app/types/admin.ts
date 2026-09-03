/* eslint-disable  @typescript-eslint/no-explicit-any */

export type CategoryType = {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type TechnologyType = {
  id: string;
  name: string;
  category_id: string;
  icon?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
};

export type SkillType = {
  id: string;
  name: string;
  category_id: string;
  technology_id: string;
  level: string;
  years: number;
  created_at?: string;
  updated_at?: string;
};

export type ExperienceType = {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  category_ids: string[];
  technology_ids: string[];
  created_at?: string;
  updated_at?: string;
};

export type ExperienceAccomplishmentType = {
  id: string;
  experience_id: string;
  text: string;
  order: number;
  created_at?: string;
  updated_at?: string;
};

export type ProjectType = {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  image: string;
  image_id?: string;
  category_ids: string[];
  technology_ids: string[];
  github?: string;
  live?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogSeriesType = {
  id: string;
  title: string;
  description?: string;
  slug: string;
  image?: string;
  image_id?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export type BlogPostType = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_image_id?: string;
  date: string;
  reading_time: string;
  category_ids: string[];
  tag_ids?: string[];
  technology_ids?: string[];
  status: "draft" | "published";
  featured: boolean;
  series_id?: string;
  series_position?: number;
  related_post_ids?: string[];
  recommended_next_read_id?: string;
  read_count?: number;
  likes?: number;
  created_at?: string;
  updated_at?: string;
};

export type ProfileType = {
  id: string;
  full_name: string;
  nickname: string;
  title: string;
  bio_short: string;
  bio_long: string;
  location: string;
  avatar: string;
  avatar_id?: string;
  cover_image?: string;
  cover_image_id?: string;
  resume_url?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
};

export type SocialLinkType = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  priority: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type UsesItemType = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  link?: string;
  image?: string;
  image_id?: string;
  is_favorite: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type CurrentTechStackType = {
  id: string;
  name: string;
  category_id: string;
  technology_ids: string[];
  priority: number;
  created_at?: string;
  updated_at?: string;
};

export type EducationType = {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_current: boolean;
  priority: number;
  created_at?: string;
  updated_at?: string;
};

export type ContactSubmissionType = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
  updated_at?: string;
};

export type VisitorType = {
  $id: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  page?: string;
  visit_count: number;
  session_id: string;
  created_at?: string;
  updated_at?: string;
  country_code?: string;
  country_name?: string;
};

//Not Really Used Anywhere Currently.
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: any;
  message?: string;
};

export type slugParams = Promise<{ slug: string }>;
