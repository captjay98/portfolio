/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Cpu,
  ChevronRight,
  BookOpen,
  TagIcon,
  Award,
  Code,
  User,
  Link as LinkIcon,
  Laptop,
  MessageSquare,
  Eye,
  MessageCircle,
  BookIcon,
  Calendar,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogService } from "@/services/blogService";
import { projectService } from "@/services/projectService";
import { visitorService } from "@/services/visitorService";
import { contactService } from "@/services/contactService";
import { BlogPostType, ProjectType } from "../../types/admin";



export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    skills: 0,
    series: 0,
    categories: 0,
    technologies: 0,
    experience: 0,
    socialLinks: 0,
    uses: 0,
    messages: 0,
    views: 0,
    guestbookEntries: 0,
    comments: 0,
    todayVisitors: 0,
    todayMessages: 0,
    contactSubmissions: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  // Fetch data from services
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data
        const [
          blogs,
          projects,
          series,
          visitorCount,
          guestbookMessages,
          todayStats,
          contactSubmissions,
        ] = await Promise.all([
          blogService.getBlogs(),
          projectService ? projectService.getProjects() : [],
          blogService.getAllSeries(),
          visitorService.getVisitorCount(),
          visitorService.getGuestBookMessages(),
          visitorService.getTodayStats(),
          contactService.getSubmissions(),
        ]);

        // Get comments count
        let commentsCount = 0;
        const commentPromises = blogs.slice(0, 5).map((blog) =>
          blogService
            .getComments(blog.id)
            .then((comments) => {
              commentsCount += comments.length;
            })
            .catch((err) => console.error("Error counting comments:", err)),
        );

        await Promise.all(commentPromises);

        // Get skills count - replace with actual count when available
        const skillsCount = 12; // Placeholder until you implement skillService
        const technologiesCount = 15; // Placeholder
        const experienceCount = 5; // Placeholder
        const socialLinksCount = 6; // Placeholder
        const usesCount = 8; // Placeholder

        // Set stats
        setStats({
          blogs: blogs.length,
          projects: projects.length,
          skills: skillsCount,
          series: series.length,
          categories: getUniqueCategories(blogs).length,
          technologies: technologiesCount,
          experience: experienceCount,
          socialLinks: socialLinksCount,
          uses: usesCount,
          messages: 0, // Placeholder for contact form messages
          views: visitorCount,
          guestbookEntries: guestbookMessages.length,
          comments: commentsCount,
          todayVisitors: todayStats?.visitors || 0,
          todayMessages: guestbookMessages.length || 0,
          contactSubmissions: contactSubmissions.length,
        });

        // Generate recent activity
        const activity = generateRecentActivity(
          blogs,
          projects,
          series,
          contactSubmissions,
        );
        setRecentActivity(activity);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    const generateRecentActivity = (
      blogs: BlogPostType[],
      projects: ProjectType[],
      series: any[],
      contactSubmissions: any[],
    ): Activity[] => {
      const activity: Activity[] = [];

      // Add contact submission activity
      contactSubmissions.slice(0, 2).forEach((submission) => {
        activity.push({
          id: `contact-${submission.id}`,
          message: `Contact form submission from "${submission.name}" about "${submission.subject}"`,
          time: formatTimeAgo(submission.created_at || ""),
          type: "contact",
        });
      });

      // Add blog activity
      blogs.slice(0, 3).forEach((blog) => {
        activity.push({
          id: `blog-${blog.id}`,
          message: `Blog post "${blog.title}" ${blog.status === "published" ? "published" : "drafted"}`,
          time: formatTimeAgo(blog.updated_at || blog.created_at || ""),
          type: "blog",
        });
      });

      // Add project activity
      projects.slice(0, 2).forEach((project) => {
        activity.push({
          id: `project-${project.id}`,
          message: `Project "${project.name}" updated`,
          time: formatTimeAgo(project.updated_at || ""),
          type: "project",
        });
      });

      // Add series activity if available
      series.slice(0, 1).forEach((s) => {
        activity.push({
          id: `series-${s.id}`,
          message: `Blog series "${s.title}" updated`,
          time: formatTimeAgo(s.updated_at || s.created_at || ""),
          type: "blog",
        });
      });

      // Sort by most recent
      return activity
        .sort((a, b) => {
          const timeA = new Date(parseTimeAgo(a.time)).getTime();
          const timeB = new Date(parseTimeAgo(b.time)).getTime();
          return timeB - timeA;
        })
        .slice(0, 6);
    };

    fetchData();
  }, []);

  // Helper to extract unique categories from blogs
  const getUniqueCategories = (blogs: BlogPostType[]) => {
    const categories = new Set<string>();
    blogs.forEach((blog) => {
      blog.category_ids?.forEach((category) => {
        categories.add(category);
      });
    });
    return Array.from(categories);
  };

  // Helper to format timestamps as "time ago"
  const formatTimeAgo = (timestamp: string): string => {
    if (!timestamp) return "recently";

    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "just now";
    }
  };

  // Helper to parse "time ago" back to a date for sorting
  const parseTimeAgo = (timeAgo: string): Date => {
    const now = new Date();

    if (timeAgo === "just now") {
      return now;
    }

    const parts = timeAgo.split(" ");
    const value = parseInt(parts[0], 10);
    const unit = parts[1];

    if (unit.includes("day")) {
      now.setDate(now.getDate() - value);
    } else if (unit.includes("hour")) {
      now.setHours(now.getHours() - value);
    } else if (unit.includes("minute")) {
      now.setMinutes(now.getMinutes() - value);
    }

    return now;
  };

  return (
    <div className="animate-fade-in pb-20">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your portfolio content and settings
            </p>
          </div>
          <Button variant="default" size="sm" asChild>
            <Link href="/admin/profile">
              <User size={16} className="mr-2" />
              Profile Settings
            </Link>
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-blue-600 dark:text-blue-400">
            Loading dashboard data...
          </div>
        </div>
      ) : (
        <>
          {/* Ultra-compact card grid with horizontal layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
            <MiniCard
              title="Blog Posts"
              icon={<FileText size={12} />}
              count={stats.blogs}
              link="/admin/blogs"
              color="blue"
            />
            <MiniCard
              title="Projects"
              icon={<Briefcase size={12} />}
              count={stats.projects}
              link="/admin/projects"
              color="green"
            />
            <MiniCard
              title="Series"
              icon={<BookOpen size={12} />}
              count={stats.series}
              link="/admin/series"
              color="orange"
            />
            <MiniCard
              title="Categories"
              icon={<TagIcon size={12} />}
              count={stats.categories}
              link="/admin/categories"
              color="purple"
            />
            <MiniCard
              title="Skills"
              icon={<Award size={12} />}
              count={stats.skills}
              link="/admin/skills"
              color="cyan"
            />
            <MiniCard
              title="Tech"
              icon={<Code size={12} />}
              count={stats.technologies}
              link="/admin/technologies"
              color="indigo"
            />
            <MiniCard
              title="Experience"
              icon={<Briefcase size={12} />}
              count={stats.experience}
              link="/admin/experience"
              color="teal"
            />
            <MiniCard
              title="Social"
              icon={<LinkIcon size={12} />}
              count={stats.socialLinks}
              link="/admin/social-links"
              color="pink"
            />
            <MiniCard
              title="Uses"
              icon={<Laptop size={12} />}
              count={stats.uses}
              link="/admin/uses"
              color="amber"
            />
            <MiniCard
              title="Contact"
              icon={<Mail size={12} />}
              count={stats.contactSubmissions}
              link="/admin/contact-submissions"
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Recent Activity Section */}
            <section className="md:col-span-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Recent Activity
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 dark:text-blue-400"
                >
                  View all
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  {recentActivity.length > 0 ? (
                    <ul className="space-y-3">
                      {recentActivity.map((activity) => (
                        <ActivityItem
                          key={activity.id}
                          message={activity.message}
                          time={activity.time}
                          type={activity.type}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No recent activity found
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Enhanced Site Stats Section */}
            <section className="md:col-span-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Site Stats
              </h2>
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-1 border-b border-gray-100 dark:border-gray-700">
                      Visitors
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <StatItem
                        icon={<Eye size={16} />}
                        label="Total Visitors"
                        value={stats.views.toString()}
                        color="blue"
                      />
                      <StatItem
                        icon={<Calendar size={16} />}
                        label="Today"
                        value={stats.todayVisitors.toString()}
                        color="blue"
                        isCompact
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-1 border-b border-gray-100 dark:border-gray-700">
                      Engagement
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <StatItem
                        icon={<MessageSquare size={16} />}
                        label="Guestbook"
                        value={stats.guestbookEntries.toString()}
                        color="green"
                        isCompact
                      />
                      <StatItem
                        icon={<Mail size={16} />}
                        label="Contact"
                        value={stats.contactSubmissions.toString()}
                        color="red"
                        isCompact
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-1 border-b border-gray-100 dark:border-gray-700">
                      Content
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <StatItem
                        icon={<MessageCircle size={16} />}
                        label="Comments"
                        value={stats.comments.toString()}
                        color="orange"
                        isCompact
                      />
                      <StatItem
                        icon={<BookIcon size={16} />}
                        label="Reads"
                        value={(stats.views * 0.45).toFixed(0)}
                        color="purple"
                        subtitle="Est."
                        isCompact
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

// Types
type CardColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "cyan"
  | "indigo"
  | "teal"
  | "amber"
  | "red";

interface Activity {
  id: string;
  message: string;
  time: string;
  type: "blog" | "project" | "skill" | "general" | "contact";
}

// Mini card component with horizontal layout
function MiniCard({
  title,
  icon,
  count,
  link,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  link: string;
  color: CardColor;
}) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-300",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-700 dark:text-green-300",
      hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-300",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-700 dark:text-orange-300",
      hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
    },
    pink: {
      bg: "bg-pink-50 dark:bg-pink-900/20",
      text: "text-pink-700 dark:text-pink-300",
      hover: "hover:bg-pink-100 dark:hover:bg-pink-900/30",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-700 dark:text-cyan-300",
      hover: "hover:bg-cyan-100 dark:hover:bg-cyan-900/30",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-700 dark:text-indigo-300",
      hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
    },
    teal: {
      bg: "bg-teal-50 dark:bg-teal-900/20",
      text: "text-teal-700 dark:text-teal-300",
      hover: "hover:bg-teal-100 dark:hover:bg-teal-900/30",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-700 dark:text-amber-300",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-900/30",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-700 dark:text-red-300",
      hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
    },
  };

  return (
    <Link href={link}>
      <Card
        className={`${colorClasses[color].bg} ${colorClasses[color].hover} transition-colors border-l-2 border-l-${color}-500 h-full cursor-pointer`}
      >
        <CardContent className="p-2 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <div className={`${colorClasses[color].text} mr-1.5`}>{icon}</div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                {title}
              </h3>
            </div>
            <div className={`${colorClasses[color].text} text-lg font-bold`}>
              {count}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({
  message,
  time,
  type,
}: {
  message: string;
  time: string;
  type: "blog" | "project" | "skill" | "general" | "contact";
}) {
  const iconMap = {
    blog: <FileText size={14} className="text-blue-500 dark:text-blue-400" />,
    project: (
      <Briefcase size={14} className="text-green-500 dark:text-green-400" />
    ),
    skill: <Cpu size={14} className="text-purple-500 dark:text-purple-400" />,
    general: (
      <ChevronRight size={14} className="text-gray-500 dark:text-gray-400" />
    ),
    contact: <Mail size={14} className="text-red-500 dark:text-red-400" />,
  };

  return (
    <li className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
      <div className="bg-gray-100 dark:bg-slate-700 p-1.5 rounded-full mt-0.5">
        {iconMap[type]}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-700 dark:text-gray-300">{message}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
          {time}
        </p>
      </div>
    </li>
  );
}

// Enhanced stat item for site stats section
function StatItem({
  icon,
  label,
  value,
  color,
  subtitle,
  isCompact = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: CardColor;
  subtitle?: string;
  isCompact?: boolean;
}) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400",
    pink: "text-pink-600 dark:text-pink-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    teal: "text-teal-600 dark:text-teal-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
  };

  if (isCompact) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/50`}
      >
        <div className={`mb-1 ${colorClasses[color]}`}>{icon}</div>
        <div className="text-center">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {label}
          </div>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="text-sm font-semibold">{value}</span>
            {subtitle && (
              <span className="text-xs text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div
        className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <div className="ml-3">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold">{value}</span>
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
