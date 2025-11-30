import { dnt } from "eqqo-react";

export const Logo = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="clickable bg-transparent border-none p-0"
    >
      <h1 className="text-2xl font-script text-gray-900 dark:text-gray-100">
        {dnt("Vin Bui")}
      </h1>
    </button>
  );
};
