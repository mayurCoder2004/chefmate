import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingCTA = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16 px-4 bg-orange-50 border-t border-orange-100 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Stop ordering Swiggy.<br />Cook what you already have.
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Join Indian bachelors cooking smarter with ChefMate.
        </p>
        <button
          className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
          onClick={() => navigate('/app')}
        >
          Start cooking for free
        </button>
        <p className="text-xs text-gray-400 mt-3">Free forever. No signup required to try.</p>
      </div>
    </section>
  )
}

export default LandingCTA
