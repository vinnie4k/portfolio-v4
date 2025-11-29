import { ImageFrame } from "@/shared/components/ImageFrame";
import SpotlightText from "@/shared/components/SpotlightText";

export default function Hero() {
  return (
    <div className="flex flex-col gap-16 h-full justify-center">
      {/* Text */}
      <div className="flex flex-col gap-8">
        <SpotlightText>
          <h1 className="text-lg md:text-xl text-gray-900 font-medium">
            I'm Vin, a founding engineer based in San Francisco.{" "}
            <span className="text-gray-500 font-normal">
              I love crafting products where good design and good tech meet to
              make things feel simple, intuitive, and enjoyable.
            </span>
          </h1>
        </SpotlightText>

        <SpotlightText>
          <div
            className="py-2 px-4 bg-gray-100 border border-gray-200 rounded-full w-fit"
            role="status"
            aria-label="Current work status"
          >
            <p className="text-xs md:text-sm text-gray-600">
              Currently building{" "}
              <a
                href="https://nowadays.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-600 clickable"
                aria-label="Visit Nowadays AI website"
              >
                @nowadays
              </a>
              .
            </p>
          </div>
        </SpotlightText>
      </div>

      {/* Images */}
      <div className="flex flex-col md:flex-row gap-16 items-center justify-center">
        <ImageFrame
          src="/images/hero-1.JPG"
          alt="Image of Vin after running his first 5k"
          caption="Ran my first 5k ever!"
          className="-rotate-6 w-full max-w-[280px] md:max-w-[400px]"
          priority={true}
        />
        <ImageFrame
          src="/images/hero-2.jpeg"
          alt="Image of Vin taking pictures in Lake Tahoe"
          caption="Me and my camera in Tahoe :)"
          className="rotate-6 w-full max-w-[280px] md:max-w-[400px]"
          priority={true}
        />
      </div>
    </div>
  );
}
