import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Check, Zap } from 'lucide-react';
import VideoModal from '../VideoModal';
import demoVideo from '../../assets/chefmate-demo.mp4';
import demoVideoDesktop from '../../assets/chefmate-demo-desktop.mp4';

const FloatingCard = ({ delay = 0, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const AnimatedPhoneMockup = () => {
  const [activeChips, setActiveChips] = useState(['Dal', 'Chawal', 'Tomato', 'Onion']);
  const chips = ['Dal', 'Chawal', 'Aata', 'Tomato', 'Egg', 'Onion', 'Bread', 'Paneer'];

  const toggleChip = (chip) => {
    setActiveChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Floating gradient orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Phone mockup */}
      <div className="relative w-72 mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-900 overflow-hidden transform hover:scale-105 transition-transform duration-500">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-10" />
          
          {/* Screen */}
          <div className="relative bg-gradient-to-br from-orange-50 to-orange-100/50 pt-8">
            {/* Status bar */}
            <div className="px-6 py-2 flex justify-between items-center text-xs text-gray-600">
              <span className="font-semibold">9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
              </div>
            </div>

            {/* App header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600">
              <h3 className="text-white font-bold text-lg mb-1">Smart Recipe</h3>
              <p className="text-white/90 text-xs">What's in your kitchen?</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 min-h-[400px]">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip, i) => (
                    <motion.button
                      key={chip}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      onClick={() => toggleChip(chip)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        activeChips.includes(chip)
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md scale-105'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                      }`}
                    >
                      {chip}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                Find My Recipe
              </motion.button>

              {/* Recipe preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Dal Tadka + Chawal</h4>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">12 min</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">₹22</span>
                  </div>
                </div>
                <div className="p-3 flex gap-2">
                  <button className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg">Save</button>
                  <button className="flex-1 py-2 text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">Cook</button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LandingHero = () => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <FloatingCard delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-full shadow-sm">
                <Zap size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">AI-Powered Recipe Generator</span>
              </div>
            </FloatingCard>

            <FloatingCard delay={0.2}>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Cook Real Food
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Tonight
                </span>
              </h1>
            </FloatingCard>

            <FloatingCard delay={0.3}>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                Turn whatever's in your kitchen into a delicious meal. No fancy ingredients, no complicated steps. Just real food in minutes.
              </p>
            </FloatingCard>

            <FloatingCard delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/app')}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                >
                  Get Started Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-white hover:border-gray-300 transition-all duration-300 flex items-center gap-3"
                >
                  <Play size={20} />
                  Watch Demo
                </motion.button>
              </div>
            </FloatingCard>

            <FloatingCard delay={0.5}>
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  'No signup required',
                  'Works on any device',
                  'Free forever'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check size={14} className="text-green-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </FloatingCard>

            <FloatingCard delay={0.6}>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Recipes Created</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">300+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                  <div className="text-sm text-gray-600">Forever</div>
                </div>
              </div>
            </FloatingCard>
          </div>

          {/* Right mockup */}
          <div className="relative lg:block hidden">
            <AnimatedPhoneMockup />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc={demoVideo}
        desktopVideoSrc={demoVideoDesktop}
      />
    </section>
  );
};

export default LandingHero;
