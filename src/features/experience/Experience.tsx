import SpotlightText from "@/shared/components/SpotlightText";
import { EXPERIENCE } from "@/shared/utils/constants";
import ExperienceRow from "./ExperienceRow";

export default function Experience() {
  return (
    <div className="flex flex-col gap-16 h-full justify-center">
      <SpotlightText>
        <h1 className="text-lg md:text-xl text-gray-900 font-medium">
          And this is where that journey has taken me.{" "}
          <span className="text-gray-500 font-normal">
            These are the places I've built, and the people and moments that
            helped me grow.
          </span>
        </h1>
      </SpotlightText>

      <div className="flex flex-col">
        {EXPERIENCE.map((exp, index) => (
          <ExperienceRow
            key={index}
            year={exp.year}
            company={exp.company}
            position={exp.position}
            description={exp.description}
          />
        ))}
      </div>
    </div>
  );
}
