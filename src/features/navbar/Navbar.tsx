import { Logo } from "@/shared/components/Logo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <div className="flex flex-row items-center justify-between s">
      <Logo onClick={onLogoClick} />
      <ThemeToggle />
    </div>
  );
}
