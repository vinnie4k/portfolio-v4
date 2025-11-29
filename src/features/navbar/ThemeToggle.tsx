import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ThemeToggle() {
  // States
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const hasUserToggled = useRef(false);

  // Handlers
  const handleThemeToggle = () => {
    hasUserToggled.current = true;
    setIsDarkMode(!isDarkMode);
  };

  // Helpers
  // Element width is calc(50% - 0.25rem) of container
  // translate-x-[100%] moves by element width = calc(50% - 0.25rem) of container
  // To move from left to right with equal padding, we need to move by exactly 50% of container
  // So: translate-x-[50% / (50% - 0.25rem) * 100%] ≈ translate-x-[calc(100%+0.25rem)]
  const sliderPosition =
    isDarkMode === null
      ? "translate-x-0 dark:translate-x-[calc(100%+0.25rem)]"
      : isDarkMode
      ? "translate-x-[calc(100%+0.25rem)]"
      : "translate-x-0";

  // Effects
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Only persist to localStorage when user explicitly toggles
    if (hasUserToggled.current) {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  return (
    <button
      className="flex flex-row gap-0 rounded-full border border-gray-200 clickable relative overflow-hidden"
      onClick={handleThemeToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="size-4 my-1.5 mx-2 z-10 transition-colors text-gray-500" />
      <Moon className="size-4 my-1.5 mx-2 z-10 transition-colors text-gray-400" />

      <div
        className={`absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-gray-200 transition-transform duration-300 ease-in-out w-[calc(50%-0.25rem)] ${sliderPosition}`}
      />
    </button>
  );
}
