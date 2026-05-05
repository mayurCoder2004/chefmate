import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import {
  ChefHat, ArrowLeft, ArrowRight, ShoppingCart, Timer,
  Share2, Utensils, Salad, Sparkles, Flame, PauseCircle, PlayCircle, Check
} from 'lucide-react'

const CookMode = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const recipe = state?.recipe

  const steps = recipe?.cookingSteps || []
  const ingredients = recipe?.usedIngredients || []

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [timer, setTimer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showIngredients, setShowIngredients] = useState(true)
  const [done, setDone] = useState(false)

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

  const shareOnWhatsApp = async () => {
    toast.loading('Creating shareable link...', { id: 'whatsapp-loading' });
    
    try {
      // Create shareable recipe
      const res = await fetch(
        `${import.meta.env?.VITE_BASE_URL || 'http://localhost:5000'}/api/share-recipe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipe)
        }
      );
      
      if (!res.ok) {
        throw new Error('Failed to create shareable link');
      }
      
      const data = await res.json();
      const shareUrl = `${window.location.origin}/recipe/share/${data.shareId}`;
      const shareText = `I just made ${recipe?.title || 'an amazing dish'} 🍳\n\nCheck the full recipe here: ${shareUrl}`;
      
      toast.dismiss('whatsapp-loading');
      
      // Open WhatsApp with the shareable link
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Opening WhatsApp...', { duration: 2000 });
    } catch (err) {
      toast.dismiss('whatsapp-loading');
      toast.error('Failed to create share link', { duration: 3000 });
    }
  }

  const shareRecipe = async () => {
    toast.loading('Creating shareable link...', { id: 'share-loading' });
    
    try {
      // Create shareable recipe
      const res = await fetch(
        `${import.meta.env?.VITE_BASE_URL || 'http://localhost:5000'}/api/share-recipe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipe)
        }
      );
      
      if (!res.ok) {
        throw new Error('Failed to create shareable link');
      }
      
      const data = await res.json();
      const shareUrl = `${window.location.origin}/recipe/share/${data.shareId}`;
      const shareText = `I just made ${recipe?.title || 'an amazing dish'} 🍳\n\nCheck the full recipe here: ${shareUrl}`;
      
      toast.dismiss('share-loading');
      
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: recipe?.title || 'Amazing Recipe',
          text: shareText,
          url: shareUrl
        });
        toast.success('Recipe shared!', { duration: 2000 });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!', { duration: 3000 });
      }
    } catch (err) {
      toast.dismiss('share-loading');
      if (err.name !== 'AbortError') {
        toast.error('Failed to share recipe', { duration: 3000 });
      }
    }
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="text-center bg-white border border-gray-200 rounded-xl p-6 max-w-sm w-full shadow-md">
          <ChefHat size={40} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No recipe found</h2>
          <p className="text-sm text-gray-600 mb-5">Go back and select a recipe to cook.</p>
          <button
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 w-full"
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 pt-24">
          <div className="bg-white border border-orange-100 rounded-xl text-center p-8 max-w-sm w-full shadow-lg">
            <Sparkles size={48} className="text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">You did it!</h2>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              You just cooked <strong className="text-gray-800">{recipe.title}</strong>. How did it turn out?
            </p>

            <div className="flex flex-col gap-2">
              <button
                className="px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                onClick={shareOnWhatsApp}
              >
                <Share2 size={18} /> Share on WhatsApp
              </button>
              <button
                className="px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                onClick={shareRecipe}
              >
                <Share2 size={18} /> Share Recipe
              </button>
            </div>

            {recipe.calories && (
              <div className="mt-4 inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-sm py-1.5 px-3 rounded-lg">
                <Flame size={14} /> {recipe.calories} calories per serving
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">What next?</p>
              <div className="flex flex-col gap-2">
                <button
                  className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                  onClick={() => navigate('/app')}
                >
                  <ChefHat size={18} /> Cook Another
                </button>
                <button
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
                  onClick={() => navigate('/recipes')}
                >
                  <Utensils size={18} /> Explore Recipes
                </button>
                <button
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
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

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6">
      <div className="max-w-2xl mx-auto px-4 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 sticky top-4 z-10 shadow-md">
          <button
            className="text-orange-600 font-medium hover:text-orange-700 transition flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-sm font-semibold text-gray-800 max-w-[150px] sm:max-w-[250px] truncate">
            {recipe.title}
          </div>
          <button
            className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium py-1.5 px-3 rounded-lg transition duration-200"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            {showIngredients ? 'Hide' : 'Ingredients'}
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-1">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-xs text-gray-500 mt-1.5">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Ingredients panel */}
        {showIngredients && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <ShoppingCart size={16} className="text-orange-600" /> Ingredients needed
            </h3>
            <ul className="space-y-1.5">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step card */}
        <div className="bg-white border border-orange-100 rounded-xl p-5 min-h-[200px] flex flex-col justify-center relative shadow-md hover:shadow-lg transition duration-200">
          <span className="absolute top-3 left-3 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium py-1 px-2.5 rounded-lg">
            Step {currentStep + 1}
          </span>

          <p className="text-base font-medium text-gray-800 leading-relaxed mt-6">
            {steps[currentStep]}
          </p>

          {completedSteps.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {completedSteps.map(i => (
                <span key={i} className="bg-green-50 border border-green-200 text-green-700 text-xs font-medium py-1 px-2.5 rounded-lg flex items-center gap-1">
                  <Check size={12} /> Step {i + 1} done
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timer section */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Timer size={16} className="text-orange-600" /> Need a timer?
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {[1, 2, 5, 10, 15].map(min => (
              <button
                key={min}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-1.5 px-4 rounded-lg transition duration-200 hover:scale-[1.02]"
                onClick={() => startTimer(min)}
              >
                {min}m
              </button>
            ))}
          </div>

          {timeLeft > 0 && (
            <div className="flex items-center gap-4 bg-orange-50 border border-orange-100 p-3 rounded-lg">
              <span className="text-2xl font-bold text-gray-800 tracking-tight font-mono w-20 text-center">
                {formatTime(timeLeft)}
              </span>
              <button
                className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition duration-200 hover:scale-[1.02] flex-1 flex items-center justify-center gap-2"
                onClick={() => setTimerRunning(r => !r)}
              >
                {timerRunning ? <><PauseCircle size={16} /> Pause</> : <><PlayCircle size={16} /> Resume</>}
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            className={`flex-1 py-2.5 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-[1.01]'
            }`}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={16} /> Prev
          </button>
          <button
            className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? <><Sparkles size={16} /> Done!</> : <>Next step <ArrowRight size={16} /></>}
          </button>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === currentStep ? 'bg-orange-500'
                  : completedSteps.includes(i) ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <Toaster position="top-right" gutter={8} toastOptions={{
        duration: 3000,
        style: { background: '#fff', color: '#374151', fontWeight: '500', fontSize: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)', maxWidth: '380px' },
        success: { iconTheme: { primary: '#f97316', secondary: '#ffffff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
      }} />
    </div>
  )
}

export default CookMode
