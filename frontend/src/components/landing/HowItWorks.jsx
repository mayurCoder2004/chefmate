import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ChefHat, ArrowRight } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Sparkles,
    title: 'Select Your Ingredients',
    desc: 'Tap what you have in your kitchen. No typing needed. Just select from common ingredients or add your own.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
  },
  {
    num: '02',
    icon: Zap,
    title: 'AI Creates Your Recipe',
    desc: 'Our AI instantly generates a personalized recipe using exactly what you have. Optimized for single burner cooking.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
  },
  {
    num: '03',
    icon: ChefHat,
    title: 'Cook & Enjoy',
    desc: 'Follow step-by-step instructions with cook mode. Share your creation or save it for later. That simple.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 rounded-full mb-6">
            <Zap size={16} className="text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">How It Works</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            From Kitchen to Table in
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No complicated processes. No endless scrolling. Just real food, real fast.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative group"
            >
              {/* Connecting line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent -translate-x-1/2 z-0">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.3, duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 origin-left"
                  />
                </div>
              )}

              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:-translate-y-2">
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{step.num}</span>
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${step.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <step.icon size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>

                {/* Hover arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="mt-6 flex items-center gap-2 text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Learn more
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16 lg:mt-24"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-3xl border border-orange-200/50 shadow-xl">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to start cooking?</h3>
              <p className="text-gray-600">Join thousands of home cooks making real food every day</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              Get Started Free
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
