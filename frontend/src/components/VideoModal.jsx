import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, videoSrc, desktopVideoSrc }) => {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else {
      document.body.style.overflow = 'unset';
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const currentVideoSrc = isMobile ? videoSrc : (desktopVideoSrc || videoSrc);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 md:bg-black/85 backdrop-blur-md md:backdrop-blur-xl"
          />

          {/* Responsive Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative w-full max-w-sm md:max-w-6xl mx-auto z-10 max-h-[90vh] md:max-h-none flex items-center justify-center"
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute -top-12 right-0 md:-top-14 md:-right-14 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm md:backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 z-20 shadow-lg"
              aria-label="Close video"
            >
              <X size={22} className="md:w-6 md:h-6" />
            </motion.button>

            {/* Video container with responsive aspect ratios */}
            <div className="relative bg-black md:bg-gradient-to-b md:from-gray-900 md:to-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl w-full">
              {/* Mobile: Vertical Reel Style (9:16) with height constraint */}
              <div className="relative w-full md:hidden" style={{ 
                aspectRatio: '9/16',
                maxHeight: 'calc(90vh - 4rem)'
              }}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  controlsList="nodownload"
                  playsInline
                  preload="metadata"
                  key={currentVideoSrc}
                >
                  <source src={currentVideoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Desktop: Landscape Cinematic Style (16:9) */}
              <div className="hidden md:block relative w-full" style={{ paddingBottom: '56.25%' }}>
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-contain"
                  controls
                  controlsList="nodownload"
                  playsInline
                  preload="metadata"
                  key={currentVideoSrc}
                >
                  <source src={currentVideoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Decorative glow - responsive positioning */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-500/30 via-pink-500/20 to-purple-500/30 md:bg-gradient-to-r md:from-orange-500/20 md:via-pink-500/20 md:to-purple-500/20 blur-3xl rounded-3xl" />
            <div className="absolute top-1/4 -left-6 md:-left-8 w-24 h-24 md:w-32 md:h-32 bg-orange-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-1/4 -right-6 md:-right-8 w-24 h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
