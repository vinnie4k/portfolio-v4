import { cn } from "@/shared/utils";
import type { Section } from "./types";

export const ALL_TAB = "All";

interface GalleryTabsProps {
  sections: Section[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function GalleryTabs({
  sections,
  activeTab,
  onTabChange,
}: GalleryTabsProps) {
  const tabs = [ALL_TAB, ...sections.map((s) => s.label)];

  return (
    <div className="scrollbar-hidden flex gap-7 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "clickable shrink-0 text-[0.65rem] tracking-[0.15em] uppercase transition-colors",
            activeTab === tab
              ? "font-semibold text-gray-900"
              : "font-normal text-gray-400 hover:text-gray-600",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
