import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import {
  ChefHat, ArrowLeft, ArrowRight, ShoppingCart, Timer,
  Share2, Utensils, Salad, Sparkles, Flame, PauseCircle, PlayCircle, Check, X
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
  const [isLoading, setIsLoading] = useState(true)
  const [slideDirection, setSlideDirection] = useState('next')
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    // Simulate brief loading for recipe parsing
    if (recipe) {
      const timer = setTimeout(() => setIsLoading(false), 300)
      return () => clearTimeout(timer)
    }
  }, [recipe])

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
    setSlideDirection('next')
    setAnimKey(prev => prev + 1)
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
    setSlideDirection('prev')
    setAnimKey(prev => prev + 1)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-8 max-w-sm w-full shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <ChefHat size={40} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No recipe found</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">Go back and select a recipe to start cooking.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 w-full"
            onClick={() => navigate('/app')}
          >
            <ArrowLeft size={18} /> Back to recipes
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-3xl text-center p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl" />
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Sparkles size={48} className="text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-3"
            >
              You did it!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6 leading-relaxed"
            >
              You just cooked <strong className="text-gray-900 font-semibold">{recipe.title}</strong>. How did it turn out?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-3 relative z-10"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                onClick={shareOnWhatsApp}
              >
                <Share2 size={18} /> Share on WhatsApp
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                onClick={shareRecipe}
              >
                <Share2 size={18} /> Share Recipe
              </motion.button>
            </motion.div>

            {recipe.calories && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-700 font-medium py-2 px-4 rounded-xl shadow-sm"
              >
                <Flame size={16} /> {recipe.calories} calories per serving
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-gray-200 relative z-10"
            >
              <p className="text-sm font-semibold text-gray-700 mb-4">What next?</p>
              <div className="flex flex-col gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => navigate('/app')}
                >
                  <ChefHat size={18} /> Cook Another
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => navigate('/recipes')}
                >
                  <Utensils size={18} /> Explore Recipes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => navigate('/meal-planner')}
                >
                  <Salad size={18} /> Plan Meals
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </>
    )
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
          >
            <div className="skeleton-line h-5 w-2/5 rounded-xl"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 space-y-4 shadow-lg">
              <div className="skeleton-line h-4 w-1/4 rounded-lg"></div>
              <div className="skeleton-line h-6 w-full rounded-lg"></div>
              <div className="skeleton-line h-6 w-4/5 rounded-lg"></div>
              <div className="skeleton-line h-6 w-3/5 rounded-lg"></div>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="skeleton-line h-14 flex-1 rounded-2xl"></div>
              <div className="skeleton-line h-14 flex-1 rounded-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 space-y-6"
      >

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-4 sticky top-4 z-20 shadow-lg"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-orange-600 font-semibold hover:text-orange-700 transition flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Back
          </motion.button>
          <div className="text-base font-bold text-gray-900 max-w-[150px] sm:max-w-[300px] truncate">
            {recipe.title}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-sm"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            {showIngredients ? 'Hide' : 'Ingredients'}
          </motion.button>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="px-2"
        >
          <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
          <div className="text-center text-sm font-semibold text-gray-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </div>
        </motion.div>

        {/* Ingredients panel */}
        <AnimatePresence>
          {showIngredients && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-6 shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                    <ShoppingCart size={18} className="text-white" />
                  </div>
                  Ingredients needed
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowIngredients(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <ul className="space-y-3">
                {ingredients.map((ing, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mt-2 flex-shrink-0 shadow-sm" />
                    <span className="font-medium">{ing}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: slideDirection === 'next' ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'next' ? -100 : 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-8 min-h-[280px] flex flex-col justify-center relative shadow-2xl overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl" />

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-lg"
            >
              Step {currentStep + 1}
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold text-gray-900 leading-relaxed mt-8 relative z-10"
            >
              {steps[currentStep]}
            </motion.p>

            {completedSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mt-6 relative z-10"
              >
                {completedSteps.map((i, idx) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-sm font-semibold py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Check size={14} /> Step {i + 1} done
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Timer section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Timer size={18} className="text-white" />
            </div>
            Need a timer?
          </h3>
          <div className="flex flex-wrap gap-2.5 mb-4">
            {[1, 2, 5, 10, 15].map(min => (
              <motion.button
                key={min}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => startTimer(min)}
              >
                {min}m
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {timeLeft > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-2xl shadow-md overflow-hidden"
              >
                <motion.span
                  animate={timeLeft <= 10 && timeLeft > 0 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`text-3xl font-bold text-gray-900 tracking-tight font-mono w-24 text-center ${
                    timeLeft <= 10 && timeLeft > 0 ? 'text-red-600' : ''
                  }`}
                >
                  {formatTime(timeLeft)}
                </motion.span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex-1 flex items-center justify-center gap-2"
                  onClick={() => setTimerRunning(r => !r)}
                >
                  {timerRunning ? (
                    <>
                      <PauseCircle size={18} /> Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle size={18} /> Resume
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <motion.button
            whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-800 hover:shadow-xl'
            }`}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={18} /> Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2 shadow-lg"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles size={18} /> Done!
              </>
            ) : (
              <>
                Next step <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Step dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2.5 pb-6"
        >
          {steps.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'bg-orange-500 w-8 shadow-md'
                  : completedSteps.includes(i)
                  ? 'bg-green-500 shadow-sm'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </motion.div>
      </motion.div>
      
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            maxWidth: '400px',
          },
          success: { iconTheme: { primary: '#f97316', secondary: '#ffffff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />
    </div>
  )
}

export default CookMode
