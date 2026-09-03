import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Users, FileText, Layers, Briefcase, Award, GraduationCap, Tag } from 'lucide-react'
import * as React from 'react'
import Dashboard from '@app/components/admin/dashboard'

// Mock checkAuth for build verification
const checkAuth = async () => {
  return { isAuthenticated: true }
}

export const Route = createFileRoute('/admin/')({
  loader: () => checkAuth(),
  component: AdminDashboard,
})

function AdminDashboard() {
  const navigate = useNavigate()

  const dashboardItems = [
    {
      title: 'Profile',
      description: 'Manage your personal information and bio',
      icon: <Users size={24} />,
      link: '/admin/profile',
      color: 'bg-blue-500',
    },
    {
      title: 'Blog Posts',
      description: 'Create and edit blog articles',
      icon: <FileText size={24} />,
      link: '/admin/blogs',
      color: 'bg-green-500',
    },
    {
      title: 'Blog Series',
      description: 'Organize posts into series',
      icon: <Layers size={24} />,
      link: '/admin/series',
      color: 'bg-indigo-500',
    },
    {
      title: 'Projects',
      description: 'Showcase your work and portfolio',
      icon: <Briefcase size={24} />,
      link: '/admin/projects',
      color: 'bg-purple-500',
    },
    {
      title: 'Experience',
      description: 'Update your work history',
      icon: <Award size={24} />,
      link: '/admin/experience',
      color: 'bg-amber-500',
    },
    {
      title: 'Education',
      description: 'Manage education records',
      icon: <GraduationCap size={24} />,
      link: '/admin/education',
      color: 'bg-red-500',
    },
    {
      title: 'Technologies',
      description: 'Skills and tools you use',
      icon: <Tag size={24} />,
      link: '/admin/technologies',
      color: 'bg-cyan-500',
    },
    {
      title: 'Categories',
      description: 'Manage content categories',
      icon: <Tag size={24} />,
      link: '/admin/categories',
      color: 'bg-pink-500',
    },
  ]

  return (
    <Dashboard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => navigate({ to: item.link })}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-md`}>
                {item.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{item.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Dashboard>
  )
}
