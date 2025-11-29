import SpotlightText from "@/shared/components/SpotlightText";
import { cn } from "@/shared/utils";
import { Image } from "@unpic/react";

interface ProjectCellProps {
  imageSrc: string;
  imageAlt: string;
  link: string;
  imageClass?: string;
  pillText?: string;
}

export default function ProjectCell({
  imageSrc,
  imageAlt,
  link,
  imageClass,
  pillText,
}: ProjectCellProps) {
  return (
    <SpotlightText className="group relative rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-gray-100 w-full aspect-square transition-colors">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className={cn("w-full h-full object-cover", imageClass)}
          loading="lazy"
          layout="fullWidth"
        />
        {pillText && (
          <div className="absolute bottom-6 right-6 bg-gray-100 border border-gray-200 rounded-2xl px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0">
            <p className="text-[10px] text-gray-600">{pillText}</p>
          </div>
        )}
      </a>
    </SpotlightText>
  );
}
