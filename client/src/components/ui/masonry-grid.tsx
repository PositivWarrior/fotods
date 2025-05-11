import React, { ReactNode, useRef, useEffect, useState } from "react";

interface MasonryGridProps {
  children: ReactNode[];
  columns?: number;
  spacing?: number;
  className?: string;
}

export function MasonryGrid({ 
  children, 
  columns = 3, 
  spacing = 6, 
  className = "" 
}: MasonryGridProps) {
  const [responsiveColumns, setResponsiveColumns] = useState(columns);
  const containerRef = useRef<HTMLDivElement>(null);

  // Adjust columns based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setResponsiveColumns(1);
      } else if (window.innerWidth < 1024) {
        setResponsiveColumns(2);
      } else {
        setResponsiveColumns(columns);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  // Distribute children among columns
  const columnWrappers: ReactNode[][] = [...Array(responsiveColumns)].map(() => []);
  
  children.forEach((child, index) => {
    columnWrappers[index % responsiveColumns].push(child);
  });

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${responsiveColumns} gap-${spacing} ${className}`}
    >
      {columnWrappers.map((columnContent, columnIndex) => (
        <div key={columnIndex} className={`flex flex-col gap-${spacing}`}>
          {columnContent}
        </div>
      ))}
    </div>
  );
}
