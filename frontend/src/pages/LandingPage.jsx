import React from 'react';
import LandingNav from '../components/landing/LandingNav';
import LandingHero from '../components/landing/LandingHero';
import HowItWorks from '../components/landing/HowItWorks';
import ForWho from '../components/landing/ForWho';
import LandingCTA from '../components/landing/LandingCTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <LandingHero />
      <HowItWorks />
      <ForWho />
      <LandingCTA />
    </div>
  );
};

export default LandingPage;
