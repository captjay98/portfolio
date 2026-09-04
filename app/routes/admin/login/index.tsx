import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@app/hooks/useAuth'

export const Route = createFileRoute('/admin/login/')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const search = Route.useSearch({ select: (s) => s })
  const redirectUrl = (search as any).redirect || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)
      
      if (result.success) {
        toast.success('Welcome back')
        navigate({ to: redirectUrl, replace: true })
      } else {
        toast.error(result.error || 'Invalid credentials') 
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-background dark:bg-dark-background p-6 text-light-text dark:text-dark-text">
      <div className="w-full max-w-md space-y-6">
        {/* Return to public site */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-light-subtle dark:text-dark-subtle hover:text-amber-700 dark:hover:text-[#e6b450] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to portfolio</span>
        </Link>

        {/* Editorial Login Card */}
        <div className="bg-white dark:bg-[#0a0e14] border border-light-subtle/15 dark:border-dark-subtle/15 rounded-2xl p-8 sm:p-10 space-y-6 shadow-xs">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-light-text dark:text-dark-text tracking-tight">
              Sign In to Studio
            </h1>
            <p className="font-serif italic text-sm text-light-subtle dark:text-dark-subtle leading-relaxed">
              Enter your credentials to access the editorial desk, manage writing, and view correspondence.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="captjay98@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-light-background dark:bg-[#131721] border border-light-subtle/20 dark:border-dark-subtle/20 text-light-text dark:text-dark-text placeholder:text-light-subtle/40 focus:outline-none focus:border-[#e6b450] focus:ring-1 focus:ring-[#e6b450] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-light-background dark:bg-[#131721] border border-light-subtle/20 dark:border-dark-subtle/20 text-light-text dark:text-dark-text placeholder:text-light-subtle/40 focus:outline-none focus:border-[#e6b450] focus:ring-1 focus:ring-[#e6b450] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#e6b450] hover:bg-[#d48b00] disabled:opacity-50 text-black font-mono text-xs font-semibold tracking-wider transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}