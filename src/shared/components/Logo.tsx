import { dnt } from "eqqo-react";

export const Logo = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="clickable bg-transparent border-none p-0"
    >
      <h1
        className="text-4xl font-script logo-filter"
        style={{
          WebkitTextFillColor: "currentColor",
        }}
      >
        {dnt("Vin Bui")}
      </h1>
    </button>
  );
};
