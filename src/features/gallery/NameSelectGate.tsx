import { useState } from "react";

interface NameSelectGateProps {
  title: string;
  guests: string[];
  loading: boolean;
  currentName?: string;
  onSelect: (name: string) => void;
  onDismiss?: () => void;
}

export default function NameSelectGate({
  title,
  guests,
  loading,
  currentName,
  onSelect,
  onDismiss,
}: NameSelectGateProps) {
  const [selected, setSelected] = useState(currentName ?? "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafafa] px-4"
      onClick={onDismiss}
    >
      <div
        className="flex w-full max-w-sm flex-col items-center gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-sm font-bold tracking-[0.15em] text-gray-900 uppercase">
            {title}
          </h1>
          <p className="text-[0.7rem] font-light tracking-wide text-gray-400">
            Select your name to continue
          </p>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={loading || guests.length === 0}
            className="w-full cursor-pointer border-b border-gray-200 bg-transparent px-1 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <option value="" disabled>
              {loading
                ? "Loading names…"
                : guests.length === 0
                  ? "No names available"
                  : "Select your name"}
            </option>
            {guests.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!selected}
            onClick={() => onSelect(selected)}
            className="clickable mt-2 cursor-pointer border border-gray-200 bg-transparent px-5 py-2.5 text-[0.65rem] font-semibold tracking-[0.15em] text-gray-900 uppercase transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {currentName ? "Switch" : "View Gallery"}
          </button>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="clickable cursor-pointer text-[0.6rem] font-light tracking-[0.15em] text-gray-400 uppercase transition-colors hover:text-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
