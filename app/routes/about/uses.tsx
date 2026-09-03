import { createFileRoute } from '@tanstack/react-router'
import UsesPage from '@app/about/components/UsesPage'
import { profileService } from '@app/services/profileService'
import { categoryService } from '@app/services/categoryService'

const fetchUsesData = async () => {
  try {
    const [uses, categories] = await Promise.all([
      profileService.getUses(),
      categoryService.getCategories(),
    ])
    return { uses, categories }
  } catch (error) {
    console.error('Error fetching uses data:', error)
    return {
      uses: {},
      categories: [],
    }
  }
}

export const Route = createFileRoute('/about/uses')({
  loader: () => fetchUsesData(),
  component: Uses,
})

function Uses() {
  const { uses, categories } = Route.useLoaderData()

  return <UsesPage uses={uses} categories={categories} />
}
