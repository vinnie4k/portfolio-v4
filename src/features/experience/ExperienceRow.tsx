import { dnt } from "eqqo-react";
import { useState } from "react";

interface ExperienceRowProps {
  year: string;
  company: string;
  position: string;
  description: string;
}

export default function ExperienceRow({
  year,
  company,
  position,
  description,
}: ExperienceRowProps) {
  // States
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="flex flex-col gap-0 pb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-row gap-8 items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <p className="text-sm text-gray-500">{year}</p>
          <p className="text-sm md:text-base text-gray-900 font-medium">
            {dnt(company)}
          </p>
        </div>
        <p className="text-sm text-gray-500">{position}</p>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out delay-75 overflow-hidden ${
          isHovered
            ? "grid-rows-[1fr] opacity-100 py-5"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <p className="text-sm md:text-base text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
