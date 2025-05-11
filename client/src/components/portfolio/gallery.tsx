import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, Photo } from "@shared/schema";
import { EnhancedLightbox } from "@/components/ui/lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

interface GalleryProps {
  category?: string;
}

// Number of images to load at once for infinite scroll
const IMAGES_PER_PAGE = 6;

export function Gallery({ category }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  
  // Ref for bottom loader element
  const { ref: bottomRef, inView } = useInView();
  
  // Fetch categories for filtering
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Fetch photos based on category or all photos
  const queryKey = category 
    ? [`/api/photos/category/${category}`] 
    : ["/api/photos"];
  
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey,
  });
  
  // Filter photos based on active category, but don't apply additional filtering if already filtered by URL
  const filteredPhotos = category
    ? photos || []
    : (photos?.filter(photo => {
        if (activeFilter === "all") return true;
        return photo.categoryId === parseInt(activeFilter);
      }) || []);
  
  // Visible photos subset for infinite loading
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  
  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(IMAGES_PER_PAGE);
  }, [activeFilter, category]);
  
  // Handle infinite scroll loading
  useEffect(() => {
    if (inView && visibleCount < filteredPhotos.length) {
      // Add more photos when scrolled to bottom
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + IMAGES_PER_PAGE, filteredPhotos.length));
      }, 300);
    }
  }, [inView, filteredPhotos.length, visibleCount]);
  
  // Update active filter when category prop changes
  useEffect(() => {
    if (category && categories) {
      const categoryObj = categories.find(cat => cat.slug === category);
      if (categoryObj) {
        setActiveFilter(categoryObj.id.toString());
      } else {
        setActiveFilter("all");
      }
    } else {
      setActiveFilter("all");
    }
    
    // Also reset visible count when category or filter changes
    setVisibleCount(IMAGES_PER_PAGE);
  }, [category, categories]);
  
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      {/* Category Filters */}
      {!category && categories && (
        <div className="flex flex-wrap justify-center mb-12 space-x-2 md:space-x-8">
          <button
            onClick={() => setActiveFilter("all")}
            className={`filter-btn px-4 py-2 text-secondary hover:text-primary transition-colors duration-300 ${
              activeFilter === "all" ? "filter-active" : ""
            }`}
          >
            All
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id.toString())}
              className={`filter-btn px-4 py-2 text-secondary hover:text-primary transition-colors duration-300 ${
                activeFilter === cat.id.toString() ? "filter-active" : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <GallerySkeleton key={index} />
          ))
        ) : visiblePhotos.length ? (
          // Actual photos with lazy loading
          visiblePhotos.map((photo, index) => (
            <GalleryItem 
              key={photo.id} 
              photo={photo} 
              index={index}
              onImageClick={() => openLightbox(index)}
            />
          ))
        ) : (
          // No photos state
          <div className="col-span-3 text-center py-10">
            <p className="text-secondary">No photos available in this category.</p>
          </div>
        )}
      </div>
      
      {/* Loader for infinite scroll */}
      {!isLoading && visibleCount < filteredPhotos.length && (
        <div ref={bottomRef} className="py-8 flex justify-center">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      )}
      
      {/* Enhanced Lightbox with navigation */}
      {filteredPhotos.length > 0 && (
        <EnhancedLightbox 
          isOpen={lightboxOpen}
          photos={filteredPhotos}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

interface GalleryItemProps {
  photo: Photo;
  index: number;
  onImageClick: () => void;
}

function GalleryItem({ photo, index, onImageClick }: GalleryItemProps) {
  // Find category name
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const category = categories?.find(cat => cat.id === photo.categoryId);
  
  // Detect when item is in view for animation
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  return (
    <motion.div 
      ref={ref}
      className="gallery-item"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div 
        className="overflow-hidden cursor-pointer gallery-img rounded-sm"
        onClick={onImageClick}
      >
        <LazyLoadImage
          src={photo.thumbnailUrl} 
          alt={photo.title}
          effect="blur"
          threshold={300}
          wrapperClassName="w-full h-64"
          className="w-full h-64 object-cover" 
          placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YyZjJmMiIvPjwvc3ZnPg=="
        />
      </div>
      <h3 className="font-poppins font-medium mt-3 text-primary">{photo.title}</h3>
      <p className="text-secondary text-sm">{category?.name || 'Uncategorized'}</p>
      {photo.location && (
        <p className="text-secondary text-sm">{photo.location}</p>
      )}
    </motion.div>
  );
}

function GallerySkeleton() {
  return (
    <div className="gallery-item">
      <Skeleton className="w-full h-64 rounded-sm" />
      <Skeleton className="h-6 w-3/4 mt-3" />
      <Skeleton className="h-4 w-1/2 mt-1" />
    </div>
  );
}
