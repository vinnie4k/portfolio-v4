interface ProjectCellProps {
  imageSrc: string;
  imageAlt: string;
  link: string;
}

export default function ProjectCell({
  imageSrc,
  imageAlt,
  link,
}: ProjectCellProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-2xl border-2 border-gray-200 bg-gray-100 w-full aspect-square"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />
    </a>
  );
}
