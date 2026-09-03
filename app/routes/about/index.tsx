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

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
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
            01 // Biographical Essay
          </Link>
          <Link
            to="/about/uses"
            className="pb-3 text-sm font-mono tracking-wider uppercase border-b-2 border-transparent text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-[#d9d7d3] transition-colors"
          >
            02 // Equipment &amp; Uses
          </Link>
        </div>

        {/* Essay Header */}
        <header className="space-y-4 pb-10 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <span className="text-xs font-mono uppercase tracking-widest text-[#e6b450]">
            Curriculum // Personal Essay
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
            On Craftsmanship, Systems, and Software
          </h1>
          <p className="font-serif italic text-lg text-light-subtle dark:text-[#d9d7d3]/80">
            A personal account of my journey, technical convictions, and professional timeline.
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
                const endDateStr = exp.is_current ? 'Present' : formatDate(exp.end_date)
                const dateLabel = `${startDateStr} — ${endDateStr}`

                return (
                  <article
                    key={exp.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pt-4 pb-8 border-b border-light-subtle/10 dark:border-[#1e2430] last:border-0"
                  >
                    {/* Margin: Date & Location */}
                    <div className="md:col-span-4 space-y-1 font-mono">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#e6b450]/10 text-[#e6b450] border border-[#e6b450]/30 inline-block">
                        {dateLabel}
                      </span>
                      {exp.location && (
                        <p className="text-xs text-light-subtle dark:text-dark-subtle pt-1">
                          {exp.location}
                        </p>
                      )}
                      <p className="text-xs text-light-subtle dark:text-dark-subtle/80">
                        {exp.company || exp.company_name || ''}
                      </p>
                    </div>

                    {/* Content: Role, Description, Accomplishments */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <h3 className="font-serif text-xl text-light-text dark:text-dark-text font-medium">
                          {exp.title || exp.job_title || ''}
                        </h3>
                        <p className="text-xs font-mono text-light-accent dark:text-[#e6b450]">
                          @{exp.company || exp.company_name || ''}
                        </p>
                      </div>

                      {exp.description && (
                        <p className="text-sm md:text-base leading-relaxed text-light-text/80 dark:text-[#d9d7d3]/80">
                          {exp.description}
                        </p>
                      )}

                      {/* Accomplishments */}
                      {accomplishments.length > 0 && (
                        <ul className="space-y-1.5 pt-2">
                          {accomplishments.map((acc: any) => (
                            <li
                              key={acc.id}
                              className="text-xs md:text-sm text-light-subtle dark:text-[#949dab] flex items-start gap-2"
                            >
                              <span className="text-[#e6b450] mt-1 shrink-0">•</span>
                              <span>{acc.description}</span>
                            </li>
                          ))}
                        </ul>
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

        {/* Technical Skills Index (Ayu Syntax Categorized) */}
        <section className="py-12 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-light-text dark:text-dark-text">
                Skills Taxonomy
              </h2>
              <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-1">
                Classified according to the authentic Ayu syntax color hierarchy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(techsByCategory).map(([categoryName, techs]: [string, any]) => {
              // Ayu syntax color assignment
              let dotColor = 'bg-[#39bae6]'
              let badgeBorder = 'border-[#39bae6]/30 text-[#39bae6]'
              let categoryTag = 'Systems'

              if (categoryName.toLowerCase().includes('front') || categoryName.toLowerCase().includes('web')) {
                dotColor = 'bg-[#aad94c]'
                badgeBorder = 'border-[#aad94c]/30 text-[#aad94c]'
                categoryTag = 'String / Web'
              } else if (categoryName.toLowerCase().includes('data') || categoryName.toLowerCase().includes('back')) {
                dotColor = 'bg-[#f07178]'
                badgeBorder = 'border-[#f07178]/30 text-[#f07178]'
                categoryTag = 'Markup / DB'
              } else if (categoryName.toLowerCase().includes('lang') || categoryName.toLowerCase().includes('core')) {
                dotColor = 'bg-[#e6b450]'
                badgeBorder = 'border-[#e6b450]/30 text-[#e6b450]'
                categoryTag = 'Special / Lang'
              } else if (categoryName.toLowerCase().includes('tool') || categoryName.toLowerCase().includes('devops')) {
                dotColor = 'bg-[#ff8f40]'
                badgeBorder = 'border-[#ff8f40]/30 text-[#ff8f40]'
                categoryTag = 'Keyword / Ops'
              }

              return (
                <div
                  key={categoryName}
                  className="p-5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/50 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-light-subtle/10 dark:border-dark-subtle/10 pb-2">
                    <h3 className="font-serif text-base text-light-text dark:text-dark-text font-medium flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                      {categoryName}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeBorder}`}>
                      {categoryTag}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {techs.map((tech: any) => (
                      <span
                        key={tech.id}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-light-subtle/10 dark:bg-[#0a0e14] text-light-text dark:text-[#d9d7d3] border border-light-subtle/10 dark:border-[#1e2430]"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Education & Academic Foundations */}
        {education && education.length > 0 && (
          <section className="py-12">
            <div className="mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-light-text dark:text-dark-text">
                Academic Foundations
              </h2>
              <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle mt-1">
                Formal education and degrees
              </p>
            </div>

            <div className="space-y-4">
              {education.map((edu: any) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/40 dark:bg-[#131721]/40 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
                >
                  <div>
                    <h3 className="font-serif text-lg text-light-text dark:text-dark-text font-medium">
                      {edu.degree}
                    </h3>
                    <p className="text-xs font-mono text-light-accent dark:text-[#e6b450]">
                      {edu.institution} {edu.location ? `• ${edu.location}` : ''}
                    </p>
                    {edu.description && (
                      <p className="text-xs md:text-sm text-light-subtle dark:text-dark-subtle mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle shrink-0">
                    {formatDate(edu.start_date)} {edu.end_date ? `— ${formatDate(edu.end_date)}` : '— Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
