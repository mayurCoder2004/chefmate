import React from 'react'
import { sharedStyles } from './landingStyles'

const steps = [
  {
    num: '01',
    icon: '🛒',
    title: 'Tap what you have',
    desc: "Select ingredients from your kitchen in one tap — dal, chawal, onion, tomato, whatever's there. No typing needed.",
  },
  {
    num: '02',
    icon: '🤖',
    title: 'AI builds your recipe',
    desc: "ChefMate's AI generates a recipe using exactly what you have — filtered for single burner, under 20 minutes, and under ₹50.",
  },
  {
    num: '03',
    icon: '🍳',
    title: 'Cook it, share it',
    desc: 'Follow the step-by-step guide and cook. Share on WhatsApp in one tap. Save your favorites for next time.',
  },
]

const styles = {
  howSection: { padding: '80px 5%', maxWidth: 1100, margin: '0 auto' },
  sectionHead: { textAlign: 'center', marginBottom: 52 },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 24,
  },
  stepCard: {
    background: '#fff',
    border: '1px solid rgba(44,24,16,0.1)',
    borderRadius: 20,
    padding: '28px 24px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  stepNum: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 48,
    fontWeight: 800,
    color: 'rgba(232,82,26,0.12)',
    lineHeight: 1,
    marginBottom: 10,
  },
  stepIcon: { fontSize: 28, marginBottom: 10 },
  stepTitle: { fontSize: 15, fontWeight: 600, color: '#2C1810', marginBottom: 7 },
  stepDesc: { fontSize: 13, color: '#5C3D2E', lineHeight: 1.7 },
}

const HowItWorks = () => (
  <section id="how" style={styles.howSection}>
    <div style={styles.sectionHead}>
      <div style={sharedStyles.sectionLabel}>How it works</div>
      <div style={sharedStyles.sectionTitle}>
        From empty fridge to dinner<br />in under 60 seconds
      </div>
    </div>

    <div style={styles.stepsGrid} className="steps-grid">
      {steps.map(s => (
        <div key={s.num} style={styles.stepCard} className="step-card-hover">
          <div style={styles.stepNum}>{s.num}</div>
          <div style={styles.stepIcon}>{s.icon}</div>
          <div style={styles.stepTitle}>{s.title}</div>
          <div style={styles.stepDesc}>{s.desc}</div>
        </div>
      ))}
    </div>
  </section>
)

export default HowItWorks
