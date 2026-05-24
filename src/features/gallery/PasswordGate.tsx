import { useState } from "react";
import type { GalleryData, GalleryMeta } from "./types";
import { unlockGallery } from "./api";

interface PasswordGateProps {
  meta: GalleryMeta;
  clientId: string;
  onUnlock: (gallery: GalleryData) => void;
}

export default function PasswordGate({
  meta,
  clientId,
  onUnlock,
}: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await unlockGallery({ data: { clientId, password } });
      if (result.success) {
        onUnlock(result.gallery);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-sm font-bold tracking-[0.15em] text-gray-900 uppercase">
            {meta.title}
          </h1>
          <p className="text-[0.7rem] font-light tracking-wide text-gray-400">
            Enter the password to view this gallery
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xs flex-col gap-3"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full border-b border-gray-200 bg-transparent px-1 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-300 placeholder:font-light focus:border-gray-900"
          />
          {error && (
            <p className="text-center text-[0.65rem] tracking-wide text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="clickable mt-2 cursor-pointer border border-gray-200 bg-transparent px-5 py-2.5 text-[0.65rem] font-semibold tracking-[0.15em] text-gray-900 uppercase transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Verifying..." : "View Gallery"}
          </button>
        </form>
      </div>
    </div>
  );
}
