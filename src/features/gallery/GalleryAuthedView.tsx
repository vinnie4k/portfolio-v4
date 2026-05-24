import { useEffect, useState } from "react";
import type { GalleryData } from "./types";
import { listGuests } from "./likes.api";
import { LikesProvider } from "./LikesContext";
import GalleryView from "./GalleryView";
import NameSelectGate from "./NameSelectGate";

interface GalleryAuthedViewProps {
  gallery: GalleryData;
  clientId: string;
}

export default function GalleryAuthedView({
  gallery,
  clientId,
}: GalleryAuthedViewProps) {
  const storageKey = `gallery:${clientId}:guest`;
  const [guests, setGuests] = useState<string[]>([]);
  const [guestsLoading, setGuestsLoading] = useState(true);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    setGuestName(localStorage.getItem(storageKey));
  }, [storageKey]);

  useEffect(() => {
    let cancelled = false;
    setGuestsLoading(true);
    listGuests({ data: { clientId } })
      .then((names) => {
        if (!cancelled) setGuests(names);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setGuestsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  // Drop a remembered name that is no longer in the gallery's seeded list.
  useEffect(() => {
    if (!guestsLoading && guestName && guests.length > 0 && !guests.includes(guestName)) {
      localStorage.removeItem(storageKey);
      setGuestName(null);
    }
  }, [guestsLoading, guestName, guests, storageKey]);

  function choose(name: string) {
    localStorage.setItem(storageKey, name);
    setGuestName(name);
    setSwitching(false);
  }

  // Require a name only when there are names to choose from (or we're still
  // loading them). If the list is empty/unreachable, fall through to a
  // view-only gallery so a DB hiccup never blocks viewing.
  if (!guestName && (guestsLoading || guests.length > 0)) {
    return (
      <NameSelectGate
        title={gallery.title}
        guests={guests}
        loading={guestsLoading}
        onSelect={choose}
      />
    );
  }

  const canSwitch = guests.length > 0;

  return (
    <LikesProvider clientId={clientId} guestName={guestName ?? ""}>
      <GalleryView
        gallery={gallery}
        viewerName={guestName ?? undefined}
        onChangeName={canSwitch ? () => setSwitching(true) : undefined}
      />
      {switching && (
        <NameSelectGate
          title={gallery.title}
          guests={guests}
          loading={guestsLoading}
          currentName={guestName ?? undefined}
          onSelect={choose}
          onDismiss={() => setSwitching(false)}
        />
      )}
    </LikesProvider>
  );
}
