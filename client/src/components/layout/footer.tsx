import { Link } from "wouter";
import { Instagram, Facebook, Linkedin, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-poppins font-semibold tracking-wider mb-6 block">
              FotoDS
            </Link>
            <p className="text-white/80 mb-6 max-w-sm">
              Specialized interior photography services capturing the essence of architectural spaces. 
              Bringing interiors to life through the lens.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white/80 hover:text-white transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link href="/portfolio/housing" className="text-white/80 hover:text-white transition-colors">Housing</Link>
              </li>
              <li>
                <Link href="/portfolio/business" className="text-white/80 hover:text-white transition-colors">Business</Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Created and Developed by</h3>
            <p className="text-white/80 mb-2">Kacper Margol</p>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://linkedin.com/in/kacper-margol" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/kacpermargol" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://kacpermargol.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Globe size={16} />
                  <span>Portfolio</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} FotoDS. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-white/60 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 text-sm hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
