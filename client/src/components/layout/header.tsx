import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header 
      className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-poppins font-semibold tracking-wider">
            FotoDS
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`${
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-secondary hover:text-primary"
                } transition-colors duration-300`}
              >
                {item.name}
              </Link>
            ))}
            
            {user?.isAdmin && (
              <Link 
                href="/admin"
                className={`${
                  location.startsWith("/admin") 
                    ? "text-primary" 
                    : "text-secondary hover:text-primary"
                } transition-colors duration-300`}
              >
                Admin
              </Link>
            )}
            
            {user ? (
              <Button 
                variant="ghost" 
                className="text-secondary hover:text-primary hover:bg-transparent p-0"
                onClick={() => logoutMutation.mutate()}
              >
                Logout
              </Button>
            ) : (
              <Link
                href="/auth"
                className="text-secondary hover:text-primary transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 space-y-4 mt-4">
            {navigation.map((item) => (
              <div key={item.name} className="text-center">
                <Link 
                  href={item.href}
                  className={`${
                    isActive(item.href) 
                      ? "text-primary" 
                      : "text-secondary hover:text-primary"
                  } transition-colors duration-300`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </div>
            ))}
            
            {user?.isAdmin && (
              <div className="text-center">
                <Link 
                  href="/admin"
                  className={`${
                    location.startsWith("/admin") 
                      ? "text-primary" 
                      : "text-secondary hover:text-primary"
                  } transition-colors duration-300`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            )}
            
            {user ? (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  className="text-secondary hover:text-primary hover:bg-transparent p-0"
                  onClick={() => {
                    logoutMutation.mutate();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Link
                  href="/auth"
                  className="text-secondary hover:text-primary transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
