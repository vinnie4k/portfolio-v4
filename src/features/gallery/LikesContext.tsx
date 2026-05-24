import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getLikes, likePhoto, unlikePhoto } from "./likes.api";
import type { GalleryLikes } from "./types";

interface LikesContextValue {
  guestName: string;
  canLike: boolean;
  likesByPhoto: GalleryLikes;
  toggleLike: (photoSrc: string) => void;
}

const LikesContext = createContext<LikesContextValue | null>(null);

export function useLikes(): LikesContextValue {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error("useLikes must be used within a LikesProvider");
  return ctx;
}

interface LikesProviderProps {
  clientId: string;
  guestName: string;
  children: ReactNode;
}

export function LikesProvider({
  clientId,
  guestName,
  children,
}: LikesProviderProps) {
  const [likesByPhoto, setLikesByPhoto] = useState<GalleryLikes>({});
  const likesRef = useRef(likesByPhoto);
  likesRef.current = likesByPhoto;
  const canLike = guestName.trim().length > 0;

  useEffect(() => {
    let cancelled = false;
    getLikes({ data: { clientId } })
      .then((likes) => {
        if (!cancelled) setLikesByPhoto(likes);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const toggleLike = useCallback(
    (photoSrc: string) => {
      if (!canLike) return;
      const current = likesRef.current[photoSrc] ?? [];
      const liked = current.includes(guestName);
      const next = liked
        ? current.filter((n) => n !== guestName)
        : [...current, guestName];

      setLikesByPhoto((prev) => ({ ...prev, [photoSrc]: next }));

      const action = liked ? unlikePhoto : likePhoto;
      action({ data: { clientId, photoSrc, guestName } }).catch(() => {
        setLikesByPhoto((prev) => ({ ...prev, [photoSrc]: current }));
      });
    },
    [clientId, guestName, canLike],
  );

  return (
    <LikesContext.Provider value={{ guestName, canLike, likesByPhoto, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
}
