import { ReactNode, useEffect, useRef, useState } from "react";

interface SpotlightTextProps {
  children: ReactNode;
  className?: string;
}

export default function SpotlightText({
  children,
  className = "",
}: SpotlightTextProps) {
  // Refs
  const textRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const currentRef = useRef<{ x: number; y: number } | null>(null);
  const animationRef = useRef<number | null>(null);
  const opacityRef = useRef(0);

  // State
  const [displayPosition, setDisplayPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [opacity, setOpacity] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effects
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const animate = () => {
      if (!targetRef.current) {
        // Fade out smoothly, but keep position for smooth re-entry
        opacityRef.current *= 0.9;
        setOpacity(opacityRef.current);

        if (opacityRef.current > 0.01) {
          // Keep animating to maintain smooth position transition
          if (currentRef.current) {
            setDisplayPosition({ ...currentRef.current });
          }
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Fully faded out, but keep position refs and displayPosition for smooth re-entry
          opacityRef.current = 0;
          setOpacity(0);
          // Keep displayPosition set so element stays in DOM
          if (currentRef.current) {
            setDisplayPosition({ ...currentRef.current });
          }
          animationRef.current = null;
        }
        return;
      }

      // Initialize currentRef if needed, starting from last position
      // Never clear currentRef, so we can smoothly transition from last position
      if (!currentRef.current) {
        // On first hover, start from target position
        currentRef.current = { ...targetRef.current };
        setDisplayPosition({ ...currentRef.current });
        // Start with very low opacity to prevent snap
        opacityRef.current = 0.01;
        setOpacity(0.01);
      }

      // Fade in smoothly (slower fade-in for smoother transition)
      opacityRef.current = Math.min(opacityRef.current * 1.08 + 0.03, 1);
      setOpacity(opacityRef.current);

      // Always lerp smoothly from current to target
      const lerpFactor = 0.03;
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;

      currentRef.current.x += dx * lerpFactor;
      currentRef.current.y += dy * lerpFactor;

      setDisplayPosition({ ...currentRef.current });
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        targetRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        if (!animationRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }
    };

    const handleMouseLeave = () => {
      targetRef.current = null;
    };

    const textElement = textRef.current;
    if (textElement) {
      textElement.addEventListener("mousemove", handleMouseMove);
      textElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (textElement) {
        textElement.removeEventListener("mousemove", handleMouseMove);
        textElement.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const brightnessValue = isDarkMode ? "1.5" : "0.95";

  return (
    <div ref={textRef} className={`relative inline-block ${className}`}>
      <span className="relative z-0">{children}</span>
      {displayPosition && (
        <span
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            WebkitMaskImage: `radial-gradient(circle 150px at ${displayPosition.x}px ${displayPosition.y}px, black 0%, transparent 70%)`,
            maskImage: `radial-gradient(circle 150px at ${displayPosition.x}px ${displayPosition.y}px, black 0%, transparent 70%)`,
            filter: `brightness(${brightnessValue})`,
            opacity: opacity,
            willChange: "opacity, mask-image",
          }}
        >
          {children}
        </span>
      )}
    </div>
  );
}
