import { Image } from "@unpic/react";
import { cn } from "../utils";

interface ImageFrameProps {
  src: string;
  alt: string;
  caption?: string;
  pillText?: string;
  className?: string;
  priority?: boolean;
}

export const ImageFrame = ({
  src,
  alt,
  caption,
  pillText,
  className,
  priority = false,
}: ImageFrameProps) => {
  return (
    <div
      className={cn(
        "group flex flex-col gap-2 items-center justify-center relative",
        className
      )}
    >
      <div className="flex items-center justify-center w-full h-full bg-gray-100 border-2 border-gray-200 rounded-2xl">
        <Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover p-2 rounded-2xl"
          layout="fullWidth"
          background="auto"
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>

      {caption && (
        <p className="text-sm md:text-base text-gray-500">{caption}</p>
      )}

      {pillText && (
        <div className="absolute bottom-6 right-6 bg-gray-100 border border-gray-200 rounded-2xl px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0">
          <p className="text-[10px] text-gray-600">{pillText}</p>
        </div>
      )}
    </div>
  );
};
