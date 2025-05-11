import { Camera, Lightbulb, Edit } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection() {
  const features = [
    {
      icon: <Camera className="text-primary" />,
      title: "Professional Equipment",
      description: "Using top-of-the-line cameras and lenses",
    },
    {
      icon: <Lightbulb className="text-primary" />,
      title: "Lighting Expertise",
      description: "Mastering natural and artificial lighting techniques",
    },
    {
      icon: <Edit className="text-primary" />,
      title: "Post-Processing",
      description: "Advanced editing for perfect final images",
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
            <img 
              src="https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=800&h=1000" 
              alt="Dawid Siedlec - Interior Photographer" 
              className="w-full max-w-md mx-auto"
            />
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
              Hello! I'm Dawid Siedlec, a professional interior and architectural photographer based in Norway. 
              With over a decade of experience, I've developed a unique eye for capturing spaces in ways that 
              highlight their best features and create emotional connections.
            </p>
            <p className="text-secondary mb-8 leading-relaxed">
              My approach combines technical excellence with artistic vision, ensuring each image tells a 
              compelling story. I work closely with real estate professionals, interior designers, architects, 
              and homeowners to create photographs that make properties stand out.
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
