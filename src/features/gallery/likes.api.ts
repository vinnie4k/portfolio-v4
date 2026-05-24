import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { galleryGuests, photoLikes } from "@/db/schema";
import { normalizeGuestName, rowsToLikes, validatePhotoSrc } from "./likes.logic";
import type { GalleryLikes } from "./types";

async function isSeededGuest(clientId: string, name: string): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select({ name: galleryGuests.name })
    .from(galleryGuests)
    .where(and(eq(galleryGuests.clientId, clientId), eq(galleryGuests.name, name)))
    .limit(1);
  return rows.length > 0;
}

export const listGuests = createServerFn({ method: "GET" })
  .inputValidator((input: { clientId: string }) => input)
  .handler(async ({ data }): Promise<string[]> => {
    const { ensureAccess } = await import("./session.server");
    ensureAccess(data.clientId);
    const db = await getDb();
    const rows = await db
      .select({ name: galleryGuests.name })
      .from(galleryGuests)
      .where(eq(galleryGuests.clientId, data.clientId));
    return rows.map((r) => r.name).sort((a, b) => a.localeCompare(b));
  });

export const getLikes = createServerFn({ method: "GET" })
  .inputValidator((input: { clientId: string }) => input)
  .handler(async ({ data }): Promise<GalleryLikes> => {
    const { ensureAccess } = await import("./session.server");
    ensureAccess(data.clientId);
    const db = await getDb();
    const rows = await db
      .select({ photoSrc: photoLikes.photoSrc, guestName: photoLikes.guestName })
      .from(photoLikes)
      .where(eq(photoLikes.clientId, data.clientId));
    return rowsToLikes(rows);
  });

export const likePhoto = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { clientId: string; photoSrc: string; guestName: string }) => input,
  )
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const { ensureAccess } = await import("./session.server");
    ensureAccess(data.clientId);
    const guestName = normalizeGuestName(data.guestName);
    validatePhotoSrc(data.photoSrc);

    if (!(await isSeededGuest(data.clientId, guestName))) {
      throw new Error("Unknown guest");
    }

    const db = await getDb();
    await db
      .insert(photoLikes)
      .values({ clientId: data.clientId, photoSrc: data.photoSrc, guestName })
      .onConflictDoNothing();
    return { success: true };
  });

export const unlikePhoto = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { clientId: string; photoSrc: string; guestName: string }) => input,
  )
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const { ensureAccess } = await import("./session.server");
    ensureAccess(data.clientId);
    const guestName = normalizeGuestName(data.guestName);
    validatePhotoSrc(data.photoSrc);

    const db = await getDb();
    await db
      .delete(photoLikes)
      .where(
        and(
          eq(photoLikes.clientId, data.clientId),
          eq(photoLikes.photoSrc, data.photoSrc),
          eq(photoLikes.guestName, guestName),
        ),
      );
    return { success: true };
  });
