import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Utensils, Calendar, ArrowRight, Sparkles, ChefHat, User } from 'lucide-react'

export default function More() {
  const navigate = useNavigate()

  const cards = [
    {
      icon: Utensils,
      title: 'Browse Recipes',
      description: 'Explore thousands of recipes from MealDB — search by name, category, or ingredient.',
      path: '/recipes',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-amber-50',
    },
    {
      icon: Calendar,
      title: 'Meal Planner',
      description: 'Plan your weekly meals and track nutrition. Stay on top of calories, macros, and more.',
      path: '/meal-planner',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: ChefHat,
      title: 'AI Recipe Generator',
      description: 'Generate custom recipes based on your ingredients using AI-powered suggestions.',
      path: '/app',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: User,
      title: 'My Profile',
      description: 'View your saved recipes, preferences, and account settings.',
      path: '/profile',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4 mt-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f97316\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles size={32} className="text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Explore <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">More Features</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Everything ChefMate has to offer — from recipe discovery to meal planning.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {cards.map((card, index) => (
            <motion.button
              key={card.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.path)}
              className="relative text-left bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <card.icon size={24} className="text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-orange-600 transition-colors">
                    <span>Explore</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Why Choose ChefMate?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Recipes Created', value: '500+', icon: '🍳' },
              { label: 'Active Users', value: '100+', icon: '👥' },
              { label: 'Free Forever', value: '100%', icon: '✨' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center pt-4"
        >
          <p className="text-gray-600 mb-4">
            Ready to create something delicious?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-200"
          >
            <ChefHat size={20} />
            Generate AI Recipe
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
