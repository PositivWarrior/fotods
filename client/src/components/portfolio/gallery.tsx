import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, Photo } from "@shared/schema";
import { Lightbox } from "@/components/ui/lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface GalleryProps {
  category?: string;
}

export function Gallery({ category }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ src: "", alt: "" });
  
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
  
  // Filter photos based on active category
  const filteredPhotos = photos?.filter(photo => {
    if (activeFilter === "all") return true;
    return photo.categoryId === parseInt(activeFilter);
  });
  
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
  }, [category, categories]);
  
  const openLightbox = (photo: Photo) => {
    setCurrentImage({
      src: photo.imageUrl,
      alt: photo.title
    });
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
        ) : filteredPhotos?.length ? (
          // Actual photos
          filteredPhotos.map((photo, index) => (
            <GalleryItem 
              key={photo.id} 
              photo={photo} 
              index={index}
              onImageClick={() => openLightbox(photo)}
            />
          ))
        ) : (
          // No photos state
          <div className="col-span-3 text-center py-10">
            <p className="text-secondary">No photos available in this category.</p>
          </div>
        )}
      </div>
      
      {/* Lightbox for viewing large images */}
      <Lightbox 
        isOpen={lightboxOpen}
        imgSrc={currentImage.src}
        imgAlt={currentImage.alt}
        onClose={() => setLightboxOpen(false)}
      />
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
  
  return (
    <motion.div 
      className="gallery-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div 
        className="overflow-hidden cursor-pointer gallery-img"
        onClick={onImageClick}
      >
        <img 
          src={photo.thumbnailUrl} 
          alt={photo.title} 
          className="w-full h-64 object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="font-poppins font-medium mt-3">{photo.title}</h3>
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
      <Skeleton className="w-full h-64" />
      <Skeleton className="h-6 w-3/4 mt-3" />
      <Skeleton className="h-4 w-1/2 mt-1" />
    </div>
  );
}
