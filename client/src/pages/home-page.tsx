import { Helmet } from "react-helmet";
import { Hero } from "@/components/home/hero";
import { Introduction } from "@/components/home/introduction";
import { Gallery } from "@/components/portfolio/gallery";
import { AboutSection } from "@/components/about/about-section";
import { Testimonials } from "@/components/home/testimonials";
import { ContactForm } from "@/components/contact/contact-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function HomePage() {
  // Fetch featured photos for the homepage
  const { data: featuredPhotos, isLoading } = useQuery({
    queryKey: ["/api/photos/featured"],
  });

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
        
        {/* Portfolio Section */}
        <section id="portfolio" className="py-20 bg-muted">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-poppins font-semibold text-center mb-16">Portfolio</h2>
            
            <Gallery />
            
            <div className="text-center mt-16">
              <Link href="/portfolio">
                <a className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                  View All Projects
                </a>
              </Link>
            </div>
          </div>
        </section>
        
        <AboutSection />
        <Testimonials />
        <ContactForm />
      </main>
      
      <Footer />
    </>
  );
}
