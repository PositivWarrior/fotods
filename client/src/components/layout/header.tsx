import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { motion } from "framer-motion";
import logoImage from "../../assets/logo_no_bg.png";

type NavItemWithChildren = {
  name: string;
  href: string;
  children?: Array<{ name: string; href: string }>;
};

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { user, logoutMutation } = useAuth();

  // Fetch all categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const mainCategories = categories?.filter(cat => !cat.parentCategory) || [];
  const subcategories = categories?.filter(cat => cat.parentCategory) || [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && 
          dropdownRefs.current[activeDropdown] && 
          !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Organize navigation with dropdowns
  let navigation: NavItemWithChildren[] = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { 
      name: "Housing", 
      href: "/portfolio/housing",
      children: subcategories
        .filter(sub => sub.parentCategory === "housing")
        .map(cat => ({
          name: cat.name,
          href: `/portfolio/${cat.slug}`
        }))
    },
    { 
      name: "Business", 
      href: "/portfolio/business" 
    },
    { 
      name: "Lifestyle", 
      href: "/portfolio/lifestyle",
      children: subcategories
        .filter(sub => sub.parentCategory === "lifestyle")
        .map(cat => ({
          name: cat.name,
          href: `/portfolio/${cat.slug}`
        }))
    },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Add admin panel link for logged-in users
  if (user) {
    navigation = [
      ...navigation,
      { 
        name: "Admin", 
        href: "/admin", 
        children: [
          { name: "Dashboard", href: "/admin" },
          { name: "Photos", href: "/admin/photos" },
          { name: "Categories", href: "/admin/categories" },
          { name: "Testimonials", href: "/admin/testimonials" },
          { name: "Messages", href: "/admin/messages" }
        ]
      }
    ];
  }

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header 
      className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-[hsl(84,25%,95%)]/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9">
              <motion.img 
                src={logoImage} 
                alt="FotoDS Logo"
                className="h-full w-full" 
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
            <span className="text-2xl font-poppins font-semibold tracking-wider">FotoDS</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <div key={item.name} className="relative inline-block">
                {item.children ? (
                  <div 
                    ref={el => dropdownRefs.current[item.name] = el}
                    className="inline-block"
                  >
                    <button
                      className={`flex items-center space-x-1 ${
                        isActive(item.href) 
                          ? "text-primary" 
                          : "text-secondary hover:text-primary"
                      } transition-colors duration-300`}
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {activeDropdown === item.name && (
                      <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link 
                          href={item.href}
                          className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
                        >
                          All {item.name}
                        </Link>
                        {item.children.map(child => (
                          <Link 
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href={item.href}
                    className={`${
                      isActive(item.href) 
                        ? "text-primary" 
                        : "text-secondary hover:text-primary"
                    } transition-colors duration-300`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
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
                {item.children ? (
                  <>
                    <button
                      className={`flex items-center space-x-1 mx-auto ${
                        isActive(item.href) 
                          ? "text-primary" 
                          : "text-secondary hover:text-primary"
                      } transition-colors duration-300`}
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {activeDropdown === item.name && (
                      <div className="bg-gray-50 py-2 mt-2 space-y-2">
                        <div>
                          <Link 
                            href={item.href}
                            className="block text-secondary hover:text-primary"
                          >
                            All {item.name}
                          </Link>
                        </div>
                        {item.children.map(child => (
                          <div key={child.name}>
                            <Link 
                              href={child.href}
                              className="block text-secondary hover:text-primary"
                            >
                              {child.name}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
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
                )}
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
