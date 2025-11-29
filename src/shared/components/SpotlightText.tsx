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

  // State
  const [displayPosition, setDisplayPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
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
        currentRef.current = null;
        setDisplayPosition(null);
        animationRef.current = null;
        return;
      }

      if (!currentRef.current) {
        currentRef.current = { ...targetRef.current };
      }

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
          }}
        >
          {children}
        </span>
      )}
    </div>
  );
}
