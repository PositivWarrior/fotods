import { Link } from "wouter";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen">
      <div className="absolute inset-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1920&h=1080" 
          alt="Interior photography by FotoDS" 
          className="w-full h-full object-cover opacity-80" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
      
      <div className="relative container mx-auto px-6 h-screen flex flex-col justify-center">
        <motion.div 
          className="max-w-3xl text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
      
      <div className="scroll-downs">
        <div className="mousey">
          <div className="scroller"></div>
        </div>
      </div>
    </section>
  );
}
