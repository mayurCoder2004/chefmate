import React from 'react'

const styles = {
  footer: {
    background: '#2C1810',
    padding: '28px 5%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogo: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: '#E8521A',
  },
  footerCopy: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
}

const LandingFooter = () => (
  <footer style={styles.footer} className="footer-inner">
    <div style={styles.footerLogo}>ChefMate</div>
    <div style={styles.footerCopy}>Built with ❤️ by Mayur Pawar</div>
  </footer>
)

export default LandingFooter
