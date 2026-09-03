import { createFileRoute, Link } from '@tanstack/react-router'
import VisitorCounter from '@app/components/home/visitor-counter'
import { profileService } from '@app/services/profileService'
import { currentTechStackService } from '@app/services/currentTechStackService'
import { projectService } from '@app/services/projectService'
import { blogService } from '@app/services/blogService'
import LucideIcon from '@app/components/LucideIcon'
import { ArrowUpRight, BookOpen, Briefcase, Calendar, Clock, ExternalLink, FileText, Github, Sparkles } from 'lucide-react'
import * as React from 'react'

const fetchData = async () => {
  try {
    const [profile, currentTechStack, socialLinks, allProjects, blogPosts] = await Promise.all([
      profileService.getProfile(),
      currentTechStackService.getCurrentTechsWithDetails(),
      profileService.getSocialLinks(),
      projectService.getProjectsWithDetails(),
      blogService.getPublishedPosts(),
    ])
    return {
      profile,
      currentTechStack: currentTechStack || [],
      socialLinks: socialLinks || [],
      featuredProjects: (allProjects || []).slice(0, 3),
      recentPosts: (blogPosts || []).slice(0, 3),
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      profile: null,
      currentTechStack: [],
      socialLinks: [],
      featuredProjects: [],
      recentPosts: [],
    }
  }
}

export const Route = createFileRoute('/')({
  loader: () => fetchData(),
  component: Home,
})

function Home() {
  const { profile, currentTechStack, socialLinks, featuredProjects, recentPosts } = Route.useLoaderData()

  // Filter for visible social links
  const visibleSocialLinks = socialLinks ? socialLinks.filter((link: any) => link.is_visible) : []

  return (
    <main className="min-h-screen animate-fade-in pb-24">
      {/* Hero & Conversational Narrative Section */}
      <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-20">
        {/* Editorial Masthead Header */}
        <div className="space-y-4 border-b border-light-subtle/15 dark:border-dark-subtle/15 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
            <Sparkles size={12} />
            <span>Journal // Issue 2026</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-light-text dark:text-[#ffffff] tracking-tight leading-[1.15]">
            {profile?.full_name || 'Jamal Ibrahim Umar'}
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-light-subtle dark:text-[#d9d7d3]/85 leading-relaxed">
            Software engineer crafting resilient distributed systems, elegant developer tools, and thoughtful web applications.
          </p>

          {/* Social Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4">
            {visibleSocialLinks.map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-light-text dark:text-dark-text border border-light-subtle/20 dark:border-dark-subtle/20 bg-light-background/60 dark:bg-[#131721]/70 hover:border-[#e6b450]/60 hover:text-[#e6b450] transition-all duration-200"
              >
                <LucideIcon name={link.icon} size={14} />
                <span>{link.platform}</span>
                <ArrowUpRight size={12} className="opacity-60" />
              </a>
            ))}

            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-[#0a0e14] bg-[#e6b450] hover:bg-[#e6b450]/90 font-medium transition-all duration-200"
              >
                <FileText size={14} />
                <span>Curriculum Vitae</span>
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Conversational Long-Form Bio with Authentic Ayu Syntax Highlights */}
        <div className="py-12 space-y-6 text-base sm:text-lg leading-relaxed text-light-text/90 dark:text-[#d9d7d3]/90">
          <p>
            Hello. I am a software engineer based between Copenhagen and London, focusing on the architecture of fast, durable systems. I believe that good software is born at the intersection of literary craftsmanship and mechanical sympathy: clean interfaces, observable state, and minimal dependencies.
          </p>

          <p>
            Currently, I build distributed web applications using{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#39bae6]/40 bg-[#39bae6]/10 text-[#39bae6]">
              Cloudflare Edge Workers
            </span>{' '}
            and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#39bae6]/40 bg-[#39bae6]/10 text-[#39bae6]">
              Cloudflare D1 SQLite
            </span>
            , married with{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#aad94c]/40 bg-[#aad94c]/10 text-[#aad94c]">
              TanStack Start
            </span>{' '}
            and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#aad94c]/40 bg-[#aad94c]/10 text-[#aad94c]">
              React 19
            </span>
            . On the language front, I operate primarily in{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
              TypeScript
            </span>
            ,{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
              Go
            </span>
            , and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
              Python
            </span>
            , backed by{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#f07178]/40 bg-[#f07178]/10 text-[#f07178]">
              PostgreSQL
            </span>{' '}
            and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#f07178]/40 bg-[#f07178]/10 text-[#f07178]">
              Drizzle ORM
            </span>
            .
          </p>

          <p className="text-light-subtle dark:text-dark-subtle text-sm font-serif italic">
            &ldquo;We shape our tools, and thereafter our tools shape us.&rdquo; — Father John Culkin
          </p>
        </div>

        {/* Current Active Toolchain (Ayu Categorized) */}
        {currentTechStack && currentTechStack.length > 0 && (
          <div className="py-8 border-t border-light-subtle/15 dark:border-dark-subtle/15">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#e6b450] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e6b450]"></span>
                Curated Active Stack
              </h2>
              <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                Ayu Syntax Mappings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentTechStack.map((item: any) => {
                const categoryName = item.category?.name || 'Tooling'
                // Assign Ayu color token based on category name
                let badgeBorder = 'border-[#39bae6]/30 bg-[#39bae6]/5 text-[#39bae6]'
                if (categoryName.toLowerCase().includes('front') || categoryName.toLowerCase().includes('web')) {
                  badgeBorder = 'border-[#aad94c]/30 bg-[#aad94c]/5 text-[#aad94c]'
                } else if (categoryName.toLowerCase().includes('data') || categoryName.toLowerCase().includes('back')) {
                  badgeBorder = 'border-[#f07178]/30 bg-[#f07178]/5 text-[#f07178]'
                } else if (categoryName.toLowerCase().includes('lang') || categoryName.toLowerCase().includes('core')) {
                  badgeBorder = 'border-[#e6b450]/30 bg-[#e6b450]/5 text-[#e6b450]'
                }

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/50 hover:border-[#e6b450]/40 transition-all duration-200 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-light-text dark:text-dark-text">
                        {item.technology?.name || item.name}
                      </h3>
                      <p className="text-xs text-light-subtle dark:text-dark-subtle/70 font-mono">
                        {categoryName}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeBorder}`}>
                      Ayu
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Selected Works / Editorial Project Callouts */}
        {featuredProjects && featuredProjects.length > 0 && (
          <div className="py-12 border-t border-light-subtle/15 dark:border-dark-subtle/15">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-light-text dark:text-dark-text">
                  Selected Works
                </h2>
                <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-1">
                  Chronological highlights &amp; production systems
                </p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-mono text-light-accent dark:text-[#e6b450] hover:underline flex items-center gap-1"
              >
                <span>Complete Index</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="space-y-6">
              {featuredProjects.map((project: any, index: number) => {
                const year = project.created_at ? new Date(project.created_at).getFullYear() : 2026 - index
                const primaryCategory = project.categories?.[0]?.name || 'Systems Architecture'

                return (
                  <article
                    key={project.id}
                    className="p-6 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 hover:border-[#e6b450]/40 transition-all duration-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#e6b450]/15 text-[#e6b450] border border-[#e6b450]/30">
                          {year}
                        </span>
                        <h3 className="font-serif text-xl md:text-2xl text-light-text dark:text-dark-text font-medium">
                          {project.name}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                        {primaryCategory}
                      </span>
                    </div>

                    <p className="text-sm md:text-base leading-relaxed text-light-text/80 dark:text-[#d9d7d3]/80">
                      {project.description}
                    </p>

                    {/* Tech Badges & Direct Links */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-light-subtle/10 dark:border-dark-subtle/10">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies?.slice(0, 4).map((tech: any) => (
                          <span
                            key={tech.id}
                            className="text-xs font-mono px-2 py-0.5 rounded bg-light-subtle/10 dark:bg-dark-border text-light-text dark:text-dark-text border border-light-subtle/10 dark:border-dark-subtle/20"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-light-subtle dark:text-dark-subtle hover:text-[#e6b450] transition-colors"
                          >
                            <Github size={14} />
                            <span>Source</span>
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-light-accent dark:text-[#e6b450] font-medium hover:underline"
                          >
                            <span>Visit Site</span>
                            <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* Selected Writings / Recent Journal Entries */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="py-12 border-t border-light-subtle/15 dark:border-dark-subtle/15">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-light-text dark:text-dark-text">
                  Recent Writings
                </h2>
                <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-1">
                  Essays on architecture, systems, and craftsmanship
                </p>
              </div>
              <Link
                to="/blog"
                className="text-xs font-mono text-light-accent dark:text-[#e6b450] hover:underline flex items-center gap-1"
              >
                <span>All Articles</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {recentPosts.map((post: any) => {
                const dateStr = post.published_at
                  ? new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent'

                return (
                  <Link
                    key={post.id}
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="block p-5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/40 hover:border-[#e6b450]/40 transition-all duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <h3 className="font-serif text-lg md:text-xl text-light-text dark:text-dark-text group-hover:text-[#e6b450] transition-colors font-medium">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-mono text-light-subtle dark:text-dark-subtle shrink-0">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {dateStr}
                        </span>
                        {post.reading_time && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.reading_time} min
                          </span>
                        )}
                      </div>
                    </div>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-light-subtle dark:text-[#949dab] line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Signature Visitor Counter - Fixed Position Stationery Stamp */}
      <div className="fixed bottom-6 right-6 z-20">
        <VisitorCounter />
      </div>
    </main>
  )
}
