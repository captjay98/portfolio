import { createFileRoute, Outlet, useRouter, useRouterState, redirect } from '@tanstack/react-router'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  Award,
  Tags,
  Code,
  User,
  Link as LinkIcon,
  Laptop,
} from 'lucide-react'
import { Button } from '@app/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@app/components/ui/sheet'
import { ScrollArea } from '@app/components/ui/scroll-area'
import { useAuth } from '@app/hooks/useAuth'
import * as React from 'react'
import { authService } from '@app/services/authService'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Blog Posts', href: '/admin/blogs', icon: <FileText className="w-5 h-5" /> },
  { name: 'Blog Series', href: '/admin/series', icon: <FileText className="w-5 h-5" /> },
  { name: 'Projects', href: '/admin/projects', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Experience', href: '/admin/experience', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Skills', href: '/admin/skills', icon: <Award className="w-5 h-5" /> },
  { name: 'Technologies', href: '/admin/technologies', icon: <Code className="w-5 h-5" /> },
  { name: 'Categories', href: '/admin/categories', icon: <Tags className="w-5 h-5" /> },
  { name: 'Profile', href: '/admin/profile', icon: <User className="w-5 h-5" /> },
  { name: 'Social Links', href: '/admin/social-links', icon: <LinkIcon className="w-5 h-5" /> },
  { name: 'Uses', href: '/admin/uses', icon: <Laptop className="w-5 h-5" /> },
  { name: 'Current Tech Stack', href: '/admin/current-tech-stack', icon: <User className="w-5 h-5" /> },
  { name: 'Contact Submissions', href: '/admin/contact-submissions', icon: <User className="w-5 h-5" /> },
  { name: 'Visitors', href: '/admin/visitors', icon: <User className="w-5 h-5" /> },
  { name: 'Guest Book', href: '/admin/guest-book', icon: <User className="w-5 h-5" /> },
  { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
]

export const Route = createFileRoute('/admin')({
  loader: async ({ context, location }) => {
    // context.request is only available on the server during SSR/data fetching
    // On the client, this will be null/undefined, which is fine for client-side navigation checks
    const request = (context as any).request as Request | undefined;
    const user = await authService.getCurrentUser(request);
    
    // Only redirect if not already on the login page and no user
    if (!user && location.pathname !== '/admin/login') {
      throw redirect({
        to: '/admin/login',
        search: {
          redirect: location.href,
        },
      });
    }

    return { user };
  },
  component: AdminLayout,
})

function AdminLayout() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const { user } = Route.useLoaderData()
  const router = useRouter()
  // useAuth is only used here for the client-side `logout` function.
  const { logout } = useAuth()
  
  if (pathname === '/admin/login') {
    return <Outlet />
  }

  if (!user) {
    // Should be handled by the loader redirect, but as a client-side safety net
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card">
        <div className="h-16 flex items-center justify-center border-b">
          <Button
            variant="link"
            className="text-light-accent dark:text-accent text-xl font-bold tracking-wider"
            onClick={() => router.navigate({ to: '/admin' })}
          >
            {user?.name} Admin
          </Button>
        </div>
        <ScrollArea className="flex-1 p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`w-full justify-start ${isActive ? 'bg-accent' : ''}`}
                  onClick={() => router.navigate({ to: item.href as any })}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.name}</span>
                </Button>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t sticky bottom-0 bg-card">
          <Button
            onClick={logout}
            variant="destructive"
            size="default"
            className="w-full justify-start font-medium"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden absolute top-8 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="h-16 flex items-center justify-center border-b bg-primary dark:bg-dark-background">
            <Button
              variant="link"
              className="text-primary-foreground text-xl font-bold tracking-wider"
              onClick={() => router.navigate({ to: '/admin' })}
            >
              IUJ Admin
            </Button>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-1 py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start ${isActive ? 'bg-accent' : ''}`}
                    onClick={() => router.navigate({ to: item.href as any })}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <Button
              onClick={logout}
              variant="destructive"
              size="sm"
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-2 sm:p-2">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
