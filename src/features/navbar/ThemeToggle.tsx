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
  const sliderPosition =
    isDarkMode === null
      ? "translate-x-0 dark:translate-x-full"
      : isDarkMode
      ? "translate-x-full"
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
      <Sun className="size-4 my-1.5 mx-3 z-10 transition-colors text-gray-500" />
      <Moon className="size-4 my-1.5 mx-3 z-10 transition-colors text-gray-400" />

      <div
        className={`absolute top-0 bottom-0 left-0 rounded-full bg-gray-200 transition-transform duration-300 ease-in-out w-1/2 ${sliderPosition}`}
      />
    </button>
  );
}
