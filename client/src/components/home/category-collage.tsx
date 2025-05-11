import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category, Photo } from "@shared/schema";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CategoryCollage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: photos, isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  // Specifically use only the main categories: Housing, Lifestyle, Business
  const mainCategoryNames = ["Housing", "Lifestyle", "Business"];
  const mainCategories = categories?.filter(
    cat => mainCategoryNames.includes(cat.name)
  ) || [];
  
  if (categoriesLoading || photosLoading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-6">
          <div className="py-10 text-center text-muted-foreground">Loading gallery content...</div>
        </div>
      </section>
    );
  }

  // Returns photos for a given category and its subcategories
  const getCategoryPhotos = (categoryId: number, limit = 4) => {
    // Get direct photos of this category
    const directPhotos = photos?.filter(photo => photo.categoryId === categoryId) || [];
    
    // Find subcategories
    const subCategories = categories?.filter(cat => 
      cat.parentCategory === categories.find(c => c.id === categoryId)?.slug
    ) || [];
    
    // Get photos from subcategories
    const subCategoryPhotos = subCategories.flatMap(subCat => 
      photos?.filter(photo => photo.categoryId === subCat.id) || []
    );
    
    // Combine and limit to exactly the requested amount
    const combined = [...directPhotos, ...subCategoryPhotos];
    return combined.length > limit ? combined.slice(0, limit) : combined;
  };

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-poppins font-semibold text-center mb-16">Our Photography Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {mainCategories.map((category) => {
            const categoryPhotos = getCategoryPhotos(category.id, 4);
            
            if (categoryPhotos.length === 0) return null;
            
            // Main photo is first, smaller ones are the next three
            const mainPhoto = categoryPhotos[0];
            const smallPhotos = categoryPhotos.slice(1, 4);
            
            return (
              <motion.div 
                key={category.id}
                className="flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-poppins font-medium mb-5 text-primary">{category.name}</h3>
                
                {/* Main photo on top with frame */}
                <div className="mb-3 p-1 bg-black">
                  <div className="overflow-hidden">
                    <img 
                      src={mainPhoto.thumbnailUrl} 
                      alt={mainPhoto.title}
                      className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                {/* Three smaller photos at the bottom */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {smallPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="p-1 bg-black overflow-hidden"
                    >
                      <img 
                        src={photo.thumbnailUrl} 
                        alt={photo.title}
                        className="w-full h-24 object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Link to the specific category, not the main portfolio */}
                <Link 
                  href={`/portfolio?category=${category.slug}`}
                  className="inline-flex items-center mt-auto text-primary hover:text-secondary font-medium transition-colors"
                >
                  <span>View {category.name} Gallery</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}