import { Link } from '@tanstack/react-router'
import * as React from 'react'

interface UsesItem {
  id: string
  name: string
  description: string
  link?: string
  image?: string
  is_favorite: boolean
}

interface UsesPageProps {
  uses: Record<string, UsesItem[]>
  categories: Array<{ id: string; name: string }>
}

// Helper functions to distribute colors across categories
function getCategoryHeaderColor(category: string, index: number): string {
  const colors = [
    'text-[var(--color-light-syntax-entity)] dark:text-[var(--color-dark-syntax-entity)]',
    'text-[var(--color-light-syntax-tag)] dark:text-[var(--color-dark-syntax-tag)]',
    'text-[var(--color-light-syntax-func)] dark:text-[var(--color-dark-syntax-func)]',
    'text-[var(--color-light-syntax-string)] dark:text-[var(--color-dark-syntax-string)]',
    'text-[var(--color-light-syntax-regexp)] dark:text-[var(--color-dark-syntax-regexp)]',
    'text-[var(--color-light-syntax-markup)] dark:text-[var(--color-dark-syntax-markup)]',
    'text-[var(--color-light-syntax-keyword)] dark:text-[var(--color-dark-syntax-keyword)]',
    'text-[var(--color-light-syntax-special)] dark:text-[var(--color-dark-syntax-special)]',
  ]
  return colors[index % colors.length]
}

function getCategoryGradient(category: string, index: number): string {
  const gradients = [
    'from-[var(--color-light-syntax-entity)]/20 to-transparent dark:from-[var(--color-dark-syntax-entity)]/20 dark:to-transparent',
    'from-[var(--color-light-syntax-tag)]/20 to-transparent dark:from-[var(--color-dark-syntax-tag)]/20 dark:to-transparent',
    'from-[var(--color-light-syntax-func)]/20 to-transparent dark:from-[var(--color-dark-syntax-func)]/20 dark:to-transparent',
    'from-[var(--color-light-syntax-string)]/20 to-transparent dark:from-[var(--color-dark-syntax-string)]/20 dark:to-transparent',
    'from-[var(--color-light-syntax-regexp)]/20 to-transparent dark:from-[var(--color-dark-syntax-regexp)]/20 dark:to-transparent',
    'from-[var(--color-light-syntax-markup)]/20 to-transparent dark:from-[var(--color-dark-syntax-markup)]/20 dark:to-transparent',
    'from-[var(--color-light-syntax-keyword)]/20 to-transparent dark:from-[var(--color-dark-syntax-keyword)]/20 dark:to-transparent',
    'from-[var(--color-light-syntax-special)]/20 to-transparent dark:from-[var(--color-dark-syntax-special)]/20 dark:to-transparent',
  ]
  return gradients[index % gradients.length]
}

function getCategoryItemColor(category: string, index: number): string {
  const colors = ['entity', 'tag', 'func', 'string', 'regexp', 'markup', 'keyword', 'special']
  return colors[index % colors.length]
}

export default function UsesPage({ uses, categories }: UsesPageProps) {
  // Create a mapping of category IDs to names
  const categoryMap: Record<string, string> = {}
  categories.forEach((category) => {
    categoryMap[category.id] = category.name
  })

  // Map category IDs to names in usesItems
  const mappedUsesItems: Record<string, UsesItem[]> = {}
  Object.entries(uses).forEach(([categoryId, items]) => {
    const categoryName = categoryMap[categoryId] || categoryId
    mappedUsesItems[categoryName] = items
  })

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Editorial Sub-Navigation Tabs */}
        <div className="flex items-center space-x-8 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-12">
          <Link
            to="/about"
            className="pb-3 text-sm font-mono tracking-wider uppercase border-b-2 border-transparent text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-[#d9d7d3] transition-colors"
          >
            01 // Biographical Essay
          </Link>
          <Link
            to="/about/uses"
            className="pb-3 text-sm font-mono tracking-wider uppercase border-b-2 border-light-accent dark:border-[#e6b450] text-light-accent dark:text-[#e6b450] font-semibold"
          >
            02 // Equipment &amp; Uses
          </Link>
        </div>

        {/* Header Section */}
        <header className="space-y-4 pb-10 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#e6b450]">
            Catalog // Equipment &amp; Instruments
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
            The Workstation &amp; Development Toolchain
          </h1>
          <p className="font-serif italic text-lg text-light-subtle dark:text-[#d9d7d3]/80">
            An annotated inventory of the hardware, software environments, and daily instruments I rely on to craft software.
          </p>
        </header>

        {Object.keys(mappedUsesItems).length === 0 ? (
          <div className="text-center py-16 font-mono text-sm text-light-subtle dark:text-dark-subtle">
            No equipment records cataloged at present.
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(mappedUsesItems).map(([category, items], categoryIndex) => (
              <section key={category} className="space-y-6">
                <div className="flex items-center justify-between border-b border-light-subtle/15 dark:border-dark-subtle/15 pb-3">
                  <h2 className={`font-serif text-xl sm:text-2xl font-medium ${getCategoryHeaderColor(category, categoryIndex)}`}>
                    {category}
                  </h2>
                  <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className={`p-5 rounded-xl border bg-light-background/50 dark:bg-[#131721]/60 transition-all duration-200 flex flex-col justify-between space-y-3 ${
                        item.is_favorite
                          ? 'border-[#e6b450]/40 shadow-sm'
                          : 'border-light-subtle/15 dark:border-[#1e2430] hover:border-[#e6b450]/30'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-lg font-medium text-light-text dark:text-dark-text leading-snug">
                            {item.name}
                          </h3>
                          {item.is_favorite && (
                            <span className="shrink-0 text-xs font-mono px-2 py-0.5 rounded bg-[#e6b450]/15 text-[#e6b450] border border-[#e6b450]/30 flex items-center gap-1">
                              ★ Preferred
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm leading-relaxed text-light-subtle dark:text-[#949dab]">
                          {item.description}
                        </p>
                      </div>

                      {item.link && (
                        <div className="pt-2 border-t border-light-subtle/10 dark:border-dark-subtle/10 flex justify-end">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-light-accent dark:text-[#e6b450] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Specification</span>
                            <span>→</span>
                          </a>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
