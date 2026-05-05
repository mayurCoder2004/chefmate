import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sharedStyles } from './landingStyles'
import { Sparkles, Utensils, Share2, Flame } from 'lucide-react'

const chips = ['Dal', 'Chawal', 'Aata', 'Tomato', 'Egg', 'Onion', 'Bread', 'Paneer']

const styles = {
  heroSection: { padding: '70px 5% 60px', maxWidth: 1100, margin: '0 auto' },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 60,
    alignItems: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#FFF0E8',
    border: '1px solid rgba(232,82,26,0.2)',
    color: '#E8521A',
    fontSize: 12,
    fontWeight: 500,
    padding: '5px 14px',
    borderRadius: 100,
    marginBottom: 18,
  },
  h1: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(34px,5vw,54px)',
    fontWeight: 800,
    lineHeight: 1.05,
    color: '#2C1810',
    marginBottom: 18,
  },
  accent: { color: '#E8521A' },
  heroSub: {
    fontSize: 15,
    color: '#5C3D2E',
    lineHeight: 1.75,
    marginBottom: 30,
    maxWidth: 440,
  },
  actions: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  trustLine: {
    marginTop: 20,
    fontSize: 12,
    color: '#5C3D2E',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  // Phone mockup
  mockupWrap: {
    display: 'flex',
    justifyContent: 'center',
    animation: 'float 4s ease-in-out infinite',
  },
  phone: {
    width: 250,
    background: '#fff',
    borderRadius: 32,
    border: '2px solid rgba(44,24,16,0.1)',
    boxShadow: '0 24px 60px rgba(44,24,16,0.15)',
    overflow: 'hidden',
  },
  phoneTop: { background: '#E8521A', padding: '14px 16px 20px' },
  phoneBar: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  phoneAppName: { fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: '#fff' },
  phoneTime: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  phoneHeadline: {
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'Syne', sans-serif",
    lineHeight: 1.3,
    marginBottom: 3,
  },
  phoneSub: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },
  phoneBody: { padding: 14 },
  chipLabel: {
    fontSize: 9,
    fontWeight: 500,
    color: '#5C3D2E',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  chipsWrap: { display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 },
  chipOn: {
    fontSize: 10,
    padding: '4px 8px',
    borderRadius: 20,
    border: '1px solid #E8521A',
    background: '#FFF0E8',
    color: '#E8521A',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  chipOff: {
    fontSize: 10,
    padding: '4px 8px',
    borderRadius: 20,
    border: '1px solid #e0e0e0',
    background: '#f5f5f5',
    color: '#888',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  genBtn: {
    width: '100%',
    background: '#E8521A',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: 9,
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
  recipeCard: { border: '1px solid #f0e8e0', borderRadius: 10, overflow: 'hidden' },
  recipeTop: {
    background: '#FFF0E8',
    padding: '10px 12px',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  recipeEmoji: { fontSize: 26 },
  recipeName: { fontSize: 11, fontWeight: 600, color: '#2C1810' },
  recipeTags: { display: 'flex', gap: 4, marginTop: 3 },
  tagGreen: { fontSize: 9, padding: '1px 6px', borderRadius: 20, background: '#d1fae5', color: '#065f46' },
  tagAmber: { fontSize: 9, padding: '1px 6px', borderRadius: 20, background: '#fef3c7', color: '#92400e' },
  recipeBottom: { padding: '8px 12px', display: 'flex', gap: 6 },
  miniBtn: {
    flex: 1,
    fontSize: 9,
    padding: 5,
    borderRadius: 6,
    border: '1px solid #e0d8d0',
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
    textAlign: 'center',
  },
  miniBtnPrimary: {
    flex: 1,
    fontSize: 9,
    padding: 5,
    borderRadius: 6,
    border: '1px solid #E8521A',
    background: '#E8521A',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
  },
}

/** Phone mockup shown in hero — interactive ingredient chips */
const PhoneMockup = () => {
  const [activeChips, setActiveChips] = useState(['Dal', 'Chawal', 'Tomato', 'Onion'])

  const toggleChip = (chip) =>
    setActiveChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    )

  return (
    <div style={styles.mockupWrap} className="mockup-wrap">
      <div style={styles.phone}>
        <div style={styles.phoneTop}>
          <div style={styles.phoneBar}>
            <span style={styles.phoneAppName}>ChefMate</span>
            <span style={styles.phoneTime}>9:41</span>
          </div>
          <div style={styles.phoneHeadline}>What's in your kitchen?</div>
          <div style={styles.phoneSub}>Tap what you have → get a recipe</div>
        </div>

        <div style={styles.phoneBody}>
          <div style={styles.chipLabel}>Tap your ingredients</div>
          <div style={styles.chipsWrap}>
            {chips.map(chip => (
              <button
                key={chip}
                style={activeChips.includes(chip) ? styles.chipOn : styles.chipOff}
                onClick={() => toggleChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          <button style={styles.genBtn} className="flex items-center justify-center gap-1"><Sparkles size={11} /> Find my recipe</button>

          <div style={styles.recipeCard}>
              <div style={styles.recipeTop}>
              <div style={styles.recipeEmoji}><Utensils size={26} color="#E8521A" /></div>
              <div>
                <div style={styles.recipeName}>Dal Tadka + Chawal</div>
                <div style={styles.recipeTags}>
                  <span style={styles.tagGreen}>12 min</span>
                  <span style={styles.tagAmber}>₹22 est.</span>
                  <span style={styles.tagGreen}>1 burner</span>
                </div>
              </div>
            </div>
            <div style={styles.recipeBottom}>
              <div style={styles.miniBtn}>Save</div>
              <div style={styles.miniBtn} className="flex items-center justify-center gap-1"><Share2 size={9} /> Share</div>
              <div style={styles.miniBtnPrimary}>Cook this</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Full hero section with copy + phone mockup */
const LandingHero = () => {
  const navigate = useNavigate()

  return (
    <section style={styles.heroSection}>
      <div style={styles.heroGrid} className="hero-grid">
        {/* Left: copy */}
        <div>
          <div className="hero-child" style={styles.badge}>
            <Flame size={12} /> Made for Indian bachelor life
          </div>
          <h1 className="hero-child" style={styles.h1}>
            1 burner.<br />
            <span style={styles.accent}>5 ingredients.</span><br />
            Real food tonight.
          </h1>
          <p className="hero-child" style={styles.heroSub}>
            Tell ChefMate what's in your PG kitchen — dal, chawal, whatever's left — and get a
            real recipe in seconds. No oven. No grinding. No Swiggy bill.
          </p>
          <div className="hero-child" style={styles.actions}>
            <button style={sharedStyles.btnPrimary} onClick={() => navigate('/app')}>
              Find my recipe →
            </button>
            <button
              style={sharedStyles.btnGhost}
              onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}
            >
              See how it works
            </button>
          </div>
          <p className="hero-child" style={styles.trustLine}>
            ✓ Free to use. No credit card. Works on any phone.
          </p>
        </div>

        {/* Right: phone mockup */}
        <PhoneMockup />
      </div>
    </section>
  )
}

export default LandingHero
