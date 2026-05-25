import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryData } from "./types";
import { ALL_TAB, LIKED_TAB } from "./GalleryTabs";
import GalleryTabs from "./GalleryTabs";
import { useLikes } from "./LikesContext";
import Lightbox from "./Lightbox";
import MasonryGrid from "./MasonryGrid";
import { coverImageUrl, getPhotoPath } from "./urls";

interface GalleryViewProps {
  gallery: GalleryData;
  viewerName?: string;
  onChangeName?: () => void;
}

function useSmartHeader() {
  const [visible, setVisible] = useState(true);
  const [pastCover, setPastCover] = useState(false);
  const lastScrollY = useRef(0);
  const rafId = useRef(0);
  const visibleRef = useRef(true);
  const pastCoverRef = useRef(false);

  useEffect(() => {
    function handleScroll() {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const isPastCover = y > window.innerHeight;

        if (isPastCover !== pastCoverRef.current) {
          pastCoverRef.current = isPastCover;
          setPastCover(isPastCover);
        }

        let nextVisible = visibleRef.current;
        if (!isPastCover) {
          nextVisible = true;
        } else if (y < lastScrollY.current) {
          nextVisible = true;
        } else if (y > lastScrollY.current + 5) {
          nextVisible = false;
        }

        if (nextVisible !== visibleRef.current) {
          visibleRef.current = nextVisible;
          setVisible(nextVisible);
        }

        lastScrollY.current = y;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { visible, pastCover };
}

export default function GalleryView({
  gallery,
  viewerName,
  onChangeName,
}: GalleryViewProps) {
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { visible, pastCover } = useSmartHeader();
  const { likesByPhoto } = useLikes();

  const photos = useMemo(() => {
    const all = gallery.sections.flatMap((s) => s.photos);
    if (activeTab === ALL_TAB) return all;
    if (activeTab === LIKED_TAB) {
      return all.filter((p) => (likesByPhoto[p.src]?.length ?? 0) > 0);
    }
    return gallery.sections.find((s) => s.label === activeTab)?.photos ?? [];
  }, [activeTab, gallery.sections, likesByPhoto]);

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    // Jump to the top of the gallery (just past the full-height cover).
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }

  const coverPath = getPhotoPath(
    gallery.cdnBaseUrl,
    gallery.baseUrl,
    gallery.coverImage,
  );
  const coverUrl = coverImageUrl(gallery.cdnBaseUrl, coverPath);

  return (
    <div className="min-h-screen">
      <div className="relative h-screen w-full overflow-hidden">
        <img
          src={coverUrl}
          alt={gallery.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-3 border border-white/40 md:inset-5" />
        <div className="absolute top-10 left-0 right-0 text-center md:top-14">
          <span className="text-[0.6rem] font-light tracking-[0.35em] text-white/70 uppercase">
            Photos by Vin
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-20">
          <h1 className="px-6 text-center text-[1.35rem] font-extralight tracking-[0.25em] text-white uppercase leading-relaxed md:px-10 md:text-[2.25rem]">
            {gallery.title}
          </h1>
          <button
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
            className="mt-10 cursor-pointer text-[0.6rem] font-light tracking-[0.35em] text-white/70 underline underline-offset-4 decoration-white/30 uppercase transition-colors hover:text-white hover:decoration-white/60"
          >
            View Gallery
          </button>
        </div>
      </div>

      <motion.div
        className="sticky top-0 z-40 bg-[#fafafa]"
        initial={false}
        animate={{ y: pastCover && !visible ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex flex-col gap-3 px-4 pt-4 pb-3 md:flex-row md:items-center md:justify-between md:px-8 md:pt-5 md:pb-4">
          <div className="shrink-0">
            <h2 className="text-[0.7rem] font-bold tracking-[0.15em] text-gray-900 uppercase md:text-xs">
              {gallery.title}
            </h2>
            <p className="mt-0.5 text-[0.55rem] font-normal tracking-[0.2em] text-gray-400 uppercase">
              Photos by Vin
            </p>
            {viewerName && (
              <button
                onClick={onChangeName}
                className="clickable mt-1.5 cursor-pointer text-[0.55rem] font-normal tracking-[0.2em] text-gray-400 uppercase transition-colors hover:text-gray-700"
              >
                Viewing as {viewerName} · Change
              </button>
            )}
          </div>

          <GalleryTabs
            sections={gallery.sections}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-3 pt-1 pb-16 md:px-5 md:pt-2 md:pb-24"
        >
          {activeTab === LIKED_TAB && photos.length === 0 ? (
            <p className="py-24 text-center text-[0.65rem] font-light tracking-[0.2em] text-gray-400 uppercase">
              No liked photos yet
            </p>
          ) : (
            <MasonryGrid
              photos={photos}
              baseUrl={gallery.baseUrl}
              cdnBaseUrl={gallery.cdnBaseUrl}
              onPhotoClick={setLightboxIndex}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            baseUrl={gallery.baseUrl}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
