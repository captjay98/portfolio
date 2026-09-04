import React from 'react'

interface DashboardProps {
  children?: React.ReactNode
}

export default function Dashboard({ children }: DashboardProps) {
  return (
    <div className="w-full space-y-8">
      {children}
    </div>
  )
}
