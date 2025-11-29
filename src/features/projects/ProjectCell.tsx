import { cn } from "@/shared/utils";

interface ProjectCellProps {
  imageSrc: string;
  imageAlt: string;
  link: string;
  imageClass?: string;
}

export default function ProjectCell({
  imageSrc,
  imageAlt,
  link,
  imageClass,
}: ProjectCellProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-gray-100 w-full aspect-square transition-colors"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className={cn("w-full h-full object-cover", imageClass)}
      />
    </a>
  );
}
