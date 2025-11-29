import { ImageFrame } from "@/shared/components/ImageFrame";

export default function About() {
  return (
    <div className="flex flex-col gap-16 h-full justify-center">
      <div className="flex flex-col gap-8">
        <h1 className="text-xl text-gray-900 font-medium">
          I'm also a fourth-year student at{" "}
          <a
            href="https://www.cornell.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B31B1B] clickable"
          >
            Cornell University
          </a>
          ,
          <span className="text-gray-500 font-normal">
            {" "}
            studying Information Science with a focus on interactive
            technologies and UX design.
          </span>
        </h1>

        <p className="text-base text-gray-500">
          At Cornell, I've had the chance to work on projects that bring design
          and technology together, turning ideas into real, usable experiences.
        </p>

        <p className="text-base text-gray-500">
          Along the way, I've seen firsthand how thoughtful design and careful
          implementation can solve real-world problems and make a meaningful
          difference in people's lives.
        </p>
      </div>

      <div className="flex flex-row gap-16">
        <ImageFrame
          src="/images/about-1.jpeg"
          alt="Sledding down Libe Slope 🛷"
          caption="Sledding down Libe Slope 🛷"
          className="rotate-6"
        />
        <ImageFrame
          src="/images/about-2.jpeg"
          alt="My iOS team on Cornell AppDev"
          caption="My iOS team on Cornell AppDev"
          className="-rotate-6"
        />
      </div>
    </div>
  );
}
