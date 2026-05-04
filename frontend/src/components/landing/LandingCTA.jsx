import React from 'react'
import { useNavigate } from 'react-router-dom'
import { sharedStyles } from './landingStyles'

const styles = {
  ctaSection: {
    padding: '100px 5%',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #FFF0E8 0%, #FDF6EE 100%)',
  },
  ctaTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(30px,5vw,50px)',
    fontWeight: 800,
    color: '#2C1810',
    marginBottom: 14,
  },
  ctaSub: { fontSize: 16, color: '#5C3D2E', marginBottom: 34 },
  ctaFree: { fontSize: 12, color: '#5C3D2E', marginTop: 14 },
}

const LandingCTA = () => {
  const navigate = useNavigate()

  return (
    <section style={styles.ctaSection}>
      <div style={styles.ctaTitle}>
        Stop ordering Swiggy.<br />Cook what you already have.
      </div>
      <p style={styles.ctaSub}>Join Indian bachelors cooking smarter with ChefMate.</p>
      <button
        style={{ ...sharedStyles.btnPrimary, fontSize: 16, padding: '16px 36px' }}
        onClick={() => navigate('/app')}
      >
        Start cooking for free →
      </button>
      <p style={styles.ctaFree}>Free forever. No signup required to try.</p>
    </section>
  )
}

export default LandingCTA
