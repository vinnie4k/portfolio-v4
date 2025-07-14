import { useEffect, useState } from "react";
import { useImageCycling } from "../hooks/useImageCycling";

interface BentoItemProps {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  id?: string;
}

export default function BentoItem({
  children,
  className = "",
  colSpan = 1,
  rowSpan = 1,
  id = `cell-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID if not provided
}: BentoItemProps) {
  // Use image cycling only for 1x1 cells without children
  const shouldShowImage = colSpan === 1 && rowSpan === 1 && !children;
  const { currentImage, isLoading } = useImageCycling(
    id,
    shouldShowImage // enabled parameter
  );

  // Simple state for smooth transitions
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  // Handle image changes with simple fade
  useEffect(() => {
    if (currentImage && currentImage !== displayImage) {
      if (!displayImage) {
        // Initial load
        setDisplayImage(currentImage);
        return;
      }

      // Start fade out
      setIsHidden(true);

      // Change image after fade out
      setTimeout(() => {
        setDisplayImage(currentImage);
        // Start fade in
        setTimeout(() => {
          setIsHidden(false);
        }, 150);
      }, 400);
    }
  }, [currentImage, displayImage]);

  // Map span numbers to actual TailwindCSS classes
  const getColSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return "col-span-1";
      case 2:
        return "col-span-2";
      case 3:
        return "col-span-3";
      case 4:
        return "col-span-4";
      case 5:
        return "col-span-5";
      case 6:
        return "col-span-6";
      default:
        return "col-span-1";
    }
  };

  const getRowSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return "row-span-1";
      case 2:
        return "row-span-2";
      case 3:
        return "row-span-3";
      case 4:
        return "row-span-4";
      default:
        return "row-span-1";
    }
  };

  // Only apply default background and padding if no children and not showing image
  const backgroundClass = children || shouldShowImage ? "" : "bg-gray-100";
  const paddingClass = children || shouldShowImage ? "" : "p-4";

  return (
    <div
      className={`
        ${getColSpanClass(colSpan)} 
        ${getRowSpanClass(rowSpan)}
        ${backgroundClass}
        ${paddingClass}
        rounded-xl 
        min-h-[100px]
        border-2 
        border-gray-200
        overflow-hidden
        relative
        ${className}
      `}
    >
      {children ||
        (shouldShowImage && displayImage ? (
          <div className="w-full h-full relative bg-gray-200">
            {isLoading ? (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={displayImage}
                alt="Gallery image"
                className={`
                  w-full h-full object-cover
                  transition-all duration-500 ease-in-out
                  ${isHidden ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                `}
                loading="eager"
                decoding="sync"
                onError={(e) => {
                  console.error(`Failed to load image: ${displayImage}`);
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        ) : shouldShowImage && !displayImage ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading...</div>
          </div>
        ) : null)}
    </div>
  );
}
