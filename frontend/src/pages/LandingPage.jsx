import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()
  const [activeChips, setActiveChips] = useState(['Dal', 'Chawal', 'Tomato', 'Onion'])

  const chips = ['Dal', 'Chawal', 'Aata', 'Tomato', 'Egg', 'Onion', 'Bread', 'Paneer']

  const toggleChip = (chip) => {
    setActiveChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    )
  }

  // Inject Google Fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const styles = {
    root: {
      background: '#FDF6EE',
      color: '#2C1810',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
      minHeight: '100vh',
    },
    // NAV
    nav: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 5%', borderBottom: '1px solid rgba(44,24,16,0.1)',
      position: 'sticky', top: 0, background: 'rgba(253,246,238,0.95)',
      backdropFilter: 'blur(8px)', zIndex: 100,
    },
    logo: {
      fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#E8521A',
    },
    logoSpan: { color: '#2C1810' },
    navCta: {
      background: '#E8521A', color: '#fff', border: 'none',
      padding: '10px 22px', borderRadius: 100, fontSize: 13, fontWeight: 500,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
    },
    // HERO
    heroSection: { padding: '70px 5% 60px', maxWidth: 1100, margin: '0 auto' },
    heroGrid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 60, alignItems: 'center',
    },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#FFF0E8', border: '1px solid rgba(232,82,26,0.2)',
      color: '#E8521A', fontSize: 12, fontWeight: 500,
      padding: '5px 14px', borderRadius: 100, marginBottom: 18,
    },
    h1: {
      fontFamily: "'Syne', sans-serif", fontSize: 'clamp(34px,5vw,54px)',
      fontWeight: 800, lineHeight: 1.05, color: '#2C1810', marginBottom: 18,
    },
    accent: { color: '#E8521A' },
    heroSub: {
      fontSize: 15, color: '#5C3D2E', lineHeight: 1.75,
      marginBottom: 30, maxWidth: 440,
    },
    actions: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
    btnPrimary: {
      background: '#E8521A', color: '#fff', border: 'none',
      padding: '14px 28px', borderRadius: 100, fontSize: 15, fontWeight: 500,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 4px 20px rgba(232,82,26,0.3)', transition: 'all 0.2s',
    },
    btnGhost: {
      background: 'transparent', color: '#2C1810',
      border: '1.5px solid rgba(44,24,16,0.15)',
      padding: '13px 22px', borderRadius: 100, fontSize: 14, fontWeight: 500,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
    },
    trustLine: {
      marginTop: 20, fontSize: 12, color: '#5C3D2E',
      display: 'flex', alignItems: 'center', gap: 6,
    },
    // PHONE MOCKUP
    mockupWrap: {
      display: 'flex', justifyContent: 'center',
      animation: 'float 4s ease-in-out infinite',
    },
    phone: {
      width: 250, background: '#fff', borderRadius: 32,
      border: '2px solid rgba(44,24,16,0.1)',
      boxShadow: '0 24px 60px rgba(44,24,16,0.15)', overflow: 'hidden',
    },
    phoneTop: { background: '#E8521A', padding: '14px 16px 20px' },
    phoneBar: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
    phoneAppName: { fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 800, color: '#fff' },
    phoneTime: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
    phoneHeadline: { fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Syne', sans-serif", lineHeight: 1.3, marginBottom: 3 },
    phoneSub: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },
    phoneBody: { padding: 14 },
    chipLabel: { fontSize: 9, fontWeight: 500, color: '#5C3D2E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
    chipsWrap: { display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 },
    chipOn: { fontSize: 10, padding: '4px 8px', borderRadius: 20, border: '1px solid #E8521A', background: '#FFF0E8', color: '#E8521A', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif' " },
    chipOff: { fontSize: 10, padding: '4px 8px', borderRadius: 20, border: '1px solid #e0e0e0', background: '#f5f5f5', color: '#888', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif'" },
    genBtn: {
      width: '100%', background: '#E8521A', color: '#fff', border: 'none',
      borderRadius: 8, padding: 9, fontSize: 11, fontWeight: 500,
      cursor: 'pointer', marginBottom: 12, fontFamily: "'DM Sans', sans-serif",
    },
    recipeCard: { border: '1px solid #f0e8e0', borderRadius: 10, overflow: 'hidden' },
    recipeTop: { background: '#FFF0E8', padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center' },
    recipeEmoji: { fontSize: 26 },
    recipeName: { fontSize: 11, fontWeight: 600, color: '#2C1810' },
    recipeTags: { display: 'flex', gap: 4, marginTop: 3 },
    tagGreen: { fontSize: 9, padding: '1px 6px', borderRadius: 20, background: '#d1fae5', color: '#065f46' },
    tagAmber: { fontSize: 9, padding: '1px 6px', borderRadius: 20, background: '#fef3c7', color: '#92400e' },
    recipeBottom: { padding: '8px 12px', display: 'flex', gap: 6 },
    miniBtn: { flex: 1, fontSize: 9, padding: 5, borderRadius: 6, border: '1px solid #e0d8d0', background: 'transparent', color: '#888', cursor: 'pointer', textAlign: 'center' },
    miniBtnPrimary: { flex: 1, fontSize: 9, padding: 5, borderRadius: 6, border: '1px solid #E8521A', background: '#E8521A', color: '#fff', cursor: 'pointer', textAlign: 'center' },
    // HOW IT WORKS
    howSection: { padding: '80px 5%', maxWidth: 1100, margin: '0 auto' },
    sectionHead: { textAlign: 'center', marginBottom: 52 },
    sectionLabel: {
      display: 'inline-block', fontSize: 12, fontWeight: 500, color: '#E8521A',
      background: '#FFF0E8', padding: '4px 14px', borderRadius: 100, marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px,4vw,38px)',
      fontWeight: 800, color: '#2C1810',
    },
    stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 },
    stepCard: {
      background: '#fff', border: '1px solid rgba(44,24,16,0.1)',
      borderRadius: 20, padding: '28px 24px', transition: 'transform 0.2s, box-shadow 0.2s',
    },
    stepNum: { fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, color: 'rgba(232,82,26,0.12)', lineHeight: 1, marginBottom: 10 },
    stepIcon: { fontSize: 28, marginBottom: 10 },
    stepTitle: { fontSize: 15, fontWeight: 600, color: '#2C1810', marginBottom: 7 },
    stepDesc: { fontSize: 13, color: '#5C3D2E', lineHeight: 1.7 },
    // FOR WHO
    forWhoSection: { background: '#2C1810', padding: '80px 5%' },
    forWhoInner: { maxWidth: 1100, margin: '0 auto' },
    whoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginTop: 40 },
    whoCard: {
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
    },
    whoEmoji: { fontSize: 28, flexShrink: 0 },
    whoTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 },
    whoDesc: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 },
    // CTA
    ctaSection: {
      padding: '100px 5%', textAlign: 'center',
      background: 'linear-gradient(135deg, #FFF0E8 0%, #FDF6EE 100%)',
    },
    ctaTitle: {
      fontFamily: "'Syne', sans-serif", fontSize: 'clamp(30px,5vw,50px)',
      fontWeight: 800, color: '#2C1810', marginBottom: 14,
    },
    ctaSub: { fontSize: 16, color: '#5C3D2E', marginBottom: 34 },
    ctaFree: { fontSize: 12, color: '#5C3D2E', marginTop: 14 },
    // FOOTER
    footer: {
      background: '#2C1810', padding: '28px 5%',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    footerLogo: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#E8521A' },
    footerCopy: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  }

  const steps = [
    { num: '01', icon: '🛒', title: 'Tap what you have', desc: "Select ingredients from your kitchen in one tap — dal, chawal, onion, tomato, whatever's there. No typing needed." },
    { num: '02', icon: '🤖', title: 'AI builds your recipe', desc: "ChefMate's AI generates a recipe using exactly what you have — filtered for single burner, under 20 minutes, and under ₹50." },
    { num: '03', icon: '🍳', title: 'Cook it, share it', desc: 'Follow the step-by-step guide and cook. Share on WhatsApp in one tap. Save your favorites for next time.' },
  ]

  const whoCards = [
    { emoji: '🏠', title: 'PG & hostel residents', desc: 'One burner, shared kitchen, random leftovers. ChefMate works with exactly what you have.' },
    { emoji: '💼', title: 'Working professionals', desc: 'Too tired to think about dinner. Open ChefMate, tap 4 things, eat in 15 minutes.' },
    { emoji: '🎓', title: 'College students', desc: 'Budget is tight. Swiggy adds up. Cook real food for ₹20–40 with what\'s already in your room.' },
    { emoji: '🌙', title: 'Late night hunger', desc: 'Nothing\'s open, you have eggs and bread. ChefMate turns that into something decent in 10 minutes.' },
  ]

  return (
    <div style={styles.root}>
      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .hero-child { animation: fadeUp 0.6s ease both; }
        .hero-child:nth-child(1){animation-delay:0.1s}
        .hero-child:nth-child(2){animation-delay:0.2s}
        .hero-child:nth-child(3){animation-delay:0.3s}
        .hero-child:nth-child(4){animation-delay:0.4s}
        .step-card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(44,24,16,0.08); }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important}
          .steps-grid{grid-template-columns:1fr!important}
          .who-grid{grid-template-columns:1fr!important}
          .mockup-wrap{order:-1}
          .footer-inner{flex-direction:column;gap:8px;text-align:center}
        }
      `}</style>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.logo}>Chef<span style={styles.logoSpan}>Mate</span></div>
        <button style={styles.navCta} onClick={() => navigate('/app')}>Try for free →</button>
      </nav>

      {/* HERO */}
      <section style={styles.heroSection}>
        <div style={styles.heroGrid} className="hero-grid">
          <div>
            <div className="hero-child" style={styles.badge}>🔥 Made for Indian bachelor life</div>
            <h1 className="hero-child" style={styles.h1}>
              1 burner.<br />
              <span style={styles.accent}>5 ingredients.</span><br />
              Real food tonight.
            </h1>
            <p className="hero-child" style={styles.heroSub}>
              Tell ChefMate what's in your PG kitchen — dal, chawal, whatever's left — and get a real recipe in seconds. No oven. No grinding. No Swiggy bill.
            </p>
            <div className="hero-child" style={styles.actions}>
              <button style={styles.btnPrimary} onClick={() => navigate('/app')}>Find my recipe →</button>
              <button style={styles.btnGhost} onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}>See how it works</button>
            </div>
            <p className="hero-child" style={styles.trustLine}>
              ✓ Free to use. No credit card. Works on any phone.
            </p>
          </div>

          {/* PHONE MOCKUP */}
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
                    >{chip}</button>
                  ))}
                </div>
                <button style={styles.genBtn}>✨ Find my recipe</button>
                <div style={styles.recipeCard}>
                  <div style={styles.recipeTop}>
                    <div style={styles.recipeEmoji}>🍛</div>
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
                    <div style={styles.miniBtn}>📲 Share</div>
                    <div style={styles.miniBtnPrimary}>Cook this</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={styles.howSection}>
        <div style={styles.sectionHead}>
          <div style={styles.sectionLabel}>How it works</div>
          <div style={styles.sectionTitle}>From empty fridge to dinner<br />in under 60 seconds</div>
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

      {/* FOR WHO */}
      <section style={styles.forWhoSection}>
        <div style={styles.forWhoInner}>
          <div style={{ ...styles.sectionHead, marginBottom: 0 }}>
            <div style={{ ...styles.sectionLabel, background: 'rgba(232,82,26,0.2)', color: '#FF7043' }}>Who it's for</div>
            <div style={{ ...styles.sectionTitle, color: '#fff' }}>Built for real Indian kitchen situations</div>
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

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaTitle}>Stop ordering Swiggy.<br />Cook what you already have.</div>
        <p style={styles.ctaSub}>Join Indian bachelors cooking smarter with ChefMate.</p>
        <button style={{ ...styles.btnPrimary, fontSize: 16, padding: '16px 36px' }} onClick={() => navigate('/app')}>
          Start cooking for free →
        </button>
        <p style={styles.ctaFree}>Free forever. No signup required to try.</p>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer} className="footer-inner">
        <div style={styles.footerLogo}>ChefMate</div>
        <div style={styles.footerCopy}>Built with ❤️ by Mayur Pawar</div>
      </footer>
    </div>
  )
}

export default LandingPage