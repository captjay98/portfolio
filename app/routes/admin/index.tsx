import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import {
  FileText,
  FolderGit2,
  Mail,
  Activity,
  Plus,
  ArrowRight,
  Clock,
  BookOpen,
} from 'lucide-react'
import * as React from 'react'
import Dashboard from '@app/components/admin/dashboard'
import { blogService } from '@app/services/blogService'
import { projectService } from '@app/services/projectService'
import { contactService, ContactSubmission } from '@app/services/contactService'
import { visitorService } from '@app/services/visitorService'

const checkAuth = async () => {
  return { isAuthenticated: true }
}

export const Route = createFileRoute('/admin/')({
  loader: () => checkAuth(),
  component: AdminDashboard,
})

function AdminDashboard() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = React.useState<any[]>([])
  const [inquiries, setInquiries] = React.useState<ContactSubmission[]>([])
  const [projectsCount, setProjectsCount] = React.useState<number>(0)
  const [visitorCount, setVisitorCount] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        const [blogsRes, projectsRes, inquiriesRes, visitorsRes] = await Promise.allSettled([
          blogService.getBlogs(),
          projectService.getProjects(),
          contactService.getSubmissions(),
          visitorService.getVisitorCount(),
        ])

        if (isMounted) {
          if (blogsRes.status === 'fulfilled') setBlogs(blogsRes.value)
          if (projectsRes.status === 'fulfilled') setProjectsCount(projectsRes.value.length)
          if (inquiriesRes.status === 'fulfilled') setInquiries(inquiriesRes.value)
          if (visitorsRes.status === 'fulfilled') setVisitorCount(visitorsRes.value)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to load dashboard data:', e)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  const publishedBlogs = blogs.filter((b) => b.status === 'published')
  const draftBlogs = blogs.filter((b) => b.status !== 'published')
  const recentPosts = blogs.slice(0, 5)
  const recentInquiries = inquiries.slice(0, 4)

  return (
    <Dashboard>
      <div className="space-y-12 animate-fade-in">
        {/* Editorial Masthead Header */}
        <header className="space-y-3 pb-8 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-dark-text tracking-tight">
            Studio Overview
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-light-subtle dark:text-dark-subtle leading-relaxed max-w-3xl">
            Welcome back, Jamal. Here is a calm summary of your publications, ongoing work, and reader correspondence.
          </p>

          {/* Quick Actions Row */}
          <div className="pt-4 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigate({ to: '/admin/blogs/new' as any })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold tracking-wider transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>WRITE ESSAY</span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: '/admin/projects/new' as any })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-light-subtle/20 dark:border-dark-subtle/20 bg-white dark:bg-[#0a0e14] text-light-text dark:text-dark-text hover:border-amber-500/40 text-xs font-mono transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEW PROJECT</span>
            </button>
            <Link
              to="/admin/contact-submissions"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-light-subtle dark:text-dark-subtle hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors ml-auto"
            >
              <span>View Inquiries ({inquiries.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Typographic Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <Link
            to="/admin/blogs"
            className="group block space-y-1 p-4 rounded-xl border border-light-subtle/15 dark:border-dark-subtle/15 bg-white/50 dark:bg-[#0a0e14]/50 hover:border-amber-500/40 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-serif text-light-text dark:text-dark-text font-normal group-hover:text-amber-700 dark:group-hover:text-[#e6b450] transition-colors">
              {isLoading ? '...' : blogs.length}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle">
              Essays ({publishedBlogs.length} live)
            </div>
          </Link>

          <Link
            to="/admin/projects"
            className="group block space-y-1 p-4 rounded-xl border border-light-subtle/15 dark:border-dark-subtle/15 bg-white/50 dark:bg-[#0a0e14]/50 hover:border-amber-500/40 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-serif text-light-text dark:text-dark-text font-normal group-hover:text-cyan-700 dark:group-hover:text-[#39bae6] transition-colors">
              {isLoading ? '...' : projectsCount}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle">
              Engineered Projects
            </div>
          </Link>

          <Link
            to="/admin/contact-submissions"
            className="group block space-y-1 p-4 rounded-xl border border-light-subtle/15 dark:border-dark-subtle/15 bg-white/50 dark:bg-[#0a0e14]/50 hover:border-amber-500/40 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-serif text-light-text dark:text-dark-text font-normal group-hover:text-rose-700 dark:group-hover:text-[#f07178] transition-colors">
              {isLoading ? '...' : inquiries.length}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle">
              Inquiries Dispatched
            </div>
          </Link>

          <Link
            to="/admin/visitors"
            className="group block space-y-1 p-4 rounded-xl border border-light-subtle/15 dark:border-dark-subtle/15 bg-white/50 dark:bg-[#0a0e14]/50 hover:border-amber-500/40 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-serif text-light-text dark:text-dark-text font-normal group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {isLoading ? '...' : visitorCount}
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle">
              Total Reader Visits
            </div>
          </Link>
        </div>

        {/* Focused Two-Pane Activity Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Recent Writing */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-light-subtle/15 dark:border-dark-subtle/15">
              <h2 className="font-serif italic text-xl text-light-text dark:text-dark-text">
                Recent Writing
              </h2>
              <Link
                to="/admin/blogs"
                className="text-xs font-mono text-light-subtle dark:text-dark-subtle hover:text-amber-700 dark:hover:text-[#e6b450] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-light-subtle dark:text-dark-subtle border border-dashed border-light-subtle/20 dark:border-dark-subtle/20 rounded-xl">
                No essays in the journal yet.
              </div>
            ) : (
              <div className="divide-y divide-light-subtle/10 dark:divide-dark-subtle/10">
                {recentPosts.map((post: any) => (
                  <div
                    key={post.id}
                    onClick={() => navigate({ to: `/admin/blogs/edit/${post.id}` as any })}
                    className="group cursor-pointer py-3.5 flex items-start justify-between gap-4 hover:bg-light-subtle/5 dark:hover:bg-white/5 px-2 rounded-lg transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-medium text-sm text-light-text dark:text-dark-text group-hover:text-amber-700 dark:group-hover:text-[#e6b450] transition-colors truncate">
                        {post.title}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-light-subtle dark:text-dark-subtle">
                        <span>
                          {post.published_at || post.date
                            ? new Date(post.published_at || post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Draft'}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{post.read_count || 0} reads</span>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 px-2 py-0.5 text-[10px] font-mono rounded ${
                        post.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-[#e6b450] border border-amber-500/20'
                      }`}
                    >
                      {post.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Recent Inquiries & Letters */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-light-subtle/15 dark:border-dark-subtle/15">
              <h2 className="font-serif italic text-xl text-light-text dark:text-dark-text">
                Recent Correspondence
              </h2>
              <Link
                to="/admin/contact-submissions"
                className="text-xs font-mono text-light-subtle dark:text-dark-subtle hover:text-amber-700 dark:hover:text-[#e6b450] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-light-subtle dark:text-dark-subtle border border-dashed border-light-subtle/20 dark:border-dark-subtle/20 rounded-xl">
                No inquiries received yet.
              </div>
            ) : (
              <div className="divide-y divide-light-subtle/10 dark:divide-dark-subtle/10">
                {recentInquiries.map((sub: ContactSubmission) => (
                  <Link
                    key={sub.id}
                    to="/admin/contact-submissions"
                    className="group block py-3.5 hover:bg-light-subtle/5 dark:hover:bg-white/5 px-2 rounded-lg transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-light-text dark:text-dark-text group-hover:text-amber-700 dark:group-hover:text-[#e6b450] transition-colors">
                        {sub.name}
                      </span>
                      <span className="text-[11px] font-mono text-light-subtle/70 dark:text-dark-subtle/70">
                        {new Date(sub.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="text-xs text-light-text/90 dark:text-dark-text/90 font-medium truncate">
                      {sub.subject || 'Direct message'}
                    </div>
                    <p className="text-[11px] text-light-subtle dark:text-dark-subtle line-clamp-1">
                      {sub.message}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Studio Quick Directory */}
        <section className="pt-6 border-t border-light-subtle/15 dark:border-dark-subtle/15">
          <div className="text-[11px] font-mono uppercase tracking-wider text-light-subtle/70 dark:text-dark-subtle/70 mb-3">
            Studio Directory
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-light-subtle dark:text-dark-subtle">
            <Link to="/admin/experience" className="hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors">
              Experience Timeline
            </Link>
            <span>·</span>
            <Link to="/admin/education" className="hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors">
              Academic Records
            </Link>
            <span>·</span>
            <Link to="/admin/uses" className="hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors">
              Uses &amp; Hardware
            </Link>
            <span>·</span>
            <Link to="/admin/profile" className="hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors">
              Public Bio &amp; Location
            </Link>
            <span>·</span>
            <Link to="/admin/guest-book" className="hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors">
              Guest Book Signatures
            </Link>
            <span>·</span>
            <Link to="/admin/settings" className="hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors">
              Settings
            </Link>
          </div>
        </section>
      </div>
    </Dashboard>
  )
}
