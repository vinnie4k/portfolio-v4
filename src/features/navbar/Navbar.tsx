import { Logo } from "@/shared/components/Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <div className="flex flex-row items-center justify-between s">
      <Logo onClick={onLogoClick} />
      <div className="flex flex-row items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
