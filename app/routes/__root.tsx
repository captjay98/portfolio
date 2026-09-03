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
        className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text font-sans antialiased selection:bg-[#e6b450]/25 selection:text-foreground"
      >
        <ThemeProvider attribute="class">
          <Navbar />
          <div className="mt-20 animate-fade-in flex-1">
            <Outlet />
          </div>
          {/* Editorial Colophon Footer */}
          <footer className="mt-24 border-t border-light-subtle/10 dark:border-dark-subtle/10 py-12 px-6 text-sm text-light-subtle dark:text-dark-subtle">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <p className="font-serif italic text-base text-light-text dark:text-dark-text">
                  Jamal Ibrahim / Journal
                </p>
                <p className="text-xs font-mono text-light-subtle/80 dark:text-dark-subtle/80">
                  Edition 2026 • Published from Copenhagen &amp; London
                </p>
              </div>
              <div className="text-xs font-mono flex flex-wrap items-center gap-4 text-light-subtle dark:text-dark-subtle">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#aad94c] inline-block animate-pulse"></span>
                  Cloudflare D1 &amp; Workers SSR
                </span>
                <span>•</span>
                <span className="text-light-accent dark:text-[#e6b450]">Ayu Palette</span>
                <span>•</span>
                <span>© {new Date().getFullYear()} Jamal Ibrahim Umar</span>
              </div>
            </div>
          </footer>
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
        title: 'Jamal Ibrahim / Journal — Software Engineer',
      },
      {
        name: 'description',
        content: 'Editorial portfolio and writings of Jamal Ibrahim Umar, Fullstack Software Engineer',
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
        href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Montserrat:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})
