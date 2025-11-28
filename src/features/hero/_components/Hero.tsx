import { ImageFrame } from "@/shared/components/ImageFrame";

export default function Hero() {
  return (
    <div className="flex flex-col gap-16 h-screen-navbar justify-center">
      {/* Text */}
      <div className="flex flex-col gap-8">
        <h1 className="text-xl text-gray-900 font-medium">
          I'm Vin, a founding engineer based in San Francisco.{" "}
          <span className="text-gray-500 font-normal">
            I love crafting products where good design and good tech meet to
            make things feel simple, intuitive, and enjoyable.
          </span>
        </h1>

        <div className="py-2 px-4 bg-gray-100 border border-gray-200 rounded-full w-fit">
          <p className="text-sm text-gray-900">
            Currently building{" "}
            <a
              href="https://nowadays.ai"
              className="font-medium text-[#5064F4] clickable"
            >
              @nowadays
            </a>
            .
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="flex flex-row gap-16">
        <ImageFrame
          src="/images/hero-1.jpeg"
          alt="Universal Studios in Japan!"
          caption="Universal Studios in Japan!"
          className="-rotate-6"
        />
        <ImageFrame
          src="/images/hero-2.jpeg"
          alt="Happiest place on Earth :)"
          caption="Happiest place on Earth :)"
          className="rotate-6"
        />
      </div>
    </div>
  );
}
