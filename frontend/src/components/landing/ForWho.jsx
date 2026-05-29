import React from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, GraduationCap, Clock, Check } from 'lucide-react';

const personas = [
  {
    icon: Home,
    title: 'PG & Hostel Residents',
    desc: 'Limited kitchen space? Shared burner? No problem. Cook real meals with whatever you have.',
    features: ['Single burner recipes', 'Minimal equipment', 'Quick cleanup'],
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    icon: Briefcase,
    title: 'Working Professionals',
    desc: 'Too tired to think about dinner? Let AI do the planning. Just cook and eat.',
    features: ['15-minute meals', 'No meal prep', 'Budget-friendly'],
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
  },
  {
    icon: GraduationCap,
    title: 'College Students',
    desc: 'Tight budget? Skip the delivery apps. Cook for ₹20-40 with what you already have.',
    features: ['Under ₹50 meals', 'Simple ingredients', 'No cooking skills needed'],
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
  },
  {
    icon: Clock,
    title: 'Late Night Cravings',
    desc: 'Everything closed? Turn eggs and bread into something delicious in 10 minutes.',
    features: ['Quick recipes', 'Common ingredients', 'Midnight-friendly'],
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
  },
];

const ForWho = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <span className="text-sm font-semibold text-white">Perfect For</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Built for Real
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent"> Kitchen Situations</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're in a PG, working late, or just tired of ordering food, ChefMate has you covered.
          </p>
        </motion.div>

        {/* Persona cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {personas.map((persona, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative"
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${persona.bgGradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${persona.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <persona.icon size={32} className="text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{persona.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">{persona.desc}</p>

                {/* Features */}
                <div className="space-y-3">
                  {persona.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className={`w-5 h-5 bg-gradient-to-br ${persona.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${persona.gradient} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity duration-500 -z-10`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 lg:mt-24"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-gray-300 font-medium">Recipes Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  300+
                </div>
                <div className="text-gray-300 font-medium">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  ₹30
                </div>
                <div className="text-gray-300 font-medium">Avg. Meal Cost</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForWho;
