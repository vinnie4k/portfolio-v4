import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getGalleryPage } from "@/features/gallery/api";
import GalleryView from "@/features/gallery/GalleryView";
import PasswordGate from "@/features/gallery/PasswordGate";
import type { GalleryData } from "@/features/gallery/types";

export const Route = createFileRoute("/photos/$clientId")({
  loader: async ({ params }) => {
    return getGalleryPage({ data: { clientId: params.clientId } });
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.meta.title || "Gallery" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { meta, gallery: initialGallery } = Route.useLoaderData();
  const { clientId } = Route.useParams();
  const [gallery, setGallery] = useState<GalleryData | null>(initialGallery);

  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.remove("dark");
    return () => {
      if (wasDark) document.documentElement.classList.add("dark");
    };
  }, []);

  useEffect(() => {
    function blockSave(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", blockSave);
    return () => window.removeEventListener("keydown", blockSave);
  }, []);

  if (!meta.exists) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Gallery not found</p>
      </div>
    );
  }

  if (!gallery) {
    return (
      <PasswordGate meta={meta} clientId={clientId} onUnlock={setGallery} />
    );
  }

  return <GalleryView gallery={gallery} />;
}
