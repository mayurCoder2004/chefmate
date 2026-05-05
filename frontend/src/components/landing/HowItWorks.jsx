import React from 'react'
import { ShoppingCart, Bot, Share2 } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: ShoppingCart,
    title: 'Tap what you have',
    desc: "Select ingredients from your kitchen in one tap — dal, chawal, onion, tomato, whatever's there. No typing needed.",
  },
  {
    num: '02',
    icon: Bot,
    title: 'AI builds your recipe',
    desc: "ChefMate's AI generates a recipe using exactly what you have — filtered for single burner, under 20 minutes, and under ₹50.",
  },
  {
    num: '03',
    icon: Share2,
    title: 'Cook it, share it',
    desc: 'Follow the step-by-step guide and cook. Share on WhatsApp in one tap. Save your favorites for next time.',
  },
]

const HowItWorks = () => (
  <section id="how" className="py-16 px-4 bg-gray-50">
    <div className="max-w-4xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full mb-3">
          How it works
        </span>
        <h2 className="text-xl font-semibold text-gray-800">
          From empty fridge to dinner in under 60 seconds
        </h2>
      </div>

      {/* Steps grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div key={s.num} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-4xl font-bold text-gray-100 leading-none mb-3">{s.num}</div>
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={18} className="text-orange-500" />
              <h3 className="text-sm font-semibold text-gray-800">{s.title}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HowItWorks
