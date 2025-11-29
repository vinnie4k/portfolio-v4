import ProjectCell from "./ProjectCell";

export default function Projects() {
  return (
    <div className="flex flex-col gap-16 h-screen-navbar justify-center">
      <h1 className="text-xl text-gray-900 font-medium">
        Another place I love to build is at home,{" "}
        <span className="text-gray-500 font-normal">
          through personal projects and experiments that spark my curiosity.
        </span>
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <ProjectCell />
        <ProjectCell />
        <ProjectCell />
        <ProjectCell />
      </div>
    </div>
  );
}
