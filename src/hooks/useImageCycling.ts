import { useCallback, useEffect, useState } from "react";

// PNG dummy images using placeholder services - expanded gallery
const GALLERY_IMAGES = [
  "https://picsum.photos/300/300?random=1",
  "https://picsum.photos/300/300?random=2",
  "https://picsum.photos/300/300?random=3",
  "https://picsum.photos/300/300?random=4",
  "https://picsum.photos/300/300?random=5",
  "https://picsum.photos/300/300?random=6",
  "https://picsum.photos/300/300?random=7",
  "https://picsum.photos/300/300?random=8",
  "https://picsum.photos/300/300?random=9",
  "https://picsum.photos/300/300?random=10",
  "https://picsum.photos/300/300?random=11",
  "https://picsum.photos/300/300?random=12",
  "https://picsum.photos/300/300?random=13",
  "https://picsum.photos/300/300?random=14",
  "https://picsum.photos/300/300?random=15",
  "https://picsum.photos/300/300?random=16",
  "https://picsum.photos/300/300?random=17",
  "https://picsum.photos/300/300?random=18",
  "https://picsum.photos/300/300?random=19",
  "https://picsum.photos/300/300?random=20",
] as const;

// Global state - simplified
let globalAssignments: { [cellId: string]: string } = {};
let globalCells: string[] = [];
let globalTimer: NodeJS.Timeout | null = null;
let subscribers: Set<() => void> = new Set();

// Notify all components about changes
const notify = () => {
  subscribers.forEach((fn) => fn());
};

// Get a random image that's not currently used by any cell
const getUniqueImage = (forCellId: string): string => {
  // Get all currently used images (excluding the one for this cell)
  const usedImages = Object.entries(globalAssignments)
    .filter(([cellId, _]) => cellId !== forCellId)
    .map(([_, image]) => image);

  // Get available images that are not currently used
  const availableImages = GALLERY_IMAGES.filter((img) => !usedImages.includes(img));

  console.log(`Getting unique image for ${forCellId}`);
  console.log(`Used images (excluding current cell):`, usedImages);
  console.log(`Available images:`, availableImages.length);

  if (availableImages.length === 0) {
    console.warn("No available images! Using random fallback");
    // Fallback: if somehow all images are used, pick any random one
    return GALLERY_IMAGES[Math.floor(Math.random() * GALLERY_IMAGES.length)];
  }

  const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  console.log(`Selected image: ${selectedImage}`);
  return selectedImage;
};

// Preload an image and return a promise
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Cycle one random cell
const cycleRandomCell = async () => {
  if (globalCells.length === 0) {
    console.log("No cells to cycle");
    return;
  }

  const randomCellId = globalCells[Math.floor(Math.random() * globalCells.length)];
  const newImage = getUniqueImage(randomCellId);
  const oldImage = globalAssignments[randomCellId];

  console.log(`Preloading image for cell ${randomCellId}: ${newImage}`);

  try {
    // Preload the new image before starting the transition
    await preloadImage(newImage);

    console.log(`Cycling cell ${randomCellId} from ${oldImage} to ${newImage}`);
    console.log("All current assignments:", globalAssignments);

    globalAssignments[randomCellId] = newImage;
    notify();

    // Schedule next cycle - 3-7 seconds
    const nextDelay = 3000 + Math.random() * 4000;
    console.log(`Next cycle in ${Math.round(nextDelay / 1000)}s`);
    globalTimer = setTimeout(cycleRandomCell, nextDelay);
  } catch (error) {
    console.error(`Failed to preload image ${newImage}`, error);
    // Schedule next cycle anyway to keep the system running
    globalTimer = setTimeout(cycleRandomCell, 3000);
  }
};

// Start the global cycling system
const startCycling = () => {
  if (globalTimer) {
    clearTimeout(globalTimer);
    globalTimer = null;
  }

  console.log("Starting cycling system with cells:", globalCells);

  // Start first cycle after 2-5 seconds
  const initialDelay = 2000 + Math.random() * 3000;
  console.log(`Initial cycle in ${Math.round(initialDelay / 1000)}s`);
  globalTimer = setTimeout(cycleRandomCell, initialDelay);
};

// Stop the cycling system
const stopCycling = () => {
  if (globalTimer) {
    clearTimeout(globalTimer);
    globalTimer = null;
  }
  console.log("Cycling stopped");
};

export const useImageCycling = (cellId: string, enabled: boolean = true) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextImage, setNextImage] = useState<string | null>(null);

  // Subscribe to global changes
  useEffect(() => {
    const updateState = async () => {
      const assignedImage = globalAssignments[cellId];

      if (assignedImage && assignedImage !== currentImage) {
        if (currentImage) {
          console.log(`${cellId}: Starting transition from ${currentImage} to ${assignedImage}`);

          try {
            // Preload the new image
            await preloadImage(assignedImage);
            setNextImage(assignedImage);

            // Start fade out
            setIsTransitioning(true);

            // Change image at the middle of transition when opacity is 0
            setTimeout(() => {
              console.log(`${cellId}: Changing image to ${assignedImage}`);
              setCurrentImage(assignedImage);
              setNextImage(null);

              // Continue fade in and complete transition
              setTimeout(() => {
                console.log(`${cellId}: Transition complete`);
                setIsTransitioning(false);
              }, 150); // Fade in duration
            }, 150); // Fade out duration
          } catch (error) {
            console.error(`Failed to preload image ${assignedImage}`, error);
            // Proceed with transition anyway
            setCurrentImage(assignedImage);
            setIsTransitioning(false);
          }
        } else {
          // Initial load - still preload
          try {
            await preloadImage(assignedImage);
            console.log(`${cellId}: Initial load with ${assignedImage}`);
            setCurrentImage(assignedImage);
          } catch (error) {
            console.error(`Failed to preload initial image ${assignedImage}`, error);
            setCurrentImage(assignedImage);
          }
        }
      }

      setIsLoading(false);
    };

    subscribers.add(updateState);
    updateState();

    return () => {
      subscribers.delete(updateState);
    };
  }, [cellId, currentImage]);

  // Register/unregister this cell
  useEffect(() => {
    if (!enabled) return;

    // Add this cell to global tracking
    if (!globalCells.includes(cellId)) {
      globalCells.push(cellId);
      console.log(`Registered cell: ${cellId}, total cells: ${globalCells.length}`);
    }

    // Assign initial image if not already assigned
    if (!globalAssignments[cellId]) {
      const initialImage = getUniqueImage(cellId);
      globalAssignments[cellId] = initialImage;
      console.log(`Initial image for ${cellId}: ${initialImage}`);
      notify();
    }

    // Start cycling if this is the first cell or restart if needed
    if (globalCells.length >= 1 && !globalTimer) {
      startCycling();
    }

    return () => {
      // Remove this cell
      globalCells = globalCells.filter((id) => id !== cellId);
      delete globalAssignments[cellId];

      console.log(`Unregistered cell: ${cellId}, remaining cells: ${globalCells.length}`);

      // Stop cycling if no cells left
      if (globalCells.length === 0) {
        stopCycling();
      }
    };
  }, [cellId, enabled]);

  const manualCycle = useCallback(() => {
    if (enabled && globalCells.includes(cellId)) {
      const newImage = getUniqueImage(cellId);
      globalAssignments[cellId] = newImage;
      notify();
    }
  }, [cellId, enabled]);

  return {
    currentImage,
    isLoading,
    isTransitioning,
    cycleImage: manualCycle,
    totalImages: GALLERY_IMAGES.length,
    availableImages: GALLERY_IMAGES.length - Object.keys(globalAssignments).length,
  };
};
