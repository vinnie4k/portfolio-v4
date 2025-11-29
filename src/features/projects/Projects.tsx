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

      <SpotlightText>
        <div className="grid grid-cols-2 gap-4">
          <ProjectCell
            imageSrc="/images/grabbit.png"
            imageAlt="Grabbit"
            link="https://old.vinbui.me/grabbit"
            imageClass="w-full h-full object-contain scale-75"
          />
          <ProjectCell
            imageSrc="/images/scribbly.png"
            imageAlt="Scribbly"
            link="https://old.vinbui.me/scribbly"
            imageClass="w-full h-full object-contain scale-75"
          />
          <ProjectCell
            imageSrc="/images/status-platform.png"
            imageAlt="Status Platform"
            link="https://old.vinbui.me/status"
            imageClass="w-full h-full object-contain scale-75"
          />
          <ProjectCell
            imageSrc="/images/volume.png"
            imageAlt="Volume"
            link="https://old.vinbui.me/volume"
            imageClass="w-full h-full object-contain scale-75"
          />
        </div>
      </SpotlightText>
    </div>
  );
}
