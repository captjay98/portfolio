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

  const techsByCategory = technologies ? technologies.reduce<Record<string, any[]>>((acc: any, tech: any) => {
    const categoryName = catMap[tech.category_id] || tech.category_id
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
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16 ">
      <div className="w-full px-4 py-6 md:py-6 mt-10 ">
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-light-border dark:border-dark-border mb-6">
            <div className="flex space-x-8">
              <Link
                to="/about"
                className="py-3 font-medium text-sm border-b-2 border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent"
              >
                About Me
              </Link>
              <Link
                to="/about/uses"
                className="py-3 font-medium text-sm border-b-2 border-transparent text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text"
              >
                Uses
              </Link>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5 overflow-auto md:overflow-hidden">
            <div className="md:col-span-7 space-y-3">
              <div className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in">
                <MarkdownRenderer content={profile?.bio_long || ''} />
              </div>

              <div
                className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-medium text-light-accent dark:text-dark-accent">
                    Technical Skills
                  </h2>
                  <span className="px-2 py-1 text-xs bg-accent-gradient text-white rounded-full font-medium shadow-accent">
                    {profile?.title}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(techsByCategory).map(([categoryName, categoryTechs]: [string, any], index) => (
                    <div
                      key={categoryName}
                      className="space-y-2 animate-slide-in-right bg-glass rounded-lg overflow-hidden shadow-subtle hover:shadow-accent transition-shadow duration-300"
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      <div className={`px-3 py-2 ${getCategoryBgColor(categoryName)}`}>
                        <h3 className="text-sm font-bold text-white">{categoryName}</h3>
                      </div>

                      <div className="p-3">
                        <div className="flex flex-wrap gap-2 mt-1">
                          {categoryTechs.map((tech: any) => (
                            <TechnologyCard
                              key={tech.id}
                              name={tech.name}
                              showIndicator={true}
                              size="md"
                              categoryColor={getCategoryDotColor(categoryName)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <div className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in">
                <div className="flex items-center space-x-4">
                  {profile?.avatar ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-accent">
                      <img
                        src={profile.avatar}
                        alt={profile.full_name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-accent-gradient flex items-center justify-center text-white text-xl font-bold shadow-accent">
                      {profile?.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                      {profile?.full_name}
                    </h2>
                    <p className="text-light-accent dark:text-dark-accent text-sm font-medium">
                      {profile?.title}
                    </p>
                    {profile?.location && (
                      <p className="text-light-subtle dark:text-dark-subtle text-xs mt-1">
                        {profile.location}
                      </p>
                    )}
                    <a
                      href="mailto:captjay98@gmail.com"
                      className="mt-2 inline-flex items-center text-xs text-light-accent dark:text-dark-accent hover:underline"
                    >
                      <Mail size={12} className="mr-1" />
                      Contact Me
                    </a>
                  </div>
                </div>
                <p className="mt-3 text-sm text-light-text dark:text-dark-text">
                  {profile?.bio_short}
                </p>
              </div>

              <div
                className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <h2 className="text-lg font-medium text-light-accent dark:text-dark-accent mb-3">
                  Experience
                </h2>

                <div className="space-y-5">
                  {experiences && experiences.length > 0 ? (
                    experiences.map((experience: any) => (
                      <ExperienceItem
                        key={experience.id}
                        experience={experience}
                        accomplishments={experienceAccomplishmentsMap[experience.id] || []}
                        techMap={techMap}
                        catMap={catMap}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No experience information available.
                    </p>
                  )}
                </div>
              </div>

              <div
                className="bg-glass shadow-subtle effect-3d rounded-lg p-4 animate-fade-in-up"
                style={{ animationDelay: '0.3s' }}
              >
                <h2 className="text-lg font-medium text-light-accent dark:text-dark-accent mb-2">
                  Education
                </h2>

                <div className="space-y-3">
                  {education && education.length > 0 ? (
                    education.map((edu: any) => (
                      <EducationItem
                        key={edu.id}
                        degree={edu.degree}
                        institution={edu.institution}
                        period={`${formatDate(edu.start_date)}${edu.end_date ? ` - ${formatDate(edu.end_date)}` : ''}`}
                        location={edu.location}
                        description={edu.description}
                        isCurrent={edu.is_current}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No education information available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
