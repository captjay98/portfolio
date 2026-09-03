import { Link } from '@tanstack/react-router'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-9xl font-bold text-light-accent dark:text-dark-accent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-4">
          Page Not Found
        </h2>
        <p className="text-light-subtle dark:text-dark-subtle mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The page might have been removed or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-glass border border-light-subtle/20 dark:border-dark-subtle/20 text-light-text dark:text-dark-text rounded-lg hover:bg-light-subtle/10 dark:hover:bg-dark-subtle/10 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </main>
  )
}
