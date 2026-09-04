import { createFileRoute, Link } from '@tanstack/react-router'
import VisitorCounter from '@app/components/home/visitor-counter'
import { profileService } from '@app/services/profileService'
import { currentTechStackService } from '@app/services/currentTechStackService'
import { projectService } from '@app/services/projectService'
import { blogService } from '@app/services/blogService'
import LucideIcon from '@app/components/LucideIcon'
import { ArrowUpRight, BookOpen, Briefcase, Calendar, Clock, ExternalLink, FileText, Github, Sparkles } from 'lucide-react'
import { getImageSrc } from '@app/utils/imageUtils'
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
      featuredProjects: ((allProjects || []).filter((p: any) => p.featured && !p.is_archived).length >= 4
        ? (allProjects || []).filter((p: any) => p.featured && !p.is_archived)
        : (allProjects || []).filter((p: any) => !p.is_archived)
      ).slice(0, 6),
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
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-20">
        {/* Editorial Masthead Header */}
        <div className="space-y-4 border-b border-light-subtle/15 dark:border-dark-subtle/15 pb-8 sm:pb-10">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-light-text dark:text-[#ffffff] tracking-tight leading-[1.15] break-words">
            {profile?.full_name || 'Jamal Ibrahim Umar'}
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-light-subtle dark:text-[#d9d7d3]/85 leading-relaxed">
            Software engineer crafting resilient distributed systems, product ecosystems, and thoughtful mobile and web applications.
          </p>

          {/* Social Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2 sm:pt-4">
            {visibleSocialLinks.map((link: any) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs font-mono text-light-text dark:text-dark-text border border-light-subtle/20 dark:border-dark-subtle/20 bg-light-background/60 dark:bg-[#131721]/70 hover:border-[#e6b450]/60 hover:text-[#e6b450] transition-all duration-200"
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
                className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs font-mono text-[#0a0e14] bg-[#e6b450] hover:bg-[#e6b450]/90 font-medium transition-all duration-200"
              >
                <FileText size={14} />
                <span>Curriculum Vitae</span>
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Conversational Narrative */}
        <div className="py-10 space-y-5 text-base sm:text-lg leading-relaxed text-light-text/90 dark:text-[#d9d7d3]/90">
          <p>
            Hello, I&apos;m Jamal (also <span className="text-[#e6b450] font-medium">CaptJay</span>). I am a software engineer who loves the craft of building things. My journey in tech began with tinkering, spending countless hours flashing custom ROMs, bricking, and patiently reviving my devices. I started dabbling in software engineering, which led me to the ALX SWE program (Cohort 5), turning that hands-on curiosity into a lifelong craft.
          </p>

          <p>
            Today, I build web applications, cross-platform mobile platforms, and robust backend architectures. I work primarily with{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#39bae6]/40 bg-[#39bae6]/10 text-[#39bae6]">
              Flutter
            </span>
            ,{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#aad94c]/40 bg-[#aad94c]/10 text-[#aad94c]">
              React
            </span>
            ,{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#aad94c]/40 bg-[#aad94c]/10 text-[#aad94c]">
              TanStack
            </span>
            ,{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
              FastAPI
            </span>
            , and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
              Laravel
            </span>{' '}
            across{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#f07178]/40 bg-[#f07178]/10 text-[#f07178]">
              GCP
            </span>{' '}
            and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#f07178]/40 bg-[#f07178]/10 text-[#f07178]">
              AWS
            </span>
            , frequently integrating autonomous agentic workflows and LLMs into production using the{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#d2a6ff]/40 bg-[#d2a6ff]/10 text-[#d2a6ff]">
              Gemini SDK
            </span>
            ,{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#d2a6ff]/40 bg-[#d2a6ff]/10 text-[#d2a6ff]">
              Strands
            </span>
            , and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border border-[#d2a6ff]/40 bg-[#d2a6ff]/10 text-[#d2a6ff]">
              AWS Bedrock
            </span>
            . I spend most of my time building systems while thoroughly enjoying the process.
          </p>

          <p className="text-light-subtle dark:text-dark-subtle text-sm font-serif italic border-l-2 border-[#e6b450]/50 pl-4 py-1">
            &ldquo;Fate rarely calls upon us at a moment of our choosing.&rdquo; &middot; Optimus Prime
          </p>
        </div>

        {/* Current Active Toolchain */}
        {currentTechStack && currentTechStack.length > 0 && (() => {
          const validStacks = currentTechStack.filter(
            (s: any) => s.technologies && s.technologies.length > 0
          )

          if (validStacks.length === 0) return null

          const getCategoryTheme = (name: string) => {
            const lower = name.toLowerCase()
            if (lower.includes('mobile')) return { dot: 'bg-[#39bae6]', text: 'text-[#39bae6]' }
            if (lower.includes('front') || lower.includes('web') || lower.includes('ui')) return { dot: 'bg-[#aad94c]', text: 'text-[#aad94c]' }
            if (lower.includes('back') || lower.includes('server') || lower.includes('api')) return { dot: 'bg-[#e6b450]', text: 'text-[#e6b450]' }
            if (lower.includes('ai') || lower.includes('agent') || lower.includes('ml')) return { dot: 'bg-[#d2a6ff]', text: 'text-[#d2a6ff]' }
            if (lower.includes('cloud') || lower.includes('devops') || lower.includes('infra')) return { dot: 'bg-[#f07178]', text: 'text-[#f07178]' }
            if (lower.includes('data') || lower.includes('db')) return { dot: 'bg-[#ff9940]', text: 'text-[#ff9940]' }
            return { dot: 'bg-[#e6b450]', text: 'text-[#e6b450]' }
          }

          const renderTechBadge = (tech: any) => (
            <span
              key={tech.id}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-light-background/90 dark:bg-[#0a0e14] border border-light-subtle/15 dark:border-[#1e2430] text-xs font-mono text-light-text dark:text-[#d9d7d3] hover:border-[#e6b450]/40 hover:text-[#e6b450] transition-colors"
            >
              {tech.icon && (
                <img
                  src={tech.icon}
                  alt=""
                  aria-hidden="true"
                  className="w-3.5 h-3.5 object-contain flex-shrink-0"
                  loading="lazy"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
              )}
              <span>{tech.name}</span>
            </span>
          )

          return (
            <div className="py-8 border-t border-light-subtle/15 dark:border-dark-subtle/15 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h2 className="font-serif text-xl sm:text-2xl text-light-text dark:text-dark-text">
                  Curated Active Stack
                </h2>
                <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                  Primary technologies across client and personal product ecosystems
                </p>
              </div>

              {/* Slim Colophon Ribbon */}
              <div className="rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/50 divide-y divide-light-subtle/10 dark:divide-[#1e2430] overflow-hidden">
                {validStacks.map((stack: any) => {
                  const stackName = (stack.name || stack.category?.name || 'Tooling').trim()
                  const theme = getCategoryTheme(stackName)

                  return (
                    <div
                      key={stack.id}
                      className="px-4 py-2.5 sm:px-5 sm:py-2.5 flex items-center gap-3 sm:gap-6 hover:bg-light-subtle/5 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="w-20 sm:w-28 flex-shrink-0 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} shrink-0`}></span>
                        <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${theme.text} truncate`}>
                          {stackName}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {stack.technologies?.map(renderTechBadge)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Recent Writings (Moved Above Selected Works) */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="py-8 border-t border-light-subtle/15 dark:border-dark-subtle/15 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif text-xl sm:text-2xl text-light-text dark:text-dark-text">
                    Recent Writings
                  </h2>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-dark-subtle border border-light-subtle/15 dark:border-[#1e2430]">
                    {recentPosts.slice(0, 3).length} entries
                  </span>
                </div>
                <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-0.5">
                  Essays on architecture, systems, and craftsmanship
                </p>
              </div>

              <Link
                to="/blog"
                className="text-xs font-mono text-light-accent dark:text-[#e6b450] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>All Articles</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentPosts.slice(0, 3).map((post: any) => {
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
                    className="block p-4 sm:p-5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/40 hover:border-[#e6b450]/40 transition-all duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5">
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
                            {post.reading_time.includes('min') ? post.reading_time : `${post.reading_time} min`}
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

        {/* Selected Works (Permanent 2x2 Grid, 6 Production Systems) */}
        {featuredProjects && featuredProjects.length > 0 && (() => {
          const displayedProjects = featuredProjects.slice(0, 6)

          return (
            <div className="py-8 border-t border-light-subtle/15 dark:border-dark-subtle/15 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-serif text-xl sm:text-2xl text-light-text dark:text-dark-text">
                      Selected Works
                    </h2>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-dark-subtle border border-light-subtle/15 dark:border-[#1e2430]">
                      {displayedProjects.length} systems
                    </span>
                  </div>
                  <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-0.5">
                    Production systems and engineering highlights
                  </p>
                </div>

                <Link
                  to="/projects"
                  className="text-xs font-mono text-light-accent dark:text-[#e6b450] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Complete Index</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              {/* 2x2 Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedProjects.map((project: any, index: number) => {
                  const year = project.created_at ? new Date(project.created_at).getFullYear() : 2026 - index
                  const primaryCategory = project.categories?.[0]?.name || 'Systems Architecture'

                  return (
                    <article
                      key={project.id}
                      className="group p-4 sm:p-5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/40 hover:border-[#e6b450]/40 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="flex-1 space-y-3">
                        {/* Project Image Preview */}
                        {project.image && (
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#0a0e14] border border-light-subtle/15 dark:border-[#1e2430]">
                            <img
                              src={getImageSrc(project.image)}
                              alt={project.name}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/project/project-placeholder.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity pointer-events-none" />
                          </div>
                        )}

                        {/* Top Meta Line */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-mono text-light-subtle dark:text-dark-subtle">
                            <span className="text-[#e6b450] font-semibold">{year}</span>
                            <span>&middot;</span>
                            <span className="text-[10px] uppercase tracking-wider">{primaryCategory}</span>
                          </div>

                          {project.featured && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#e6b450]">
                              <Sparkles size={11} /> Featured
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-lg sm:text-xl text-light-text dark:text-dark-text font-medium group-hover:text-[#e6b450] transition-colors">
                          {project.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm leading-relaxed text-light-text/75 dark:text-[#d9d7d3]/75 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Tech Stack Pills */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {project.technologies.slice(0, 4).map((tech: any) => (
                              <span
                                key={tech.id}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-light-subtle/5 dark:bg-[#0a0e14]/60 text-light-subtle dark:text-dark-subtle border border-light-subtle/10 dark:border-[#1e2430]"
                              >
                                {tech.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Fixed Bottom Action Bar: Consistent, Anchored Position */}
                      <div className="pt-3.5 mt-4 border-t border-light-subtle/10 dark:border-[#1e2430] flex items-center justify-end gap-4 text-xs font-mono">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-light-subtle dark:text-dark-subtle hover:text-[#e6b450] transition-colors"
                            title="Source Code"
                          >
                            <Github size={13} />
                            <span>Source</span>
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#e6b450] font-medium hover:underline"
                          >
                            <span>Visit Site</span>
                            <ArrowUpRight size={13} />
                          </a>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </section>

      {/* Signature Visitor Counter - Fixed Position Stationery Stamp */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
        <VisitorCounter />
      </div>
    </main>
  )
}
