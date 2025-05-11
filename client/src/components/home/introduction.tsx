import { motion } from "framer-motion";

export function Introduction() {
  const stats = [
    { value: "150+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "10+", label: "Years Experience" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-poppins font-semibold mb-6">Welcome to FotoDS</h2>
          <p className="text-secondary text-lg leading-relaxed mb-10">
            Specializing in interior and architectural photography, I create stunning visual narratives 
            that showcase properties in their best light. With meticulous attention to composition, 
            lighting, and detail, my images help properties stand out in a competitive market.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="block text-4xl font-semibold mb-2">{stat.value}</span>
                <span className="text-secondary">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
