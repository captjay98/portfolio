import { createFileRoute } from '@tanstack/react-router'
import ContactPage from '@app/contact/components/ContactPage'
import { profileService } from '@app/services/profileService'
import * as React from 'react'

const fetchContactData = async () => {
  try {
    const [profile, socialLinks] = await Promise.all([
      profileService.getProfile(),
      profileService.getSocialLinks(),
    ])
    return { profile, socialLinks }
  } catch (error) {
    console.error('Error fetching contact data:', error)
    // Return mock data on error
    return {
      profile: {
        full_name: 'Jamal Ibrahim Umar',
        title: 'Software Engineer',
        email: 'captjay98@gmail.com',
      },
      socialLinks: [],
    }
  }
}

export const Route = createFileRoute('/contact/')({
  loader: () => fetchContactData(),
  component: Contact,
})

function Contact() {
  const { profile, socialLinks } = Route.useLoaderData()

  return <ContactPage profile={profile} socialLinks={socialLinks} />
}
