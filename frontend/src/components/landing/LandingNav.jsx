import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingNav = () => {
  const navigate = useNavigate()

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="text-lg font-semibold text-orange-500">
        Chef<span className="text-gray-800">Mate</span>
      </div>
      <button
        className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
        onClick={() => navigate('/app')}
      >
        Try for free
      </button>
    </nav>
  )
}

export default LandingNav
