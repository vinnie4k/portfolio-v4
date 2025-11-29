import { cn } from "../utils";

interface ImageFrameProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export const ImageFrame = ({
  src,
  alt,
  caption,
  className,
}: ImageFrameProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center justify-center",
        className
      )}
    >
      <div className="flex items-center justify-center w-full h-full bg-gray-100 border-2 border-gray-200 rounded-2xl">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover p-2 rounded-2xl"
        />
      </div>

      {caption && (
        <p className="text-sm md:text-base text-gray-500">{caption}</p>
      )}
    </div>
  );
};
