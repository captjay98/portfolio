import { createFileRoute, Link } from '@tanstack/react-router'
import { MarkdownRenderer } from '@app/components/markdown-renderer'
import { ExperienceItem } from '@app/about/components/ExperienceItem'
import { EducationItem } from '@app/about/components/EducationItem'
import TechnologyCard from '@app/components/TechnologyCard'
import { getCategoryBgColor, getCategoryDotColor } from '@app/utils/categoryColors'
import { Mail } from 'lucide-react'
import * as React from 'react'

import { profileService } from '@app/services/profileService'
import { technologyService } from '@app/services/technologyService'
import { experienceService } from '@app/services/experienceService'
import { categoryService } from '@app/services/categoryService'
import { educationService } from '@app/services/educationService'
import { experienceAccomplishmentService } from '@app/services/experienceAccomplishmentService'

const fetchAboutData = async () => {
  console.log('[About Loader] Fetching about data...')
  try {
    const [profile, technologies, experiences, categories, education, experienceAccomplishments] = await Promise.all([
      profileService.getProfile(),
      technologyService.getTechnologies(),
      experienceService.getExperiences(),
      categoryService.getCategories(),
      educationService.getEducation(),
      experienceAccomplishmentService.getExperienceAccomplishments(),
    ])

    console.log('[About Loader] Data fetched:', { profile: !!profile, technologies: technologies.length, experiences: experiences.length })

    // Create a map of experience IDs to their accomplishments
    const experienceAccomplishmentsMap: Record<string, any[]> = {}
    experienceAccomplishments.forEach((acc: any) => {
      if (!experienceAccomplishmentsMap[acc.experience_id]) {
        experienceAccomplishmentsMap[acc.experience_id] = []
      }
      experienceAccomplishmentsMap[acc.experience_id].push(acc)
    })

    return {
      profile,
      technologies,
      experiences,
      categories,
      education,
      experienceAccomplishmentsMap,
    }
  } catch (error) {
    console.error('Error fetching about data:', error)
    return {
      profile: null,
      technologies: [],
      experiences: [],
      categories: [],
      education: [],
      experienceAccomplishmentsMap: {},
    }
  }
}

export const Route = createFileRoute('/about/')({
  loader: async () => {
    return fetchAboutData()
  },
  component: About,
})

function About() {
  const {
    profile,
    technologies,
    experiences,
    categories,
    education,
    experienceAccomplishmentsMap,
  } = Route.useLoaderData()

  const techMap: Record<string, string> = {}
  if (technologies) {
    technologies.forEach((tech: any) => {
      techMap[tech.id] = tech.name
    })
  }

  const catMap: Record<string, string> = {}
  if (categories) {
    categories.forEach((cat: any) => {
      catMap[cat.id] = cat.name
    })
  }

  // Categorize technologies with Ayu syntax classifications
  const techsByCategory = technologies ? technologies.reduce<Record<string, any[]>>((acc: any, tech: any) => {
    const categoryName = catMap[tech.category_id] || tech.category_id || 'Other'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(tech)
    return acc
  }, {}) : {}

  // Config for the 6 core pillars of the tech stack
  const categoryConfig: Record<string, {
    title: string
    description: string
    color: string
    order: number
  }> = {
    'Frontend Development': {
      title: 'Frontend Architecture',
      description: 'Web interfaces, reactive state machines, and styling engines',
      color: '#aad94c',
      order: 1,
    },
    'Backend Development': {
      title: 'Backend & Distributed Systems',
      description: 'Event-driven runtimes, REST/RPC APIs, and serverless edge functions',
      color: '#e6b450',
      order: 2,
    },
    'Autonomous Agents': {
      title: 'AI & Autonomous Agents',
      description: 'LLM orchestration, tool calling, and multi-agent reasoning loops',
      color: '#d2a6ff',
      order: 3,
    },
    'Database': {
      title: 'Databases & In-Memory Cache',
      description: 'Relational storage, ACID guarantees, and distributed key-value caching',
      color: '#f07178',
      order: 4,
    },
    'DevOps': {
      title: 'Cloud Infrastructure & DevOps',
      description: 'Container runtimes, self-hosted orchestration, and edge deployments',
      color: '#ff8f40',
      order: 5,
    },
    'Mobile Development': {
      title: 'Mobile Engineering',
      description: 'Cross-platform native applications and production mobile toolchains',
      color: '#39bae6',
      order: 6,
    },
  }

  const sortedCategories = Object.entries(techsByCategory).sort(([catA], [catB]) => {
    const orderA = categoryConfig[catA]?.order ?? 99
    const orderB = categoryConfig[catB]?.order ?? 99
    return orderA - orderB
  })

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const trimmed = dateString.trim()
    if (/^\d{4}$/.test(trimmed)) {
      return trimmed
    }
    const date = new Date(trimmed)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    }
    return dateString
  }

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Editorial Sub-Navigation Tabs */}
        <div className="flex items-center space-x-8 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-12">
          <Link
            to="/about"
            className="pb-3 text-sm font-mono tracking-wider uppercase border-b-2 border-light-accent dark:border-[#e6b450] text-light-accent dark:text-[#e6b450] font-semibold"
          >
            01 / Background
          </Link>
          <Link
            to="/about/uses"
            className="pb-3 text-sm font-mono tracking-wider uppercase border-b-2 border-transparent text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-[#d9d7d3] transition-colors"
          >
            02 / Uses
          </Link>
        </div>

        {/* Profile Header */}
        <header className="space-y-4 pb-10 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
            Systems, Software, and Craftsmanship
          </h1>
          <p className="font-serif italic text-lg text-light-subtle dark:text-[#d9d7d3]/80">
            A chronicle of my background, technical foundation, and professional milestones.
          </p>
        </header>

        {/* Long-Form Essay Bio */}
        <section className="py-12 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <div className="prose prose-neutral dark:prose-invert lg:prose-lg max-w-none font-serif leading-relaxed text-light-text/90 dark:text-[#d9d7d3]/90">
            {profile?.bio_long ? (
              <MarkdownRenderer content={profile.bio_long} />
            ) : (
              <p>
                I am a software engineer focused on building clean, high-performance distributed systems and web applications. My work centers on modern runtime architectures, typed API design, and intuitive user experiences.
              </p>
            )}
          </div>
        </section>

        {/* Chronological Margin Timeline */}
        <section className="py-12 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <div className="mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-light-text dark:text-dark-text">
              Chronological Timeline
            </h2>
            <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-1">
              Professional roles, systems engineered, and key milestones
            </p>
          </div>

          <div className="space-y-10">
            {experiences && experiences.length > 0 ? (
              experiences.map((exp: any) => {
                const accomplishments = experienceAccomplishmentsMap[exp.id] || []
                const startDateStr = formatDate(exp.start_date)
                const endDateStr = (!exp.end_date || exp.end_date === '' || exp.is_current) ? 'Present' : formatDate(exp.end_date)
                const dateLabel = `${startDateStr} · ${endDateStr}`

                const techIds = Array.isArray(exp.technology_ids)
                  ? exp.technology_ids
                  : typeof exp.technology_ids === 'string'
                    ? JSON.parse(exp.technology_ids || '[]')
                    : []
                const expTechs = techIds.map((id: string) => techMap[id]).filter(Boolean)

                return (
                  <article
                    key={exp.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pt-6 pb-8 border-b border-light-subtle/10 dark:border-[#1e2430] last:border-0"
                  >
                    {/* Margin: Date & Location */}
                    <div className="md:col-span-4 space-y-1.5 font-mono">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#e6b450]/10 text-[#e6b450] border border-[#e6b450]/30 inline-block">
                        {dateLabel}
                      </span>
                      {exp.location && (
                        <p className="text-xs text-light-subtle dark:text-dark-subtle pt-0.5">
                          {exp.location}
                        </p>
                      )}
                    </div>

                    {/* Content: Role, Company, Description, Accomplishments, Tech */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl text-light-text dark:text-dark-text font-medium">
                          {exp.title || exp.job_title || ''}
                        </h3>
                        <p className="text-sm font-mono text-light-accent dark:text-[#e6b450] font-medium mt-0.5">
                          {exp.company || exp.company_name || ''}
                        </p>
                      </div>

                      {exp.description && (
                        <p className="text-sm md:text-base leading-relaxed text-light-text/80 dark:text-[#d9d7d3]/80">
                          {exp.description}
                        </p>
                      )}

                      {/* Accomplishments */}
                      {accomplishments.length > 0 && (
                        <ul className="space-y-2 pt-1">
                          {accomplishments.map((acc: any) => {
                            const text = acc.text || acc.description
                            if (!text) return null
                            return (
                              <li
                                key={acc.id}
                                className="text-xs sm:text-sm text-light-subtle dark:text-[#949dab] flex items-start gap-2.5 leading-relaxed"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#e6b450] mt-1.5 shrink-0" />
                                <span>{text}</span>
                              </li>
                            )
                          })}
                        </ul>
                      )}

                      {/* Associated Technologies */}
                      {expTechs.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          {expTechs.map((name: string, i: number) => (
                            <span
                              key={i}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-light-subtle/5 dark:bg-[#0a0e14]/60 text-light-subtle dark:text-dark-subtle border border-light-subtle/10 dark:border-[#1e2430]"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                )
              })
            ) : (
              <p className="text-sm text-light-subtle dark:text-dark-subtle font-mono">
                No experience timeline records found.
              </p>
            )}
          </div>
        </section>

        {/* Technical Skills Index: Horizontal Architectural Ledger */}
        <section className="py-12 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-light-text dark:text-dark-text">
                Skills Taxonomy
              </h2>
              <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-1">
                Core technologies, platforms, and engineering primitives across production systems
              </p>
            </div>
            <span className="text-[11px] font-mono text-light-subtle/80 dark:text-dark-subtle/80 px-2.5 py-1 rounded-full border border-light-subtle/20 dark:border-[#1e2430] bg-light-subtle/5 dark:bg-[#0a0e14] self-start sm:self-auto shrink-0">
              {technologies?.length || 28} Technologies · {sortedCategories.length} Domains
            </span>
          </div>

          <div className="space-y-4">
            {sortedCategories.map(([categoryName, techs]: [string, any]) => {
              const meta = categoryConfig[categoryName] || {
                title: categoryName,
                description: 'Core technologies and tooling',
                color: '#39bae6',
                order: 99,
              }

              return (
                <div
                  key={categoryName}
                  className="group relative rounded-xl border border-light-subtle/20 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 p-5 md:p-6 transition-all duration-300 hover:border-light-subtle/40 dark:hover:border-dark-subtle/30 shadow-xs hover:shadow-md overflow-hidden"
                >
                  {/* Left vertical accent line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: meta.color }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pl-2">
                    {/* Left Column: Domain Specs */}
                    <div className="lg:col-span-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full inline-block shrink-0 shadow-xs"
                          style={{ backgroundColor: meta.color }}
                        />
                        <h3 className="font-serif text-lg text-light-text dark:text-[#ffffff] font-medium leading-snug">
                          {meta.title}
                        </h3>
                      </div>
                      <p className="text-xs text-light-subtle dark:text-[#d9d7d3]/80 leading-relaxed">
                        {meta.description}
                      </p>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded border inline-block"
                        style={{
                          borderColor: `${meta.color}40`,
                          color: meta.color,
                          backgroundColor: `${meta.color}10`,
                        }}
                      >
                        {techs.length} {techs.length === 1 ? 'technology' : 'technologies'}
                      </span>
                    </div>

                    {/* Right Column: Technology Chips */}
                    <div className="lg:col-span-8 flex flex-wrap gap-2 pt-1 lg:pt-0">
                      {techs.map((tech: any) => {
                        const isLink = Boolean(tech.website)
                        const Tag = isLink ? 'a' : 'div'
                        const linkProps = isLink
                          ? {
                              href: tech.website,
                              target: '_blank',
                              rel: 'noopener noreferrer',
                              title: `Explore ${tech.name}`,
                            }
                          : {}

                        return (
                          <Tag
                            key={tech.id}
                            {...linkProps}
                            className={`group/item inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-light-subtle/15 dark:border-[#1e2430] bg-light-surface/90 dark:bg-[#0a0e14]/90 text-light-text dark:text-[#d9d7d3] transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 ${
                              isLink
                                ? 'hover:border-light-subtle/50 dark:hover:border-dark-subtle/40 hover:text-light-text dark:hover:text-dark-text cursor-pointer'
                                : ''
                            }`}
                          >
                            {tech.icon ? (
                              <img
                                src={tech.icon}
                                alt=""
                                aria-hidden="true"
                                className="w-3.5 h-3.5 object-contain shrink-0 rounded-xs transition-transform group-hover/item:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                  ;(e.currentTarget as HTMLElement).style.display = 'none'
                                }}
                              />
                            ) : (
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: meta.color }}
                              />
                            )}
                            <span className="text-xs font-mono font-medium tracking-tight">
                              {tech.name}
                            </span>
                            {isLink && (
                              <span className="text-[10px] opacity-0 -ml-0.5 group-hover/item:opacity-70 transition-opacity font-mono text-light-subtle dark:text-dark-subtle">
                                ↗
                              </span>
                            )}
                          </Tag>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Education & Academic Foundations */}
        {education && education.length > 0 && (
          <section className="py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl text-light-text dark:text-dark-text">
                  Academic Foundations
                </h2>
                <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-1">
                  Computer science curriculum, engineering fellowships, and foundational theory
                </p>
              </div>
              <span className="text-[11px] font-mono text-light-subtle/80 dark:text-dark-subtle/80 px-2.5 py-1 rounded-full border border-light-subtle/20 dark:border-[#1e2430] bg-light-subtle/5 dark:bg-[#0a0e14] self-start sm:self-auto">
                {education.length} Programs
              </span>
            </div>

            <div className="space-y-6">
              {education.map((edu: any) => {
                const isAlx =
                  edu.institution?.toLowerCase().includes('alx') ||
                  edu.degree?.toLowerCase().includes('alx')
                const accentColor = isAlx ? '#e6b450' : '#39bae6' // Ayu Amber for ALX, Ayu Cyan for University

                const startLabel = formatDate(edu.start_date)
                const endLabel = edu.end_date ? formatDate(edu.end_date) : 'Present'
                const dateRange =
                  startLabel && endLabel ? `${startLabel} · ${endLabel}` : startLabel || endLabel

                // Key technical curriculum highlights
                const focusAreas = isAlx
                  ? [
                      'C Systems Programming',
                      'Unix & Linux Internals',
                      'Data Structures & Algorithms',
                      'Full-Stack Architecture',
                    ]
                  : [
                      'Computer Architecture',
                      'Operating Systems',
                      'Relational Databases',
                      'Software Engineering',
                    ]

                return (
                  <div
                    key={edu.id}
                    className="group relative rounded-xl border border-light-subtle/20 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/60 p-6 md:p-7 transition-all duration-300 hover:border-light-subtle/40 dark:hover:border-dark-subtle/30 shadow-xs hover:shadow-md overflow-hidden"
                  >
                    {/* Subtle top color accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-75 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: accentColor }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Left Column: Track, Date, Institution, Location */}
                      <div className="md:col-span-4 space-y-2.5 font-mono">
                        <span
                          className="text-[10px] tracking-wider uppercase font-semibold block"
                          style={{ color: accentColor }}
                        >
                          {isAlx ? 'Engineering Fellowship' : 'Undergraduate Degree'}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-md border border-light-subtle/15 dark:border-[#1e2430] bg-light-subtle/5 dark:bg-[#0a0e14] text-light-subtle dark:text-dark-subtle inline-block">
                          {dateRange}
                        </span>
                        <div className="text-xs pt-0.5">
                          <p className="font-medium text-light-text dark:text-[#ffffff]">
                            {edu.institution}
                          </p>
                          {edu.location && (
                            <p className="text-light-subtle dark:text-dark-subtle mt-0.5">
                              {edu.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Degree Title, Narrative, Curriculum Pills */}
                      <div className="md:col-span-8 space-y-3.5">
                        <h3 className="font-serif text-xl sm:text-2xl text-light-text dark:text-[#ffffff] font-medium leading-snug">
                          {edu.degree}
                        </h3>

                        {edu.description && (
                          <p className="text-xs sm:text-sm text-light-subtle dark:text-[#d9d7d3]/85 leading-relaxed">
                            {edu.description}
                          </p>
                        )}

                        {/* Curriculum / Focus Areas */}
                        <div className="pt-2">
                          <div className="flex flex-wrap gap-2">
                            {focusAreas.map((topic, i) => (
                              <span
                                key={i}
                                className="text-xs font-mono px-2.5 py-1 rounded bg-light-subtle/10 dark:bg-[#0a0e14] text-light-text/90 dark:text-[#d9d7d3]/90 border border-light-subtle/10 dark:border-[#1e2430]"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
