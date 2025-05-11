import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AboutSection } from "@/components/about/about-section";
import { Testimonials } from "@/components/home/testimonials";
import { motion } from "framer-motion";

export default function AboutPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About | FotoDS - Dawid Siedlec Photography</title>
        <meta 
          name="description" 
          content="Learn about Dawid Siedlec, professional interior and architectural photographer based in Norway. With over a decade of experience capturing beautiful spaces."
        />
        <meta property="og:title" content="About | FotoDS - Dawid Siedlec Photography" />
        <meta property="og:description" content="Learn about Dawid Siedlec, professional interior and architectural photographer based in Norway. With over a decade of experience capturing beautiful spaces." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      
      <main>
        {/* About Hero */}
        <section className="pt-32 pb-12 bg-muted">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-poppins font-semibold mb-6">About Me</h1>
              <p className="text-secondary text-lg">
                Get to know the person behind the lens and my approach to interior photography.
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Content */}
        <AboutSection />

        {/* Additional About Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-poppins font-semibold mb-6">My Philosophy</h2>
                <p className="text-secondary mb-6 leading-relaxed">
                  I believe that great interior photography is about more than just documenting a space—it's about 
                  capturing its essence, character, and the feeling it evokes. Every room tells a story, and my 
                  mission is to convey that narrative through carefully composed, beautifully lit images.
                </p>
                <p className="text-secondary mb-6 leading-relaxed">
                  With each project, I strive to highlight the unique features and design elements that make a space 
                  special. Whether it's the way natural light streams through windows, the texture of materials, or 
                  the thoughtful details of interior design, I ensure these aspects shine in my photography.
                </p>
                <p className="text-secondary leading-relaxed">
                  My technical approach combines traditional photography skills with modern digital techniques, 
                  allowing me to deliver images that are both authentic to the space and optimized for their intended use, 
                  whether for real estate listings, design portfolios, or architectural publications.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />
      </main>
      
      <Footer />
    </>
  );
}
