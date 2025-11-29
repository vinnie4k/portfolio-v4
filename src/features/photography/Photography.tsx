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
              src="/images/photography-1.jpg"
              alt="Image of Richardson's Ice Cream Parlor in Tahoe"
            />
            <ImageFrame
              src="/images/photography-2.jpg"
              alt="Image of a man slicing taco meat in Cabo, Mexico"
            />
          </div>
          <ImageFrame
            src="/images/photography-3.jpg"
            alt="Image of Muir Woods in California"
          />
        </div>
        <ImageFrame
          src="/images/photography-4.jpg"
          alt="Image of Lake Tahoe in California"
        />
        <div className="flex flex-row gap-4">
          <ImageFrame
            src="/images/photography-5.JPG"
            alt="Image of a street in Osaka, Japan"
          />
          <div className="flex flex-col gap-4">
            <ImageFrame
              src="/images/photography-6.jpg"
              alt="Image of Hogwarts Castle in Harry Potter World in Osaka, Japan"
            />
            <ImageFrame
              src="/images/photography-7.jpg"
              alt="Image of Big Sur in California"
            />
          </div>
        </div>
        <ImageFrame
          src="/images/photography-8.jpg"
          alt="Image of a sunset over the ocean in Cabo, Mexico"
        />
      </div>
    </div>
  );
}
