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
              src="/images/photography-1.png"
              alt="Image of Camp Richardson's Ice Cream Parlor in Tahoe"
              pillText="Lake Tahoe, CA"
            />
            <ImageFrame
              src="/images/photography-2.png"
              alt="Image of a man slicing taco meat in Cabo, Mexico"
              pillText="Cabo, Mexico"
            />
          </div>
          <ImageFrame
            src="/images/photography-3.png"
            alt="Image of Muir Woods in California"
            pillText="Muir Woods, CA"
          />
        </div>
        <ImageFrame
          src="/images/photography-4.png"
          alt="Image of Lake Tahoe in California"
          pillText="Lake Tahoe, CA"
        />
        <div className="flex flex-row gap-4">
          <ImageFrame
            src="/images/photography-5.png"
            alt="Image of a street in Osaka, Japan"
            pillText="Osaka, Japan"
          />
          <div className="flex flex-col gap-4">
            <ImageFrame
              src="/images/photography-6.png"
              alt="Image of Kinkaku-ji in Kyoto, Japan"
              pillText="Kyoto, Japan"
            />
            <ImageFrame
              src="/images/photography-7.png"
              alt="Image of Big Sur in California"
              pillText="Big Sur, CA"
            />
          </div>
        </div>
        <ImageFrame
          src="/images/photography-8.png"
          alt="Image of a sunset over the ocean in Cabo, Mexico"
          pillText="Cabo, Mexico"
        />
      </div>
    </div>
  );
}
