import React from 'react'
import { useNavigate } from 'react-router-dom'

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 5%',
    borderBottom: '1px solid rgba(44,24,16,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(253,246,238,0.95)',
    backdropFilter: 'blur(8px)',
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: '#E8521A',
  },
  logoSpan: { color: '#2C1810' },
  navCta: {
    background: '#E8521A',
    color: '#fff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  },
}

const LandingNav = () => {
  const navigate = useNavigate()

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        Chef<span style={styles.logoSpan}>Mate</span>
      </div>
      <button style={styles.navCta} onClick={() => navigate('/app')}>
        Try for free →
      </button>
    </nav>
  )
}

export default LandingNav
