import React, { useEffect } from 'react'
import { globalCSS } from '../components/landing/landingStyles'
import LandingNav from '../components/landing/LandingNav'
import LandingHero from '../components/landing/LandingHero'
import HowItWorks from '../components/landing/HowItWorks'
import ForWho from '../components/landing/ForWho'
import LandingCTA from '../components/landing/LandingCTA'
import LandingFooter from '../components/landing/LandingFooter'

const pageStyles = {
  background: '#FDF6EE',
  color: '#2C1810',
  fontFamily: "'DM Sans', sans-serif",
  overflowX: 'hidden',
  minHeight: '100vh',
  paddingTop: '80px',
}

const LandingPage = () => {
  // Inject Google Fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <div style={pageStyles}>
      {/* Global CSS: keyframes + media queries */}
      <style>{globalCSS}</style>

      <LandingNav />
      <LandingHero />
      <HowItWorks />
      <ForWho />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}

export default LandingPage
