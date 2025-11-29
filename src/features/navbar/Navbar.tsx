import { Logo } from "@/shared/components/Logo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between s">
      <Logo />
      <ThemeToggle />
    </div>
  );
}
