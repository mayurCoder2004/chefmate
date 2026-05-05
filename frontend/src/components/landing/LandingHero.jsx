import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Utensils, Share2, Check } from 'lucide-react'

const chips = ['Dal', 'Chawal', 'Aata', 'Tomato', 'Egg', 'Onion', 'Bread', 'Paneer']

/** Interactive phone mockup shown in hero */
const PhoneMockup = () => {
  const [activeChips, setActiveChips] = useState(['Dal', 'Chawal', 'Tomato', 'Onion'])

  const toggleChip = (chip) =>
    setActiveChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    )

  return (
    <div className="flex justify-center">
      <div className="w-56 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Phone top bar */}
        <div className="bg-orange-500 px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-xs font-bold">ChefMate</span>
            <span className="text-white/70 text-xs">9:41</span>
          </div>
          <div className="text-white text-sm font-semibold leading-snug">What's in your kitchen?</div>
          <div className="text-white/80 text-xs mt-0.5">Tap what you have → get a recipe</div>
        </div>

        {/* Phone body */}
        <div className="p-3">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Tap your ingredients</div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => toggleChip(chip)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  activeChips.includes(chip)
                    ? 'bg-orange-50 border-orange-400 text-orange-600 font-medium'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          <button className="w-full bg-orange-500 text-white text-xs font-medium py-2 rounded-lg mb-3 flex items-center justify-center gap-1">
            <Sparkles size={10} /> Find my recipe
          </button>

          {/* Recipe card preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-orange-50 px-3 py-2 flex gap-2 items-center">
              <Utensils size={18} className="text-orange-500 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-gray-800">Dal Tadka + Chawal</div>
                <div className="flex gap-1.5 mt-1">
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">12 min</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">₹22 est.</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-2 flex gap-1.5">
              <div className="flex-1 text-center text-xs py-1 border border-gray-200 rounded text-gray-500">Save</div>
              <div className="flex-1 text-center text-xs py-1 border border-gray-200 rounded text-gray-500 flex items-center justify-center gap-0.5">
                <Share2 size={9} /> Share
              </div>
              <div className="flex-1 text-center text-xs py-1 bg-orange-500 text-white rounded">Cook</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Full hero section */
const LandingHero = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16 px-6 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            Made for Indian bachelor life
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-tight mb-4">
            1 burner.<br />
            <span className="text-orange-500">5 ingredients.</span><br />
            Real food tonight.
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md">
            Tell ChefMate what's in your PG kitchen — dal, chawal, whatever's left — and get a
            real recipe in seconds. No oven. No grinding. No Swiggy bill.
          </p>

          <div className="flex gap-3 flex-wrap mb-5">
            <button
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
              onClick={() => navigate('/app')}
            >
              Find my recipe →
            </button>
            <button
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See how it works
            </button>
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Check size={13} className="text-orange-500" />
            Free to use. No credit card. Works on any phone.
          </p>
        </div>

        {/* Right: phone mockup */}
        <PhoneMockup />
      </div>
    </section>
  )
}

export default LandingHero
