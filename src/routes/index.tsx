import About from "@/features/about/About";
import Experience from "@/features/experience/Experience";
import Footer from "@/features/footer/Footer";
import Hero from "@/features/hero/Hero";
import Navbar from "@/features/navbar/Navbar";
import Photography from "@/features/photography/Photography";
import Projects from "@/features/projects/Projects";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: App });

// Constants
const sections = [
  { key: "hero", component: Hero, scrollable: false },
  { key: "experience", component: Experience, scrollable: false },
  { key: "projects", component: Projects, scrollable: false },
  { key: "about", component: About, scrollable: false },
  { key: "photography", component: Photography, scrollable: true },
  { key: "footer", component: Footer, scrollable: false },
];

const SCROLL_THRESHOLD = 150;
const SCROLL_EASE = 0.08;
const ANIMATION_DURATION = 800;
const MOBILE_BREAKPOINT = 768;

// Animation variants for framer-motion
const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 60 : -60,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -60 : 60,
  }),
};

function App() {
  // States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const lastScrollDirection = useRef(0);
  const targetScrollTop = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navigation handlers
  const navigate = useCallback(
    (newDirection: number) => {
      if (isAnimating.current) return;

      const nextIndex = currentIndex + newDirection;
      if (nextIndex < 0 || nextIndex >= sections.length) return;

      isAnimating.current = true;
      setDirection(newDirection);
      setCurrentIndex(nextIndex);
      scrollAccumulator.current = 0;

      setTimeout(() => {
        isAnimating.current = false;
      }, ANIMATION_DURATION);
    },
    [currentIndex]
  );

  const resetScroll = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      targetScrollTop.current = 0;
    }
  }, []);

  const handleSectionClick = useCallback(
    (index: number) => {
      if (index !== currentIndex && !isAnimating.current) {
        isAnimating.current = true;
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
        setTimeout(() => {
          isAnimating.current = false;
        }, ANIMATION_DURATION);
      }
    },
    [currentIndex]
  );

  // Smooth scroll animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const currentScroll = container.scrollTop;
      const diff = targetScrollTop.current - currentScroll;

      if (Math.abs(diff) > 0.5) {
        container.scrollTop = currentScroll + diff * SCROLL_EASE;
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        container.scrollTop = targetScrollTop.current;
        animationFrameId.current = null;
      }
    };

    const startAnimation = () => {
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    const handleScrollUpdate = () => startAnimation();
    container.addEventListener("smoothscroll", handleScrollUpdate);

    return () => {
      container.removeEventListener("smoothscroll", handleScrollUpdate);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Desktop navigation handlers (wheel & keyboard)
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const currentSection = sections[currentIndex];
      const scrollDirection = e.deltaY > 0 ? 1 : -1;

      // Handle scrolling within scrollable sections
      if (currentSection.scrollable) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        const isAtTop = targetScrollTop.current <= 0;
        const isAtBottom = targetScrollTop.current >= maxScroll;

        if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
          e.preventDefault();
          scrollAccumulator.current = 0;

          targetScrollTop.current += e.deltaY * 0.5;
          targetScrollTop.current = Math.max(
            0,
            Math.min(targetScrollTop.current, maxScroll)
          );

          container.dispatchEvent(new CustomEvent("smoothscroll"));
          return;
        }
      }

      // Handle section navigation
      e.preventDefault();

      if (scrollDirection !== lastScrollDirection.current) {
        scrollAccumulator.current = 0;
        lastScrollDirection.current = scrollDirection;
      }

      scrollAccumulator.current += Math.abs(e.deltaY);

      if (scrollAccumulator.current >= SCROLL_THRESHOLD) {
        navigate(scrollDirection);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        navigate(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigate(-1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, currentIndex, isMobile]);

  // Render mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="w-container mx-auto py-4 shrink-0">
          <Navbar />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hidden">
          {sections.map((section) => {
            const SectionComponent = section.component;
            return (
              <div
                key={section.key}
                className={`w-container mx-auto ${
                  section.scrollable
                    ? "py-24 md:py-16"
                    : "min-h-screen flex items-center py-24 md:py-0"
                }`}
              >
                <SectionComponent />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render desktop layout
  const CurrentSection = sections[currentIndex].component;
  const isScrollable = sections[currentIndex].scrollable;

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="w-container mx-auto py-4 shrink-0">
        <Navbar />
      </div>

      <div
        ref={containerRef}
        className={`flex-1 relative scrollbar-hidden ${
          isScrollable ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait"
          onExitComplete={resetScroll}
        >
          <motion.div
            key={sections[currentIndex].key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={isScrollable ? "" : "absolute inset-0"}
          >
            <div
              className={`w-container mx-auto ${isScrollable ? "" : "h-full"}`}
            >
              <CurrentSection />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {sections.map((section, index) => (
            <button
              key={section.key}
              onClick={() => handleSectionClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gray-900 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to ${section.key} section`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
