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

        <div className="py-2 px-4 bg-gray-100 border border-gray-200 rounded-full w-fit">
          <p className="text-xs md:text-sm text-gray-500">
            Currently building{" "}
            <a
              href="https://nowadays.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#5064F4] clickable"
            >
              @nowadays
            </a>
            .
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="flex flex-col md:flex-row gap-16 items-center justify-center">
        <ImageFrame
          src="/images/hero-1.jpeg"
          alt="Universal Studios in Japan!"
          caption="Universal Studios in Japan!"
          className="-rotate-6 max-w-[280px] md:max-w-none"
        />
        <ImageFrame
          src="/images/hero-2.jpeg"
          alt="Happiest place on Earth :)"
          caption="Happiest place on Earth :)"
          className="rotate-6 max-w-[280px] md:max-w-none"
        />
      </div>
    </div>
  );
}
