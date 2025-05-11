import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category, Photo } from "@shared/schema";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function CategoryCollage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: photos, isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  // Group main categories
  const mainCategories = categories?.filter(cat => !cat.parentCategory) || [];
  
  if (categoriesLoading || photosLoading) {
    return <div className="py-10">Loading categories...</div>;
  }

  // Returns first 3 photos for a given category or subcategory
  const getCategoryPhotos = (categoryId: number, limit = 3) => {
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
    
    // Combine and limit
    return [...directPhotos, ...subCategoryPhotos].slice(0, limit);
  };

  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-poppins font-semibold text-center mb-16">Our Photography Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {mainCategories.map((category) => {
            const categoryPhotos = getCategoryPhotos(category.id);
            
            if (categoryPhotos.length === 0) return null;
            
            return (
              <motion.div 
                key={category.id}
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-poppins font-medium mb-6 text-primary">{category.name}</h3>
                
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {categoryPhotos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className={`
                        overflow-hidden ${index === 0 ? 'col-span-3 h-52' : 'col-span-1 h-24'}
                      `}
                    >
                      <img 
                        src={photo.thumbnailUrl} 
                        alt={photo.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
                
                <Link 
                  href={`/portfolio?category=${category.slug}`}
                  className="flex items-center mt-auto text-primary hover:text-amber-700 font-medium transition-colors"
                >
                  <span>View {category.name} Gallery</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}