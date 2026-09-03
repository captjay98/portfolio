import { createFileRoute } from '@tanstack/react-router'
import TechStackSection from '@app/components/home/TechStackSection'
import DynamicProfileContent from '@app/components/home/DynamicProfileContent'
import VisitorCounter from '@app/components/home/visitor-counter'
import { profileService } from '@app/services/profileService'
import { currentTechStackService } from '@app/services/currentTechStackService'
import * as React from 'react'

const fetchData = async () => {
  try {
    const [profile, currentTechStack, socialLinks] = await Promise.all([
      profileService.getProfile(),
      currentTechStackService.getCurrentTechsWithDetails(),
      profileService.getSocialLinks(),
    ])
    return { profile, currentTechStack, socialLinks }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      profile: null,
      currentTechStack: [],
      socialLinks: [],
    }
  }
}

export const Route = createFileRoute('/')({
  loader: () => fetchData(),
  component: Home,
})

function Home() {
  const { profile, currentTechStack, socialLinks } = Route.useLoaderData()

  // Filter for visible social links
  const visibleSocialLinks = socialLinks ? socialLinks.filter((link: any) => link.is_visible) : []

  return (
    <main className="min-h-screen animate-fade-in">
      <section className="min-h-screen w-[99%] m-auto my-2 rounded-2xl md:bg-glass shadow-subtle p-4 flex flex-col md:flex-row justify-center md:items-center md:gap-12 lg:gap-64">
        {/* Profile Section */}
        <div className="text-center max-w-2xl mx-auto md:mx-0 max-sm:mt-12 max-sm:mb-8 animate-fade-in-up">
          <DynamicProfileContent
            profile={profile}
            socialLinks={visibleSocialLinks}
          />
        </div>

        {/* Tech Stack Section - Using the component with 3D animation */}
        {currentTechStack && currentTechStack.length > 0 && (
          <TechStackSection techStacks={currentTechStack} />
        )}
      </section>

      {/* Visitor Counter - Fixed position at bottom right */}
      <div className="fixed bottom-6 right-6 z-20">
        <VisitorCounter />
      </div>
    </main>
  )
}
