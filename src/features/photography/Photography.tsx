import { ImageFrame } from "@/shared/components/ImageFrame";
import SpotlightText from "@/shared/components/SpotlightText";

export default function Photography() {
  return (
    <div className="flex flex-col gap-16 pt-[calc(25vh-2rem)] pb-[25vh]">
      <SpotlightText>
        <h1 className="text-lg md:text-xl text-gray-900 font-medium">
          I love expressing myself through photography,{" "}
          <span className="text-gray-500 font-normal">
            turning everyday moments into stories that inspire me.
          </span>
        </h1>
      </SpotlightText>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <ImageFrame
              src="/images/hero-1.jpeg"
              alt="Photography 1"
              className="w-[200px] h-[200px]"
            />
            <ImageFrame
              src="/images/hero-1.jpeg"
              alt="Photography 2"
              className="w-[200px] h-[200px]"
            />
          </div>
          <ImageFrame src="/images/hero-1.jpeg" alt="Photography 3" />
        </div>
        <ImageFrame
          src="/images/hero-1.jpeg"
          alt="Photography 4"
          className="h-[300px]"
        />
        <div className="flex flex-row gap-4">
          <ImageFrame src="/images/hero-1.jpeg" alt="Photography 3" />
          <div className="flex flex-col gap-4">
            <ImageFrame
              src="/images/hero-1.jpeg"
              alt="Photography 1"
              className="w-[200px] h-[200px]"
            />
            <ImageFrame
              src="/images/hero-1.jpeg"
              alt="Photography 2"
              className="w-[200px] h-[200px]"
            />
          </div>
        </div>
        <ImageFrame
          src="/images/hero-1.jpeg"
          alt="Photography 4"
          className="h-[300px]"
        />
      </div>
    </div>
  );
}
