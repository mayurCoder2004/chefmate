import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  ChefHat, ArrowLeft, ArrowRight, ShoppingCart, Timer,
  Share2, Utensils, Salad, Sparkles, Flame, PauseCircle, PlayCircle, Check
} from 'lucide-react'

const CookMode = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const recipe = state?.recipe // passed via navigate('/cook', { state: { recipe } })

  // FIX 1: Use cookingSteps and usedIngredients from the backend payload
  const steps = recipe?.cookingSteps || []
  const ingredients = recipe?.usedIngredients || []

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [timer, setTimer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showIngredients, setShowIngredients] = useState(true)
  const [done, setDone] = useState(false)

  // Timer logic
  useEffect(() => {
    let interval
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [timerRunning, timeLeft])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60)
    setTimerRunning(true)
  }

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, currentStep])
    setTimerRunning(false)
    setTimeLeft(0)
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setDone(true)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setTimerRunning(false)
      setTimeLeft(0)
    }
  }

  const shareOnWhatsApp = () => {
    // FIX 2: Use recipe.title instead of recipe.name
    const text = `Just cooked ${recipe?.title || 'an amazing dish'} using ChefMate! Try it free: https://chefmate-frontend.vercel.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 font-sans">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-sm w-full border border-orange-100">
          <div className="flex justify-center mb-4"><ChefHat size={56} className="text-orange-400" /></div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">No recipe found</h2>
          <p className="text-stone-600 mb-8 text-sm">Go back and select a recipe to cook.</p>
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3.5 px-6 rounded-2xl w-full transition-colors shadow-md flex items-center justify-center gap-2"
            onClick={() => navigate('/app')}
          >
            <ArrowLeft size={18} /> Back to recipes
          </button>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4 pt-24 font-sans">
          <div className="bg-white text-center p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-orange-100">
            <div className="flex justify-center mb-4 animate-bounce"><Sparkles size={56} className="text-orange-400" /></div>
            <h2 className="text-3xl font-extrabold text-stone-800 mb-3">You did it!</h2>
            {/* FIX 2: Use recipe.title instead of recipe.name */}
            <p className="text-stone-600 mb-6 leading-relaxed text-sm">
              You just cooked <strong className="text-stone-800">{recipe.title}</strong>. How did it turn out?
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                onClick={shareOnWhatsApp}
              >
                <Share2 size={18} /> Share on WhatsApp
              </button>
            </div>
            
            {recipe.calories && (
              <div className="mt-6 inline-block bg-orange-50 text-orange-600 font-medium text-sm py-1.5 px-4 rounded-full border border-orange-100">
                <Flame size={14} className="inline mr-1" /> {recipe.calories} calories per serving
              </div>
            )}

            {/* What next section */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <p className="text-sm font-bold text-stone-700 mb-4">What next?</p>
              <div className="flex flex-col gap-3">
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3.5 px-6 rounded-2xl transition-colors shadow-md"
                  onClick={() => navigate('/app')}
                >
                  <ChefHat size={18} /> Cook Another
                </button>
                <button 
                  className="bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium py-3.5 px-6 rounded-2xl border border-stone-200 transition-colors"
                  onClick={() => navigate('/recipes')}
                >
                  <Utensils size={18} /> Explore Recipes
                </button>
                <button 
                  className="bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium py-3.5 px-6 rounded-2xl border border-stone-200 transition-colors"
                  onClick={() => navigate('/meal-planner')}
                >
                  <Salad size={18} /> Plan Meals
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // FIX 3: Progress calculation — currentStep + 1 so step 1 of 5 shows 20%, not 0%
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-orange-50 py-6 font-sans">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-100 sticky top-4 z-10">
          <button 
            className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors px-2 flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>
          {/* FIX 2: Use recipe.title instead of recipe.name */}
          <div className="text-base font-semibold text-stone-800 max-w-[150px] sm:max-w-[250px] truncate">
            {recipe.title}
          </div>
          <button 
            className="border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-medium py-1.5 px-3 rounded-full transition-colors"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            {showIngredients ? 'Hide' : 'Ingredients'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-2 pt-2">
          <div className="h-1.5 w-full bg-orange-200/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="text-center text-xs font-medium text-stone-500 mt-2">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Ingredients panel */}
        {showIngredients && (
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 transition-all">
            <h3 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
              <ShoppingCart size={16} className="text-orange-500" /> Ingredients needed
            </h3>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-600 text-sm">
                  <span className="text-orange-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step card (Main Focus) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-orange-100 min-h-[200px] flex flex-col justify-center relative">
          <div className="absolute top-6 left-6">
            <span className="bg-orange-100 text-orange-600 text-xs font-bold py-1.5 px-3 rounded-full">
              Step {currentStep + 1}
            </span>
          </div>
          
          <p className="text-lg sm:text-xl font-medium text-stone-800 leading-relaxed mt-8">
            {steps[currentStep]}
          </p>

          {/* Completed steps tags */}
          {completedSteps.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {completedSteps.map(i => (
                <span key={i} className="bg-green-50 border border-green-100 text-green-700 text-xs font-medium py-1 px-2.5 rounded-full flex items-center gap-1">
                  <Check size={12} /> Step {i + 1} done
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timer section */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
            <Timer size={16} className="text-orange-500" /> Need a timer?
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 5, 10, 15].map(min => (
              <button 
                key={min} 
                className="bg-orange-50 hover:bg-orange-100 border border-orange-200/50 text-orange-600 text-sm font-medium py-1.5 px-4 rounded-full transition-colors"
                onClick={() => startTimer(min)}
              >
                {min}m
              </button>
            ))}
          </div>
          
          {timeLeft > 0 && (
            <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
              <span className="text-3xl font-bold text-stone-800 tracking-tight font-mono w-24 text-center">
                {formatTime(timeLeft)}
              </span>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-5 rounded-full shadow-sm transition-colors flex-1"
                onClick={() => setTimerRunning(r => !r)}
              >
                {timerRunning ? <><PauseCircle size={16} /> Pause</> : <><PlayCircle size={16} /> Resume</>}
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 pt-2">
          <button
            className={`flex-1 py-3.5 rounded-xl text-sm font-medium transition-all ${
              currentStep === 0 
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 active:scale-95'
            }`}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={16} /> Prev
          </button>
          <button 
            className="flex-1 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? <><Sparkles size={16} /> Done!</> : <>Next step <ArrowRight size={16} /></>}
          </button>
        </div>

        {/* Step dots (Progress indicator) */}
        <div className="flex justify-center gap-2 mt-4 pb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                i === currentStep ? 'bg-orange-500'
                  : completedSteps.includes(i) ? 'bg-green-500'
                  : 'bg-stone-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CookMode
