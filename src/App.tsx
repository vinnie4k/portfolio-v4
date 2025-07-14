import BentoBox, { BentoItem } from "./components/BentoBox";
import CustomCursor from "./components/CustomCursor";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <CustomCursor />
      <div className="container mx-auto py-8">
        <BentoBox>
          {/* Top row - Mixed layout */}
          <BentoItem colSpan={1} rowSpan={1} id="cell-1" />
          <BentoItem colSpan={2} rowSpan={1} id="cell-2" />
          <BentoItem colSpan={1} rowSpan={1} id="cell-3" />
          <BentoItem colSpan={1} rowSpan={2} id="cell-4">
            <SpotifyNowPlaying />
          </BentoItem>
          <BentoItem colSpan={1} rowSpan={1} id="cell-5" />

          {/* Second row - Asymmetrical with center 2×2 */}
          <BentoItem colSpan={1} rowSpan={1} id="cell-6" />
          <BentoItem colSpan={1} rowSpan={1} id="cell-7" />
          <BentoItem colSpan={2} rowSpan={2} id="cell-8" />
          <BentoItem colSpan={1} rowSpan={1} id="cell-9" />

          {/* Third row - More scattered boxes */}
          <BentoItem colSpan={2} rowSpan={1} id="cell-10" />
          <BentoItem colSpan={1} rowSpan={1} id="cell-11" />
          <BentoItem colSpan={1} rowSpan={2} id="cell-12" />

          {/* Fourth row - Uneven distribution */}
          <BentoItem colSpan={1} rowSpan={1} id="cell-13" />
          <BentoItem colSpan={1} rowSpan={1} id="cell-14" />
          <BentoItem colSpan={1} rowSpan={1} id="cell-15" />
          <BentoItem colSpan={2} rowSpan={1} id="cell-16" />
        </BentoBox>
      </div>
    </div>
  );
}
