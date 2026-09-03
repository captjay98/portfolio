import React from 'react'

export default function Dashboard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background p-6">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}
