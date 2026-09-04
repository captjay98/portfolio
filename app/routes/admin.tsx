import { createFileRoute, Outlet, useRouter, useRouterState, redirect, Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  FileText,
  Layers,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Laptop,
  User,
  Mail,
  Activity,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@app/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@app/components/ui/sheet'
import { ScrollArea } from '@app/components/ui/scroll-area'
import { ThemeToggle } from '@app/components/ui/theme-toggle'
import { useAuth } from '@app/hooks/useAuth'
import * as React from 'react'
import { authService } from '@app/services/authService'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Writing & Work',
    items: [
      { name: 'Studio Home', href: '/admin', icon: LayoutDashboard, exact: true },
      { name: 'Essays', href: '/admin/blogs', icon: FileText },
      { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
      { name: 'Essay Series', href: '/admin/series', icon: Layers },
    ],
  },
  {
    title: 'Journey & Profile',
    items: [
      { name: 'Experience', href: '/admin/experience', icon: Briefcase },
      { name: 'Education', href: '/admin/education', icon: GraduationCap },
      { name: 'Uses & Gear', href: '/admin/uses', icon: Laptop },
      { name: 'Skills & Stack', href: '/admin/skills', icon: Award },
      { name: 'Technologies', href: '/admin/technologies', icon: Code2 },
      { name: 'Public Bio', href: '/admin/profile', icon: User },
    ],
  },
  {
    title: 'Readers & Feedback',
    items: [
      { name: 'Inquiries', href: '/admin/contact-submissions', icon: Mail },
      { name: 'Guest Book', href: '/admin/guest-book', icon: BookOpen },
      { name: 'Visitor Telemetry', href: '/admin/visitors', icon: Activity },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export const Route = createFileRoute('/admin')({
  loader: async ({ context, location }) => {
    const request = (context as any).request as Request | undefined
    const user = await authService.getCurrentUser(request)
    
    if (!user && location.pathname !== '/admin/login') {
      throw redirect({
        to: '/admin/login',
        search: {
          redirect: location.href,
        },
      })
    }

    return { user }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const { user } = Route.useLoaderData()
  const router = useRouter()
  const { logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  if (pathname === '/admin/login') {
    return <Outlet />
  }

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-light-background dark:bg-dark-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e6b450]" />
      </div>
    )
  }

  const allNavItems = navSections.flatMap((s) => s.items)
  const currentItem = allNavItems.find((item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
  )
  const currentSection = navSections.find((s) => s.items.some((i) => i.href === currentItem?.href))

  const renderNavList = (onNavigate?: () => void) => (
    <div className="space-y-6 pb-6">
      {navSections.map((section) => (
        <div key={section.title} className="space-y-1">
          <div className="px-3 text-[11px] font-mono tracking-wider uppercase text-light-subtle/70 dark:text-dark-subtle/70">
            {section.title}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    router.navigate({ to: item.href as any })
                    if (onNavigate) onNavigate()
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] font-semibold'
                      : 'text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text hover:bg-light-subtle/5 dark:hover:bg-white/5 font-normal'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-700 dark:text-[#e6b450]' : 'text-light-subtle/70 dark:text-dark-subtle/70'}`} />
                  <span className="truncate">{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text select-text">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-full shrink-0 border-r border-light-subtle/15 dark:border-dark-subtle/15 bg-white dark:bg-[#0a0e14] z-30 select-none">
        {/* Editorial Masthead */}
        <div className="p-5 border-b border-light-subtle/15 dark:border-dark-subtle/15">
          <Link to="/" className="group block space-y-0.5">
            <h2 className="font-serif italic text-xl text-light-text dark:text-dark-text group-hover:text-amber-700 dark:group-hover:text-[#e6b450] transition-colors">
              Jamal Ibrahim
            </h2>
            <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
              Editorial Studio
            </p>
          </Link>
        </div>

        {/* Scrollable Nav Items */}
        <ScrollArea className="flex-1 p-3">
          {renderNavList()}
        </ScrollArea>

        {/* Author Session & Logout */}
        <div className="p-4 border-t border-light-subtle/15 dark:border-dark-subtle/15 bg-white dark:bg-[#0a0e14]">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-serif italic text-light-text dark:text-dark-text truncate">
                {user?.name || 'Jamal Ibrahim'}
              </div>
              <div className="text-[11px] font-mono text-light-subtle/80 dark:text-dark-subtle/80 truncate">
                {user?.email || 'admin'}
              </div>
            </div>
            <button
              onClick={logout}
              type="button"
              title="Sign out"
              className="p-1.5 rounded-md text-light-subtle dark:text-dark-subtle hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workstation Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-light-background dark:bg-dark-background">
        {/* Top Minimalist Header */}
        <header className="h-14 shrink-0 border-b border-light-subtle/15 dark:border-dark-subtle/15 bg-white/70 dark:bg-[#0a0e14]/70 backdrop-blur-md px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8 text-light-text dark:text-dark-text"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-[#0a0e14] border-r border-light-subtle/15 dark:border-dark-subtle/15 flex flex-col">
                <div className="p-5 border-b border-light-subtle/15 dark:border-dark-subtle/15">
                  <div className="space-y-0.5">
                    <h2 className="font-serif italic text-xl text-light-text dark:text-dark-text">
                      Jamal Ibrahim
                    </h2>
                    <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                      Editorial Studio
                    </p>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-3">
                  {renderNavList(() => setIsMobileOpen(false))}
                </ScrollArea>

                <div className="p-4 border-t border-light-subtle/15 dark:border-dark-subtle/15">
                  <button
                    onClick={() => {
                      setIsMobileOpen(false)
                      logout()
                    }}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-mono text-light-subtle dark:text-dark-subtle">
              <span>Studio</span>
              {currentSection && (
                <>
                  <ChevronRight className="w-3 h-3 opacity-40" />
                  <span className="hidden sm:inline">{currentSection.title}</span>
                </>
              )}
              {currentItem && (
                <>
                  <ChevronRight className="w-3 h-3 opacity-40" />
                  <span className="text-light-text dark:text-dark-text font-medium truncate">
                    {currentItem.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-px bg-light-subtle/15 dark:border-dark-subtle/15" />
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono text-light-subtle dark:text-dark-subtle hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors"
            >
              <span>View Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-light-background dark:bg-dark-background">
          <div className="w-full max-w-5xl mx-auto px-6 py-8 sm:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
