import { useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "./types";
import { getPhotoPath, thumbnailUrl } from "./urls";

const INITIAL_BATCH = 24;
const NEXT_BATCH = 8;
const GAP = 8;

interface MasonryGridProps {
  photos: Photo[];
  baseUrl: string;
  cdnBaseUrl: string;
  onPhotoClick: (index: number) => void;
}

function useColumnCount() {
  const [columns, setColumns] = useState(4);
  const rafId = useRef(0);

  useEffect(() => {
    function update() {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const w = window.innerWidth;
        setColumns(w < 640 ? 2 : w < 1024 ? 3 : 4);
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return columns;
}

function distributePhotos(photos: Photo[], columnCount: number) {
  const columns: { photo: Photo; index: number }[][] = Array.from(
    { length: columnCount },
    () => [],
  );
  const heights = new Array(columnCount).fill(0);

  for (let i = 0; i < photos.length; i++) {
    let shortest = 0;
    for (let c = 1; c < columnCount; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }
    columns[shortest].push({ photo: photos[i], index: i });
    heights[shortest] += photos[i].height / photos[i].width;
  }

  return columns;
}

function getThumbUrl(cdnBaseUrl: string, baseUrl: string, src: string) {
  return thumbnailUrl(cdnBaseUrl, getPhotoPath(cdnBaseUrl, baseUrl, src));
}

function preloadImages(urls: string[]): { promise: Promise<void>; cancel: () => void } {
  const imgs: HTMLImageElement[] = [];
  const promise = Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          imgs.push(img);
          img.onload = () => {
            img.decode().then(() => resolve()).catch(() => resolve());
          };
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  ).then(() => {});
  return {
    promise,
    cancel: () => imgs.forEach((img) => { img.src = ""; }),
  };
}

export default function MasonryGrid({
  photos,
  baseUrl,
  cdnBaseUrl,
  onPhotoClick,
}: MasonryGridProps) {
  const columnCount = useColumnCount();
  const [visibleCount, setVisibleCount] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextBatchReady, setNextBatchReady] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const preloadingRef = useRef(false);
  const generationRef = useRef(0);

  useEffect(() => {
    const gen = ++generationRef.current;
    setVisibleCount(0);
    setInitialReady(false);
    setLoading(false);
    setNextBatchReady(false);
    preloadingRef.current = false;

    const firstBatch = photos.slice(0, INITIAL_BATCH);
    const urls = firstBatch.map((p) => getThumbUrl(cdnBaseUrl, baseUrl, p.src));
    const { promise, cancel } = preloadImages(urls);
    promise.then(() => {
      if (gen !== generationRef.current) return;
      setVisibleCount(INITIAL_BATCH);
      setInitialReady(true);
    });
    return cancel;
  }, [photos, baseUrl, cdnBaseUrl]);

  useEffect(() => {
    if (!initialReady || preloadingRef.current || visibleCount >= photos.length)
      return;
    const gen = generationRef.current;
    preloadingRef.current = true;
    setNextBatchReady(false);

    const nextBatch = photos.slice(visibleCount, visibleCount + NEXT_BATCH);
    const urls = nextBatch.map((p) => getThumbUrl(cdnBaseUrl, baseUrl, p.src));
    const { promise, cancel } = preloadImages(urls);
    promise.then(() => {
      if (gen !== generationRef.current) return;
      setNextBatchReady(true);
      preloadingRef.current = false;
    });
    return cancel;
  }, [photos, baseUrl, cdnBaseUrl, visibleCount, initialReady]);

  const nextBatchReadyRef = useRef(nextBatchReady);
  nextBatchReadyRef.current = nextBatchReady;
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) return;

        if (nextBatchReadyRef.current) {
          setVisibleCount((prev) => Math.min(prev + NEXT_BATCH, photos.length));
          setNextBatchReady(false);
          setLoading(false);
        } else {
          setLoading(true);
        }
      },
      { rootMargin: "1500px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [photos.length]);

  // The observer only fires on intersection transitions. When a batch reveals
  // but the sentinel is still in view (fast scroll), keep revealing as each
  // preloaded batch becomes ready instead of waiting for the next transition.
  useEffect(() => {
    if (nextBatchReady && isIntersectingRef.current) {
      setVisibleCount((prev) => Math.min(prev + NEXT_BATCH, photos.length));
      setNextBatchReady(false);
      setLoading(false);
    }
  }, [nextBatchReady, photos.length]);

  const visiblePhotos = useMemo(
    () => photos.slice(0, visibleCount),
    [photos, visibleCount],
  );
  const columns = useMemo(
    () => distributePhotos(visiblePhotos, columnCount),
    [visiblePhotos, columnCount],
  );

  const hasMore = visibleCount < photos.length;

  return (
    <>
      <div className="flex" style={{ gap: GAP }}>
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-1 flex-col"
            style={{ gap: GAP }}
          >
            {column.map(({ photo, index }) => (
              <GalleryPhoto
                key={photo.src}
                photo={photo}
                src={getThumbUrl(cdnBaseUrl, baseUrl, photo.src)}
                onClick={() => onPhotoClick(index)}
              />
            ))}
          </div>
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-12">
          {loading && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500" />
          )}
        </div>
      )}
    </>
  );
}

interface GalleryPhotoProps {
  photo: Photo;
  src: string;
  onClick: () => void;
}

function GalleryPhoto({ photo, src, onClick }: GalleryPhotoProps) {
  const filename = useMemo(() => {
    const base = photo.src.split("/").pop() ?? photo.src;
    return base.replace(/\.[^.]+$/, "");
  }, [photo.src]);

  return (
    <div
      className="group relative cursor-pointer overflow-hidden bg-neutral-100"
      style={{ aspectRatio: `${photo.width}/${photo.height}` }}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={src}
        alt=""
        loading="eager"
        className="h-full w-full object-cover select-none"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute right-3 bottom-3 left-3 truncate text-xs font-light tracking-wide text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {filename}
      </span>
    </div>
  );
}
