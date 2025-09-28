import { motion } from 'framer-motion';
import heroBg from '../assets/hero-bg.png';
import heroLeft from '../assets/hero-left.png';
import heroRight from '../assets/hero-right.png';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 md:mx-8 mt-6">
      <div 
        className="relative h-64 md:h-80 bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-blue-600/10" />
        
        {/* Hero Characters */}
        <div className="absolute left-8 bottom-0 z-10">
          <img src={heroLeft} alt="Reading child" className="h-32 md:h-40" />
        </div>
        <div className="absolute right-8 bottom-0 z-10">
          <img src={heroRight} alt="Happy child with book" className="h-32 md:h-40" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to<br />Booky
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-md mx-auto">
            Discover inspiring stories & timeless knowledge, ready to borrow anytime.
          </p>
        </motion.div>

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>
      </div>
    </section>
  );
};