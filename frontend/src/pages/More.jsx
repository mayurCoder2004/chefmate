import { useNavigate } from 'react-router-dom'
import { Utensils, Calendar, ArrowRight } from 'lucide-react'

export default function More() {
  const navigate = useNavigate()

  const cards = [
    {
      icon: Utensils,
      title: 'Browse Recipes',
      description: 'Explore thousands of recipes from MealDB — search by name, category, or ingredient.',
      path: '/recipes',
    },
    {
      icon: Calendar,
      title: 'Meal Planner',
      description: 'Plan your weekly meals and track nutrition. Stay on top of calories, macros, and more.',
      path: '/meal-planner',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 mt-20">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Explore More</h1>
          <p className="text-sm text-gray-600">Everything ChefMate has to offer.</p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-3">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:scale-[1.01] transition duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                  <card.icon size={22} className="text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-gray-800 mb-0.5">{card.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                </div>
                <ArrowRight size={18} className="text-gray-400 flex-shrink-0 group-hover:text-orange-600 transition" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-gray-400 pt-2">
          Head back to{' '}
          <button
            onClick={() => navigate('/app')}
            className="text-orange-600 hover:underline font-medium"
          >
            AI Recipes
          </button>{' '}
          to generate something new.
        </p>
      </div>
    </div>
  )
}
