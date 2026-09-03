import { createRootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { HeadContent, Scripts } from '@tanstack/react-router'
import * as React from 'react'
import '@app/globals.css'
import { ThemeProvider } from '@app/components/layout/theme-provider'
import { Navbar } from '@app/components/layout/navbar'
import { NotFound } from '@app/components/NotFound'

export const RootComponent = () => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className="font-sans overflow-hidden bg-light-background dark:bg-dark-background text-light dark:text-dark"
      >
        <ThemeProvider attribute="class">
          <Navbar />
          <div className="mt-20 animate-fade-in">
            <Outlet />
          </div>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        viewport: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Jamal Ibrahim Umar | Software Engineer',
      },
      {
        name: 'description',
        content: 'Portfolio of Jamal Ibrahim Umar, Fullstack Software Engineer',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})
