import { Camera, Lightbulb, Edit } from "lucide-react";
import { motion } from "framer-motion";
import dawidImage from "../../assets/Dawid_hero.jpg";

export function AboutSection() {
  const features = [
    {
      icon: <Camera className="text-primary" />,
      title: "Professional Equipment",
      description: "Canon professional cameras and premium lenses for exceptional image quality",
    },
    {
      icon: <Lightbulb className="text-primary" />,
      title: "Lighting Mastery",
      description: "Expert control of natural and artificial lighting to showcase spaces at their best",
    },
    {
      icon: <Edit className="text-primary" />,
      title: "Precision Editing",
      description: "Meticulous post-processing to achieve perfect color, contrast and composition",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl max-w-md mx-auto border-2 border-accent/20">
              <motion.img 
                src={dawidImage} 
                alt="Dawid Siedlec - Interior Photographer" 
                className="w-full h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-poppins font-semibold mb-6">About Me</h2>
            <p className="text-secondary mb-6 leading-relaxed">
              Hello! I'm <span className="font-semibold text-primary">Dawid Siedlec</span>, a passionate interior and architectural photographer based in Norway. 
              With over a decade of experience capturing spaces, I've developed a keen eye for detail and composition that brings out the true character and beauty
              of each environment I photograph.
            </p>
            <p className="text-secondary mb-6 leading-relaxed">
              My approach combines technical precision with artistic vision, ensuring each image tells a 
              compelling visual story. Every space has its own unique atmosphere and personality - my job is to capture
              that essence in a way that resonates with viewers.
            </p>
            <p className="text-secondary mb-8 leading-relaxed">
              I work closely with real estate professionals, interior designers, architects, business owners, and homeowners
              to create photographs that not only showcase properties but also evoke emotion and create lasting impressions.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-poppins font-medium">{feature.title}</h3>
                    <p className="text-secondary text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <a 
              href="#contact" 
              className="inline-block px-8 py-3 bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
