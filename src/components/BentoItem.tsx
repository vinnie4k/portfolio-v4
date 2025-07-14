interface BentoItemProps {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

export default function BentoItem({ children, className = "", colSpan = 1, rowSpan = 1 }: BentoItemProps) {
  // Map span numbers to actual TailwindCSS classes
  const getColSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return "col-span-1";
      case 2:
        return "col-span-2";
      case 3:
        return "col-span-3";
      case 4:
        return "col-span-4";
      case 5:
        return "col-span-5";
      case 6:
        return "col-span-6";
      default:
        return "col-span-1";
    }
  };

  const getRowSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return "row-span-1";
      case 2:
        return "row-span-2";
      case 3:
        return "row-span-3";
      case 4:
        return "row-span-4";
      default:
        return "row-span-1";
    }
  };

  // Only apply default background and padding if no children
  const backgroundClass = children ? "" : "bg-gray-100";
  const paddingClass = children ? "" : "p-4";

  return (
    <div
      className={`
        ${getColSpanClass(colSpan)} 
        ${getRowSpanClass(rowSpan)}
        ${backgroundClass}
        ${paddingClass}
        rounded-xl 
        min-h-[100px]
        border-2 
        border-gray-200
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  );
}
