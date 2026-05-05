import React from 'react'
import { Home, Briefcase, GraduationCap, Moon } from 'lucide-react'

const whoCards = [
  {
    icon: Home,
    title: 'PG & hostel residents',
    desc: 'One burner, shared kitchen, random leftovers. ChefMate works with exactly what you have.',
  },
  {
    icon: Briefcase,
    title: 'Working professionals',
    desc: 'Too tired to think about dinner. Open ChefMate, tap 4 things, eat in 15 minutes.',
  },
  {
    icon: GraduationCap,
    title: 'College students',
    desc: "Budget is tight. Swiggy adds up. Cook real food for ₹20–40 with what's already in your room.",
  },
  {
    icon: Moon,
    title: 'Late night hunger',
    desc: "Nothing's open, you have eggs and bread. ChefMate turns that into something decent in 10 minutes.",
  },
]

const ForWho = () => (
  <section className="py-16 px-4 bg-gray-800">
    <div className="max-w-4xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-3">
          Who it's for
        </span>
        <h2 className="text-xl font-semibold text-white">
          Built for real Indian kitchen situations
        </h2>
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {whoCards.map((w) => (
          <div key={w.title} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex-shrink-0 mt-0.5">
              <w.icon size={18} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">{w.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{w.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default ForWho
