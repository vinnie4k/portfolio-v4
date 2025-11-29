import SpotlightText from "@/shared/components/SpotlightText";
import ProjectCell from "./ProjectCell";

export default function Projects() {
  return (
    <div className="flex flex-col gap-16 h-full justify-center">
      <SpotlightText>
        <h1 className="text-lg md:text-xl text-gray-900 font-medium">
          Another place I love to build is at home,{" "}
          <span className="text-gray-500 font-normal">
            through personal projects and experiments that spark my curiosity.
          </span>
        </h1>
      </SpotlightText>

      <div className="grid grid-cols-2 gap-4">
        <ProjectCell
          imageSrc="/images/projects/project-1.jpg"
          imageAlt="Project 1"
          link="https://www.google.com"
        />
        <ProjectCell
          imageSrc="/images/projects/project-2.jpg"
          imageAlt="Project 2"
          link="https://www.google.com"
        />
        <ProjectCell
          imageSrc="/images/projects/project-3.jpg"
          imageAlt="Project 3"
          link="https://www.google.com"
        />
        <ProjectCell
          imageSrc="/images/projects/project-4.jpg"
          imageAlt="Project 4"
          link="https://www.google.com"
        />
      </div>
    </div>
  );
}
