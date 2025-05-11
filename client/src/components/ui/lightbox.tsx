import { X } from "lucide-react";
import { useEffect, useState } from "react";

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
