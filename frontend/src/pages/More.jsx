import { useNavigate } from 'react-router-dom'
import { Utensils, Calendar, Search, Sparkles, ArrowRight, Bot } from 'lucide-react'

export default function More() {
  const navigate = useNavigate()

  const cards = [
    {
      icon: Utensils,
      title: 'Browse Recipes',
      description: 'Explore thousands of recipes from MealDB — search by name, category, or ingredient.',
      gradient: 'from-orange-400 to-amber-400',
      bg: 'from-orange-50 to-amber-50',
      border: 'border-orange-200/50',
      path: '/recipes',
    },
    {
      icon: Calendar,
      title: 'Meal Planner',
      description: 'Plan your weekly meals and track nutrition. Stay on top of calories, macros, and more.',
      gradient: 'from-emerald-400 to-green-400',
      bg: 'from-emerald-50 to-green-50',
      border: 'border-emerald-200/50',
      path: '/meal-planner',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4 mt-20">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-300/10 to-orange-300/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="mx-auto max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Explore More
            </span>
            <Search size={36} className="text-orange-500 animate-bounce" />
          </h1>
          <p className="text-xl text-orange-700/80 font-medium flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-amber-500" /> Everything ChefMate has to offer
          </p>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col gap-6">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`w-full text-left bg-gradient-to-br ${card.bg} backdrop-blur-sm rounded-3xl p-8 shadow-xl border ${card.border} hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group`}
            >
              <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon size={30} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300`}>
                  <ArrowRight size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-orange-600/60 font-medium mt-10 flex items-center justify-center gap-2">
          <Bot size={16} /> Head back to <button onClick={() => navigate('/app')} className="underline underline-offset-2 hover:text-orange-700 transition-colors">AI Recipes</button> to generate something new
        </p>
      </div>
    </div>
  )
}
