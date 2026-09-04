import { Link } from '@tanstack/react-router'
import * as React from 'react'

interface UsesItem {
  id: string
  name: string
  description: string
  link?: string
  image?: string
  is_favorite: boolean
  priority?: number
}

interface UsesPageProps {
  uses: Record<string, UsesItem[]>
  categories: Array<{ id: string; name: string }>
}

interface SectionMeta {
  title: string
  subtitle: string
  color: string
  order: number
}

const sectionConfig: Record<string, SectionMeta> = {
  'Workstation & System': {
    title: 'Workstation & System',
    subtitle: 'Primary hardware machine and daily operating environment',
    color: '#39bae6', // Ayu Cyan
    order: 1,
  },
  'Development Tools': {
    title: 'Development Tools',
    subtitle: 'Code editors, local API clients, and database tooling',
    color: '#e6b450', // Ayu Amber
    order: 2,
  },
  'Productivity & Writing': {
    title: 'Productivity & Writing',
    subtitle: 'Note-taking, project organization, and technical writing',
    color: '#d2a6ff', // Ayu Lilac
    order: 3,
  },
}

const itemIcons: Record<string, string> = {
  '14" macbook pro m4 pro':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
  macos:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
  astronvim:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neovim/neovim-original.svg',
  'vs code':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  bruno: 'https://www.usebruno.com/favicon.ico',
  'beekeeper studio': 'https://www.beekeeperstudio.io/favicon.ico',
  mdsilo: 'https://mdsilo.com/favicon.ico',
  clickup: 'https://clickup.com/favicon.ico',
}

export default function UsesPage({ uses, categories }: UsesPageProps) {
  // Create mapping of category IDs to names
  const categoryMap: Record<string, string> = {}
  categories.forEach((category) => {
    categoryMap[category.id] = category.name
  })

  // Map and group items cleanly into 3 cohesive sections
  const groupedSections: Record<string, UsesItem[]> = {
    'Workstation & System': [],
    'Development Tools': [],
    'Productivity & Writing': [],
  }

  Object.entries(uses).forEach(([categoryId, items]) => {
    const rawCategoryName = (categoryMap[categoryId] || categoryId).toLowerCase()

    items.forEach((item) => {
      const itemName = item.name.toLowerCase()

      if (
        itemName.includes('macbook') ||
        itemName.includes('macos') ||
        rawCategoryName.includes('hardware') ||
        rawCategoryName.includes('software') ||
        rawCategoryName.includes('workstation')
      ) {
        groupedSections['Workstation & System'].push(item)
      } else if (
        rawCategoryName.includes('development') ||
        rawCategoryName.includes('tools') ||
        itemName.includes('nvim') ||
        itemName.includes('vscode') ||
        itemName.includes('code') ||
        itemName.includes('bruno') ||
        itemName.includes('beekeeper')
      ) {
        groupedSections['Development Tools'].push(item)
      } else {
        groupedSections['Productivity & Writing'].push(item)
      }
    })
  })

  // Sort items within each section: favorites first, then by priority/name
  Object.values(groupedSections).forEach((items) => {
    items.sort((a, b) => {
      if (a.is_favorite && !b.is_favorite) return -1
      if (!a.is_favorite && b.is_favorite) return 1
      return (a.priority || 0) - (b.priority || 0)
    })
  })

  const totalItemsCount = Object.values(groupedSections).reduce(
    (total, items) => total + items.length,
    0
  )

  const activeSections = Object.entries(groupedSections).filter(
    ([, items]) => items.length > 0
  )

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* Sub-Navigation Tabs */}
        <div className="flex items-center space-x-6 sm:space-x-8 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-8 sm:mb-10">
          <Link
            to="/about"
            className="pb-3 text-xs sm:text-sm font-mono tracking-wider uppercase border-b-2 border-transparent text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-[#d9d7d3] transition-colors"
          >
            01 / Background
          </Link>
          <Link
            to="/about/uses"
            className="pb-3 text-xs sm:text-sm font-mono tracking-wider uppercase border-b-2 border-light-accent dark:border-[#e6b450] text-light-accent dark:text-[#e6b450] font-semibold"
          >
            02 / Uses
          </Link>
        </div>

        {/* Page Header */}
        <header className="space-y-3 sm:space-y-4 pb-8 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl text-light-text dark:text-[#ffffff] tracking-tight">
                Uses
              </h1>
              <p className="text-xs sm:text-sm font-mono text-light-subtle dark:text-dark-subtle mt-1.5">
                A candid list of the hardware, tools, and software I use daily.
              </p>
            </div>
            <span className="text-[11px] font-mono text-light-subtle/80 dark:text-dark-subtle/80 px-3 py-1 rounded-full border border-light-subtle/20 dark:border-[#1e2430] bg-light-subtle/5 dark:bg-[#0a0e14] self-start sm:self-auto shrink-0">
              {totalItemsCount} Instruments · {activeSections.length} Sections
            </span>
          </div>
        </header>

        {activeSections.length === 0 ? (
          <div className="text-center py-16 font-mono text-sm text-light-subtle dark:text-dark-subtle">
            No equipment records found.
          </div>
        ) : (
          <div className="space-y-12">
            {activeSections.map(([sectionName, items]) => {
              const meta = sectionConfig[sectionName] || {
                title: sectionName,
                subtitle: 'Daily tools',
                color: '#e6b450',
                order: 99,
              }

              return (
                <section key={sectionName} className="space-y-4">
                  {/* Section Title */}
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-light-subtle/15 dark:border-dark-subtle/15">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full inline-block shrink-0 shadow-xs"
                        style={{ backgroundColor: meta.color }}
                      />
                      <h2 className="font-serif text-lg sm:text-xl font-medium text-light-text dark:text-[#ffffff]">
                        {meta.title}
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-light-subtle dark:text-dark-subtle">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Editorial Ledger Rows */}
                  <div className="divide-y divide-light-subtle/15 dark:divide-[#1e2430]">
                    {items.map((item) => {
                      const itemKey = item.name.toLowerCase().trim()
                      const icon = itemIcons[itemKey]
                      const isLink = Boolean(item.link)
                      const Tag = isLink ? 'a' : 'div'
                      const linkProps = isLink
                        ? {
                            href: item.link,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          }
                        : {}

                      return (
                        <div
                          key={item.id}
                          className="group py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 px-3 -mx-3 rounded-lg transition-colors"
                        >
                          {/* Left: Tool Name & Icon */}
                          <div className="sm:w-2/5 shrink-0 flex items-center gap-2.5">
                            {icon && (
                              <img
                                src={icon}
                                alt=""
                                aria-hidden="true"
                                className="w-4 h-4 object-contain shrink-0 rounded-xs"
                                loading="lazy"
                                onError={(e) => {
                                  ;(e.currentTarget as HTMLElement).style.display =
                                    'none'
                                }}
                              />
                            )}
                            <Tag
                              {...linkProps}
                              className={`font-serif text-base font-medium text-light-text dark:text-[#ffffff] inline-flex items-center gap-1.5 transition-colors ${
                                isLink
                                  ? 'hover:text-light-accent dark:hover:text-[#e6b450] cursor-pointer'
                                  : ''
                              }`}
                            >
                              <span>{item.name}</span>
                              {isLink && (
                                <span className="text-xs font-mono text-light-subtle dark:text-dark-subtle opacity-0 group-hover:opacity-100 transition-opacity">
                                  ↗
                                </span>
                              )}
                            </Tag>
                            {item.is_favorite && (
                              <span
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 border"
                                style={{
                                  borderColor: '#e6b45040',
                                  color: '#e6b450',
                                  backgroundColor: '#e6b45015',
                                }}
                                title="Preferred daily tool"
                              >
                                ★ Preferred
                              </span>
                            )}
                          </div>

                          {/* Right: Authentic Commentary */}
                          <p className="sm:w-3/5 text-xs sm:text-sm text-light-subtle dark:text-[#d9d7d3]/85 leading-relaxed font-sans">
                            {item.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
