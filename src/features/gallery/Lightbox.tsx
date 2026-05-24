import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { cn } from "@/shared/utils";
import type { Photo } from "./types";
import { useLikes } from "./LikesContext";

interface LightboxProps {
  photos: Photo[];
  baseUrl: string;
  initialIndex: number;
  onClose: () => void;
}

function LightboxImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
        </div>
      )}
      <motion.img
        src={src}
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 m-auto max-h-[82vh] max-w-[86vw] object-contain select-none"
        draggable={false}
      />
    </>
  );
}

export default function Lightbox({
  photos,
  baseUrl,
  initialIndex,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const { guestName, canLike, likesByPhoto, toggleLike } = useLikes();

  const getUrl = useCallback(
    (i: number) => `${baseUrl}/${photos[i].src}`,
    [baseUrl, photos],
  );

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    const preload = (i: number) => {
      const img = new Image();
      img.src = getUrl(i);
      imgs.push(img);
    };
    if (currentIndex > 0) preload(currentIndex - 1);
    if (currentIndex < photos.length - 1) preload(currentIndex + 1);
    return () => {
      imgs.forEach((img) => {
        img.src = "";
      });
    };
  }, [currentIndex, photos.length, getUrl]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  const photo = photos[currentIndex];
  const likers = likesByPhoto[photo.src] ?? [];
  const likedByMe = likers.includes(guestName);
  const count = likers.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 cursor-pointer p-2 text-white/70 transition-colors hover:text-white"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-4 z-10 hidden cursor-pointer p-2 text-white/70 transition-colors hover:text-white md:block"
        aria-label="Previous photo"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-4 z-10 hidden cursor-pointer p-2 text-white/70 transition-colors hover:text-white md:block"
        aria-label="Next photo"
      >
        <ChevronRight size={32} />
      </button>

      <div
        className="relative h-[82vh] w-[86vw]"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          <LightboxImage key={photo.src} src={getUrl(currentIndex)} />
        </AnimatePresence>
      </div>

      <span className="absolute bottom-4 left-1/2 max-w-[60vw] -translate-x-1/2 truncate text-[0.6rem] font-light tracking-[0.15em] text-white/40">
        {photo.src}
      </span>

      {(canLike || count > 0) && (
        <div
          className="absolute right-6 bottom-4 flex max-w-[45vw] flex-col items-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={!canLike}
            onClick={() => toggleLike(photo.src)}
            aria-label={likedByMe ? "Unlike photo" : "Like photo"}
            className={cn(
              "flex items-center gap-1.5 text-white/80 transition-colors",
              canLike ? "cursor-pointer hover:text-white" : "cursor-default",
            )}
          >
            <Heart
              size={20}
              className={cn(
                canLike && "transition-transform hover:scale-110",
                likedByMe ? "fill-red-500 text-red-500" : "fill-transparent",
              )}
            />
            {count > 0 && (
              <span className="text-xs font-medium tabular-nums">{count}</span>
            )}
          </button>
          {count > 0 && (
            <p className="max-w-full truncate text-[0.55rem] font-light tracking-[0.2em] text-white/60 uppercase">
              Liked by {likers.join(", ")}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
