import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
    const text = `🍛 Just cooked ${recipe?.title || 'an amazing dish'} using ChefMate! Try it free: https://chefmate-frontend.vercel.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  if (!recipe) {
    return (
      <div style={styles.errorWrap}>
        <div style={styles.errorBox}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍳</div>
          <h2 style={styles.errorTitle}>No recipe found</h2>
          <p style={styles.errorSub}>Go back and select a recipe to cook.</p>
          <button style={styles.btnPrimary} onClick={() => navigate('/app')}>← Back to recipes</button>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div style={styles.doneWrap}>
        <div style={styles.doneBox}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={styles.doneTitle}>You did it!</h2>
          {/* FIX 2: Use recipe.title instead of recipe.name */}
          <p style={styles.doneSub}>You just cooked <strong>{recipe.title}</strong>. How did it turn out?</p>
          <div style={styles.doneActions}>
            <button style={styles.btnPrimary} onClick={shareOnWhatsApp}>📲 Share on WhatsApp</button>
            <button style={styles.btnGhost} onClick={() => navigate('/app')}>Cook another →</button>
          </div>
          {recipe.calories && (
            <div style={styles.caloriePill}>🔥 {recipe.calories} calories per serving</div>
          )}
        </div>
      </div>
    )
  }

  // FIX 3: Progress calculation — currentStep + 1 so step 1 of 5 shows 20%, not 0%
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        {/* FIX 2: Use recipe.title instead of recipe.name */}
        <div style={styles.headerTitle}>{recipe.title}</div>
        <button style={styles.ingredientsToggle} onClick={() => setShowIngredients(!showIngredients)}>
          {showIngredients ? 'Hide' : 'Ingredients'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>
      <div style={styles.progressLabel}>Step {currentStep + 1} of {steps.length}</div>

      {/* Ingredients panel */}
      {showIngredients && (
        <div style={styles.ingredientsPanel}>
          <div style={styles.ingredientsPanelTitle}>🛒 Ingredients needed</div>
          <div style={styles.ingredientsList}>
            {ingredients.map((ing, i) => (
              <div key={i} style={styles.ingredientRow}>
                <span style={styles.ingredientDot}>•</span>
                <span style={styles.ingredientText}>{ing}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step card */}
      <div style={styles.stepCard}>
        <div style={styles.stepBadge}>Step {currentStep + 1}</div>
        <p style={styles.stepText}>{steps[currentStep]}</p>

        {/* Completed steps */}
        {completedSteps.length > 0 && (
          <div style={styles.completedWrap}>
            {completedSteps.map(i => (
              <div key={i} style={styles.completedChip}>✓ Step {i + 1} done</div>
            ))}
          </div>
        )}
      </div>

      {/* Timer section */}
      <div style={styles.timerSection}>
        <div style={styles.timerLabel}>⏱ Need a timer?</div>
        <div style={styles.timerBtns}>
          {[1, 2, 5, 10, 15].map(min => (
            <button key={min} style={styles.timerChip} onClick={() => startTimer(min)}>
              {min}m
            </button>
          ))}
        </div>
        {timeLeft > 0 && (
          <div style={styles.timerDisplay}>
            <span style={styles.timerCount}>{formatTime(timeLeft)}</span>
            <button
              style={styles.timerControl}
              onClick={() => setTimerRunning(r => !r)}
            >
              {timerRunning ? '⏸ Pause' : '▶ Resume'}
            </button>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={styles.navBtns}>
        <button
          style={currentStep === 0 ? styles.btnDisabled : styles.btnGhost}
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          ← Prev
        </button>
        <button style={styles.btnPrimary} onClick={handleNext}>
          {currentStep === steps.length - 1 ? '🎉 Done!' : 'Next step →'}
        </button>
      </div>

      {/* Step dots */}
      <div style={styles.dotsWrap}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.dot,
              background: i === currentStep ? '#E8521A'
                : completedSteps.includes(i) ? '#639922'
                : '#e0d8d0'
            }}
          />
        ))}
      </div>
    </div>
  )
}

const styles = {
  root: { minHeight: '100vh', background: '#FDF6EE', padding: '0 0 40px', fontFamily: "'DM Sans', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderBottom: '1px solid rgba(44,24,16,0.1)', position: 'sticky', top: 0, zIndex: 10 },
  backBtn: { background: 'transparent', border: 'none', fontSize: 14, color: '#E8521A', cursor: 'pointer', fontWeight: 500 },
  headerTitle: { fontSize: 15, fontWeight: 600, color: '#2C1810', maxWidth: 180, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  ingredientsToggle: { background: 'transparent', border: '1px solid rgba(44,24,16,0.15)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#5C3D2E', cursor: 'pointer' },
  progressTrack: { height: 4, background: '#f0e8e0', width: '100%' },
  progressFill: { height: '100%', background: '#E8521A', borderRadius: '0 2px 2px 0', transition: 'width 0.4s ease' },
  progressLabel: { textAlign: 'center', fontSize: 12, color: '#5C3D2E', padding: '8px 0 0' },
  ingredientsPanel: { margin: '16px 20px', background: '#fff', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(44,24,16,0.08)' },
  ingredientsPanelTitle: { fontSize: 13, fontWeight: 600, color: '#2C1810', marginBottom: 10 },
  ingredientsList: { display: 'flex', flexDirection: 'column', gap: 6 },
  ingredientRow: { display: 'flex', gap: 8, alignItems: 'flex-start' },
  ingredientDot: { color: '#E8521A', fontWeight: 700, flexShrink: 0 },
  ingredientText: { fontSize: 13, color: '#5C3D2E', lineHeight: 1.5 },
  stepCard: { margin: '16px 20px', background: '#fff', borderRadius: 20, padding: '24px 20px', border: '1px solid rgba(44,24,16,0.08)', boxShadow: '0 4px 20px rgba(44,24,16,0.06)', minHeight: 160 },
  stepBadge: { display: 'inline-block', background: '#FFF0E8', color: '#E8521A', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, marginBottom: 14 },
  stepText: { fontSize: 17, color: '#2C1810', lineHeight: 1.75, fontWeight: 400 },
  completedWrap: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 },
  completedChip: { fontSize: 11, background: '#EAF3DE', color: '#27500A', padding: '3px 8px', borderRadius: 20 },
  timerSection: { margin: '0 20px 16px', background: '#fff', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(44,24,16,0.08)' },
  timerLabel: { fontSize: 12, fontWeight: 500, color: '#5C3D2E', marginBottom: 10 },
  timerBtns: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  timerChip: { background: '#FFF0E8', border: '1px solid rgba(232,82,26,0.2)', color: '#E8521A', borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  timerDisplay: { marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 },
  timerCount: { fontSize: 28, fontWeight: 700, color: '#2C1810', fontVariantNumeric: 'tabular-nums' },
  timerControl: { background: '#E8521A', color: '#fff', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, cursor: 'pointer' },
  navBtns: { display: 'flex', gap: 12, margin: '0 20px 16px' },
  btnPrimary: { flex: 1, background: '#E8521A', color: '#fff', border: 'none', borderRadius: 100, padding: '14px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
  btnGhost: { flex: 1, background: 'transparent', color: '#2C1810', border: '1.5px solid rgba(44,24,16,0.15)', borderRadius: 100, padding: '14px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  btnDisabled: { flex: 1, background: '#f5f0ec', color: '#c0b8b0', border: '1.5px solid #f0e8e0', borderRadius: 100, padding: '14px', fontSize: 14, cursor: 'not-allowed' },
  dotsWrap: { display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: '50%', transition: 'background 0.3s' },
  errorWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDF6EE' },
  errorBox: { textAlign: 'center', padding: 40 },
  errorTitle: { fontSize: 20, fontWeight: 600, color: '#2C1810', marginBottom: 8 },
  errorSub: { fontSize: 14, color: '#5C3D2E', marginBottom: 24 },
  doneWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF0E8, #FDF6EE)' },
  doneBox: { textAlign: 'center', padding: '40px 32px', background: '#fff', borderRadius: 24, boxShadow: '0 8px 40px rgba(44,24,16,0.1)', maxWidth: 360, margin: '0 20px' },
  doneTitle: { fontFamily: 'sans-serif', fontSize: 28, fontWeight: 700, color: '#2C1810', marginBottom: 10 },
  doneSub: { fontSize: 14, color: '#5C3D2E', lineHeight: 1.6, marginBottom: 24 },
  doneActions: { display: 'flex', flexDirection: 'column', gap: 10 },
  caloriePill: { marginTop: 20, display: 'inline-block', background: '#FFF0E8', color: '#E8521A', fontSize: 13, padding: '6px 16px', borderRadius: 20 },
}

export default CookMode
