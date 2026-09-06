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
  'AI & Autonomous Systems': {
    title: 'AI & Autonomous Systems',
    subtitle: 'Agentic harnesses, neural devtools, and daily frontier models',
    color: '#95e6cb', // Ayu Mint
    order: 3,
  },
  'Productivity & Writing': {
    title: 'Productivity & Writing',
    subtitle: 'Note-taking, project organization, and technical writing',
    color: '#d2a6ff', // Ayu Lilac
    order: 4,
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
  // AI Tooling & Harnesses
  'antigravity (agy)':
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e6b450' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 2 7 12 12 22 7 12 2'/%3E%3Cpolyline points='2 17 12 22 22 17'/%3E%3Cpolyline points='2 12 12 17 22 12'/%3E%3C/svg%3E",
  agy: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e6b450' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 2 7 12 12 22 7 12 2'/%3E%3Cpolyline points='2 17 12 22 22 17'/%3E%3Cpolyline points='2 12 12 17 22 12'/%3E%3C/svg%3E",
  droid:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2395e6cb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='10' width='16' height='11' rx='2'/%3E%3Ccircle cx='12' cy='5' r='2'/%3E%3Cpath d='M12 7v3'/%3E%3Cline x1='9' y1='15' x2='9.01' y2='15'/%3E%3Cline x1='15' y1='15' x2='15.01' y2='15'/%3E%3C/svg%3E",
  kiro: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffb454' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/%3E%3C/svg%3E",
  zcode:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237fd962' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='16 18 22 12 16 6'/%3E%3Cpolyline points='8 6 2 12 8 18'/%3E%3C/svg%3E",
  omp: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d2a6ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='18' cy='5' r='3'/%3E%3Ccircle cx='6' cy='12' r='3'/%3E%3Ccircle cx='18' cy='19' r='3'/%3E%3Cline x1='8.59' y1='13.51' x2='15.42' y2='17.49'/%3E%3Cline x1='15.41' y1='6.51' x2='8.59' y2='10.49'/%3E%3C/svg%3E",
  codex:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2339bae6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3Cline x1='16' y1='13' x2='8' y2='13'/%3E%3Cline x1='16' y1='17' x2='8' y2='17'/%3E%3Cpolyline points='10 9 9 9 8 9'/%3E%3C/svg%3E",
  // Frontier AI Models
  'gemini 3.8 flash':
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2339bae6'%3E%3Cpath d='M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z'/%3E%3C/svg%3E",
  'gpt-5.6 sol':
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2395e6cb'%3E%3Ccircle cx='12' cy='12' r='9' fill='none' stroke='%2395e6cb' stroke-width='2'/%3E%3Cpath d='M12 7v5l3 3' stroke='%2395e6cb' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E",
  'deepseek v4-flash':
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2339bae6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3Cpath d='M11 8a3 3 0 0 0-3 3'/%3E%3C/svg%3E",
  'glm 5.3':
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f07178' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M12 2v2m0 16v2M2 12h2m16 0h2m-3.2-6.8l-1.4 1.4m-8.8 8.8l-1.4 1.4m0-11.6l1.4 1.4m8.8 8.8l1.4 1.4'/%3E%3C/svg%3E",
}

export default function UsesPage({ uses, categories }: UsesPageProps) {
  // Create mapping of category IDs to names
  const categoryMap: Record<string, string> = {}
  categories.forEach((category) => {
    categoryMap[category.id] = category.name
  })

  // Map and group items cleanly into 4 cohesive sections
  const groupedSections: Record<string, UsesItem[]> = {
    'Workstation & System': [],
    'Development Tools': [],
    'AI & Autonomous Systems': [],
    'Productivity & Writing': [],
  }

  Object.entries(uses).forEach(([categoryId, items]) => {
    const rawCategoryName = (categoryMap[categoryId] || categoryId).toLowerCase()

    items.forEach((item) => {
      const itemName = item.name.toLowerCase()

      if (
        rawCategoryName.includes('agent') ||
        rawCategoryName.includes('ai') ||
        itemName.includes('antigravity') ||
        itemName.includes('agy') ||
        itemName.includes('droid') ||
        itemName.includes('kiro') ||
        itemName.includes('zcode') ||
        itemName.includes('omp') ||
        itemName.includes('codex') ||
        itemName.includes('gemini') ||
        itemName.includes('gpt') ||
        itemName.includes('deepseek') ||
        itemName.includes('glm')
      ) {
        groupedSections['AI & Autonomous Systems'].push(item)
      } else if (
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

  // Sort items within each section: priority first, then favorites, then name
  Object.values(groupedSections).forEach((items) => {
    items.sort((a, b) => {
      const priorityA = a.priority ?? 99
      const priorityB = b.priority ?? 99
      if (priorityA !== priorityB) return priorityA - priorityB
      if (a.is_favorite && !b.is_favorite) return -1
      if (!a.is_favorite && b.is_favorite) return 1
      return a.name.localeCompare(b.name)
    })
  })

  const totalItemsCount = Object.values(groupedSections).reduce(
    (total, items) => total + items.length,
    0
  )

  const activeSections = Object.entries(groupedSections)
    .filter(([, items]) => items.length > 0)
    .sort(
      ([nameA], [nameB]) =>
        (sectionConfig[nameA]?.order ?? 99) - (sectionConfig[nameB]?.order ?? 99)
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
