import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { motion } from "framer-motion";

export default function ContactPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact | FotoDS - Dawid Siedlec Photography</title>
        <meta 
          name="description" 
          content="Get in touch with Dawid Siedlec for professional interior photography services. Inquire about bookings, pricing, and availability for your project."
        />
        <meta property="og:title" content="Contact | FotoDS - Dawid Siedlec Photography" />
        <meta property="og:description" content="Get in touch with Dawid Siedlec for professional interior photography services. Inquire about bookings, pricing, and availability for your project." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      
      <main>
        {/* Contact Hero */}
        <section className="pt-32 pb-12 bg-muted">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-poppins font-semibold mb-6">Get In Touch</h1>
              <p className="text-secondary text-lg">
                Have a project in mind? I'd love to hear from you. Reach out to discuss your interior photography needs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form */}
        <ContactForm />

        {/* Map Section */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-poppins font-semibold text-center mb-8">Find Us</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.1045309045366!2d10.738457876752746!3d59.91274497490568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e7d3b093ed1%3A0x2a42d4bc6eb44d9a!2sKarl%20Johans%20gate%207%2C%200154%20Oslo%2C%20Norway!5e0!3m2!1sen!2sus!4v1687959899079!5m2!1sen!2sus" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FotoDS Office Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
