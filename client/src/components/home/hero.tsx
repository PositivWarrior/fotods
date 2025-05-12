import { Link } from "wouter";
import { motion } from "framer-motion";
import logoImage from "../../assets/Logo_solo.png";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen">
      <div className="absolute inset-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1920&h=1080" 
          alt="Nighttime house photography by FotoDS" 
          className="w-full h-full object-cover opacity-85" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
      
      <div className="relative container mx-auto px-6 h-screen flex flex-col justify-center items-center">
        {/* Logo animation */}
        <motion.div
          className="mb-8 w-32 h-32 md:w-40 md:h-40"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 12,
            delay: 0.3,
            duration: 1.2
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: 15,
            transition: { duration: 0.5 }
          }}
        >
          <img 
            src={logoImage} 
            alt="FotoDS Logo" 
            className="w-full h-full logo-white" 
          />
        </motion.div>
        
        <motion.div 
          className="max-w-3xl text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-poppins font-semibold leading-tight mb-6">
            Capturing the essence of interior spaces
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90">
            Professional interior photography by Dawid Siedlec
          </p>
          <Link href="/contact" className="inline-block bg-primary text-white px-8 py-3 font-medium rounded-none hover:bg-secondary transition-colors duration-300">
            Contact Me
          </Link>
        </motion.div>
      </div>
      
      <motion.div 
        className="scroll-downs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="mousey">
          <div className="scroller"></div>
        </div>
      </motion.div>
    </section>
  );
}
