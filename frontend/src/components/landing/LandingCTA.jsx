import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

const LandingCTA = () => {
  const navigate = useNavigate();

  const benefits = [
    'No credit card required',
    'Start cooking in 30 seconds',
    'Free forever',
    'Works on any device',
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main CTA card */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 lg:p-16 shadow-2xl border border-gray-200/50 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl opacity-10 blur-xl"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl opacity-10 blur-xl"
            />

            <div className="relative text-center space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 rounded-full"
              >
                <Sparkles size={16} className="text-orange-600" />
                <span className="text-sm font-semibold text-orange-600">Join 100+ Home Cooks</span>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Stop Ordering.
                  <br />
                  <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Start Cooking.
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Turn whatever's in your kitchen into a delicious meal. No signup required. Completely free.
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-6"
              >
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/app')}
                  className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
                >
                  Get Started Free
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-10 py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  Create Account
                </motion.button>
              </motion.div>

              {/* Trust indicator */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-500"
              >
                Helping home cooks make real food every day
              </motion.p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl opacity-20 blur-2xl" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl opacity-20 blur-2xl" />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <a href="#" className="hover:text-gray-700 transition-colors">Contact Us</a>
          </div>
          <p className="mt-6 text-gray-400">
            © 2024 ChefMate. Made with love for home cooks.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCTA;
