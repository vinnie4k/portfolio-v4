import BentoBox, { BentoItem } from "./components/BentoBox";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto py-8">
        <BentoBox>
          {/* Top row - Mixed layout */}
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={2} rowSpan={1} />
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={1} rowSpan={2}>
            <SpotifyNowPlaying />
          </BentoItem>
          <BentoItem colSpan={1} rowSpan={1} />

          {/* Second row - Asymmetrical with center 2×2 */}
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={2} rowSpan={2} />
          <BentoItem colSpan={1} rowSpan={1} />

          {/* Third row - More scattered boxes */}
          <BentoItem colSpan={2} rowSpan={1} />
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={1} rowSpan={2} />

          {/* Fourth row - Uneven distribution */}
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={1} rowSpan={1} />
          <BentoItem colSpan={2} rowSpan={1} />
        </BentoBox>
      </div>
    </div>
  );
}
