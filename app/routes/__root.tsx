import { createRootRoute, Outlet, HeadContent, Scripts, useRouterState } from '@tanstack/react-router'
import * as React from 'react'
import '@app/globals.css'
import { ThemeProvider } from '@app/components/layout/theme-provider'
import { Navbar } from '@app/components/layout/navbar'
import { NotFound } from '@app/components/NotFound'

export const RootComponent = () => {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text font-sans antialiased selection:bg-[#e6b450]/25 selection:text-foreground overflow-x-hidden"
      >
        <ThemeProvider attribute="class">
          {isAdmin ? (
            <Outlet />
          ) : (
            <>
              <Navbar />
              <div className="mt-16 sm:mt-20 animate-fade-in flex-1">
                <Outlet />
              </div>
              {/* Footer */}
              <footer className="mt-16 sm:mt-24 border-t border-light-subtle/10 dark:border-dark-subtle/10 py-8 sm:py-12 px-4 sm:px-6 text-sm text-light-subtle dark:text-dark-subtle">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-0.5">
                    <p className="font-serif italic text-base text-light-text dark:text-dark-text">
                      Jamal Ibrahim
                    </p>
                    <p className="text-xs font-mono text-light-subtle/80 dark:text-dark-subtle/80">
                      Software Engineer &amp; Builder
                    </p>
                  </div>
                  <div className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                    <span>© {new Date().getFullYear()} Jamal Ibrahim. All rights reserved.</span>
                  </div>
                </div>
              </footer>
            </>
          )}
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
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Jamal Ibrahim · Software Engineer',
      },
      {
        name: 'description',
        content: 'Editorial portfolio and writings of Jamal Ibrahim Umar, Fullstack Software Engineer',
      },
      {
        name: 'color-scheme',
        content: 'dark light',
      },
      {
        name: 'theme-color',
        content: '#0a0e14',
      },
      // Open Graph / social sharing
      {
        property: 'og:site_name',
        content: 'Jamal Ibrahim',
      },
      {
        property: 'og:title',
        content: 'Jamal Ibrahim · Software Engineer',
      },
      {
        property: 'og:description',
        content: 'Editorial portfolio and writings of Jamal Ibrahim Umar, Fullstack Software Engineer',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://jamalibrahim.dev',
      },
      {
        property: 'og:image',
        content: 'https://jamalibrahim.dev/og-card.png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Jamal Ibrahim · Software Engineer',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Jamal Ibrahim · Software Engineer',
      },
      {
        name: 'twitter:description',
        content: 'Editorial portfolio and writings of Jamal Ibrahim Umar, Fullstack Software Engineer',
      },
      {
        name: 'twitter:image',
        content: 'https://jamalibrahim.dev/og-card.png',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'canonical',
        href: 'https://jamalibrahim.dev',
      },
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
        href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Montserrat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})
