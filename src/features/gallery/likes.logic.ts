import type { GalleryLikes } from "./types";

const MAX_NAME_LEN = 80;
const MAX_PHOTO_SRC_LEN = 512;

export function normalizeGuestName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LEN) {
    throw new Error("Invalid guest name");
  }
  return trimmed;
}

export function validatePhotoSrc(src: string): void {
  if (
    typeof src !== "string" ||
    src.length === 0 ||
    src.length > MAX_PHOTO_SRC_LEN ||
    src.includes("..")
  ) {
    throw new Error("Invalid photo");
  }
}

export function rowsToLikes(
  rows: { photoSrc: string; guestName: string }[],
): GalleryLikes {
  const likes: GalleryLikes = {};
  for (const { photoSrc, guestName } of rows) {
    (likes[photoSrc] ??= []).push(guestName);
  }
  return likes;
}
