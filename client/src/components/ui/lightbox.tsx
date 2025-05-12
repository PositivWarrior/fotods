import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, ReactNode } from "react";
import YetAnotherLightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Photo } from "@shared/schema";

// Create a type to define the expected lightbox component props
interface EnhancedLightboxProps {
  isOpen: boolean;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
}

// Define props for button components
interface RenderButtonProps {
  onClick?: () => void;
}

export function EnhancedLightbox({ isOpen, photos, currentIndex, onClose }: EnhancedLightboxProps) {
  // Filter out any photos without a valid imageUrl to prevent errors
  const validPhotos = photos.filter(photo => photo && photo.imageUrl && typeof photo.imageUrl === 'string');
  
  const slides = validPhotos.map(photo => ({
    src: photo.imageUrl,
    alt: photo.title || 'Photo',
    width: 1600,
    height: 1200
  }));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Custom render components for the lightbox
  const renderButtonPrev = ({ onClick }: RenderButtonProps): ReactNode => (
    <button 
      type="button" 
      className="absolute left-4 top-1/2 z-50 p-2 text-white bg-black/20 rounded-full hover:bg-black/40"
      onClick={onClick}
      aria-label="Previous"
    >
      <ChevronLeft className="h-8 w-8" />
    </button>
  );

  const renderButtonNext = ({ onClick }: RenderButtonProps): ReactNode => (
    <button 
      type="button" 
      className="absolute right-4 top-1/2 z-50 p-2 text-white bg-black/20 rounded-full hover:bg-black/40"
      onClick={onClick}
      aria-label="Next"
    >
      <ChevronRight className="h-8 w-8" />
    </button>
  );

  const renderButtonClose = ({ onClick }: RenderButtonProps): ReactNode => (
    <button
      type="button"
      className="absolute top-6 right-6 z-50 p-1 text-white hover:text-gray-300 transition-colors"
      onClick={onClick}
      aria-label="Close"
    >
      <X className="h-8 w-8" />
    </button>
  );

  // If there are no valid photos or slides, don't render the lightbox
  if (slides.length === 0) {
    return null;
  }

  // Make sure currentIndex is within bounds
  const safeIndex = Math.min(Math.max(0, currentIndex), slides.length - 1);

  return (
    <YetAnotherLightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      index={safeIndex}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        root: { "--yarl__slide_captions_display": "none" } as any
      }}
      controller={{
        closeOnBackdropClick: true,
        closeOnPullDown: true
      }}
      animation={{ swipe: 250 }}
      render={{
        // @ts-ignore - type compatibility issue with yet-another-react-lightbox API
        buttonPrev: renderButtonPrev,
        // @ts-ignore - type compatibility issue with yet-another-react-lightbox API
        buttonNext: renderButtonNext,
        // @ts-ignore - type compatibility issue with yet-another-react-lightbox API
        buttonClose: renderButtonClose
      }}
    />
  );
}

// Keep the original Lightbox for backwards compatibility
interface LightboxProps {
  isOpen: boolean;
  imgSrc: string;
  imgAlt: string;
  onClose: () => void;
}

export function Lightbox({ isOpen, imgSrc, imgAlt, onClose }: LightboxProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsActive(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsActive(false);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClick = (e: React.MouseEvent) => {
    // Close when clicking on the background (not on the image)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`lightbox ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      <button 
        className="absolute top-6 right-10 text-white hover:text-gray-300 transition-colors"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>
      <div className="flex justify-center items-center h-full">
        <img 
          src={imgSrc} 
          alt={imgAlt} 
          className="max-w-[90%] max-h-[90%] object-contain"
        />
      </div>
    </div>
  );
}
