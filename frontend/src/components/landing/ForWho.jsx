import React from 'react'
import { sharedStyles } from './landingStyles'

const whoCards = [
  {
    emoji: '🏠',
    title: 'PG & hostel residents',
    desc: 'One burner, shared kitchen, random leftovers. ChefMate works with exactly what you have.',
  },
  {
    emoji: '💼',
    title: 'Working professionals',
    desc: 'Too tired to think about dinner. Open ChefMate, tap 4 things, eat in 15 minutes.',
  },
  {
    emoji: '🎓',
    title: 'College students',
    desc: "Budget is tight. Swiggy adds up. Cook real food for ₹20–40 with what's already in your room.",
  },
  {
    emoji: '🌙',
    title: 'Late night hunger',
    desc: "Nothing's open, you have eggs and bread. ChefMate turns that into something decent in 10 minutes.",
  },
]

const styles = {
  forWhoSection: { background: '#2C1810', padding: '80px 5%' },
  forWhoInner: { maxWidth: 1100, margin: '0 auto' },
  sectionHead: { textAlign: 'center', marginBottom: 0 },
  sectionLabel: {
    ...sharedStyles.sectionLabel,
    background: 'rgba(232,82,26,0.2)',
    color: '#FF7043',
  },
  sectionTitle: { ...sharedStyles.sectionTitle, color: '#fff' },
  whoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: 14,
    marginTop: 40,
  },
  whoCard: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '18px 20px',
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
  },
  whoEmoji: { fontSize: 28, flexShrink: 0 },
  whoTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 },
  whoDesc: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 },
}

const ForWho = () => (
  <section style={styles.forWhoSection}>
    <div style={styles.forWhoInner}>
      <div style={styles.sectionHead}>
        <div style={styles.sectionLabel}>Who it's for</div>
        <div style={styles.sectionTitle}>Built for real Indian kitchen situations</div>
      </div>

      <div style={styles.whoGrid} className="who-grid">
        {whoCards.map(w => (
          <div key={w.title} style={styles.whoCard}>
            <div style={styles.whoEmoji}>{w.emoji}</div>
            <div>
              <div style={styles.whoTitle}>{w.title}</div>
              <div style={styles.whoDesc}>{w.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default ForWho
