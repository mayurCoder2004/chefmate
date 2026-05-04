// Shared design tokens & style objects for all landing page components

export const tokens = {
  orange: '#E8521A',
  orangeLight: '#FFF0E8',
  orangeShadow: 'rgba(232,82,26,0.3)',
  brown: '#2C1810',
  brownMid: '#5C3D2E',
  bg: '#FDF6EE',
}

export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

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
`

// Shared button styles reused across components
export const sharedStyles = {
  btnPrimary: {
    background: '#E8521A',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: 100,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 4px 20px rgba(232,82,26,0.3)',
    transition: 'all 0.2s',
  },
  btnGhost: {
    background: 'transparent',
    color: '#2C1810',
    border: '1.5px solid rgba(44,24,16,0.15)',
    padding: '13px 22px',
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  },
  sectionLabel: {
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 500,
    color: '#E8521A',
    background: '#FFF0E8',
    padding: '4px 14px',
    borderRadius: 100,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(26px,4vw,38px)',
    fontWeight: 800,
    color: '#2C1810',
  },
}
