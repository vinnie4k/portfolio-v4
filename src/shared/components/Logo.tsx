export const Logo = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="clickable bg-transparent border-none p-0"
    >
      <h1
        className="text-4xl font-script text-gray-950 dark:text-white logo-filter"
        style={{
          WebkitTextFillColor: "currentColor",
        }}
      >
        Vin Bui
      </h1>
    </button>
  );
};
