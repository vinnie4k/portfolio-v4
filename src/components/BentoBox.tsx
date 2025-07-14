interface BentoBoxProps {
  children?: React.ReactNode;
}

export default function BentoBox({ children }: BentoBoxProps) {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      <div className="grid grid-cols-6 grid-rows-4 gap-3 h-[800px] auto-rows-fr">{children}</div>
    </div>
  );
}

// Export BentoItem for easier importing
export { default as BentoItem } from "./BentoItem";
