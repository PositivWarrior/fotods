import { Helmet } from "react-helmet";
import { Hero } from "@/components/home/hero";
import { Introduction } from "@/components/home/introduction";
import { CategoryCollage } from "@/components/home/category-collage";
import { AboutSection } from "@/components/about/about-section";
import { Testimonials } from "@/components/home/testimonials";
import { ContactForm } from "@/components/contact/contact-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function HomePage() {

  return (
    <>
      <Helmet>
        <title>FotoDS | Dawid Siedlec - Professional Interior Photography</title>
        <meta 
          name="description" 
          content="Professional interior photography services by Dawid Siedlec. Specializing in real estate, architecture, and interior design photography in Norway."
        />
        <meta property="og:title" content="FotoDS | Dawid Siedlec - Professional Interior Photography" />
        <meta property="og:description" content="Professional interior photography services by Dawid Siedlec. Specializing in real estate, architecture, and interior design photography in Norway." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fotods.no" />
      </Helmet>

      <Header />
      
      {/* Main Content */}
      <main>
        <Hero />
        <Introduction />
        
        {/* Category Collage Section */}
        <CategoryCollage />
        
        <AboutSection />
        <Testimonials />
        <ContactForm />
      </main>
      
      <Footer />
    </>
  );
}
