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

  // State
  const [mousePosition, setMousePosition] = useState<{
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
    const handleMouseMove = (e: MouseEvent) => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
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
    };
  }, []);

  const brightnessValue = isDarkMode ? "1.5" : "0.95";

  return (
    <div ref={textRef} className={`relative inline-block ${className}`}>
      <span className="relative z-0">{children}</span>
      {mousePosition && (
        <span
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            WebkitMaskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 70%)`,
            maskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 70%)`,
            filter: `brightness(${brightnessValue})`,
            transition: "all 0.4s ease-out",
          }}
        >
          {children}
        </span>
      )}
    </div>
  );
}
