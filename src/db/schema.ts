import { foreignKey, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const galleryGuests = pgTable(
  "gallery_guests",
  {
    clientId: text("client_id").notNull(),
    name: text("name").notNull(),
  },
  (t) => [primaryKey({ columns: [t.clientId, t.name] })],
);

export const photoLikes = pgTable(
  "photo_likes",
  {
    clientId: text("client_id").notNull(),
    photoSrc: text("photo_src").notNull(),
    guestName: text("guest_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.clientId, t.photoSrc, t.guestName] }),
    foreignKey({
      columns: [t.clientId, t.guestName],
      foreignColumns: [galleryGuests.clientId, galleryGuests.name],
    }).onDelete("cascade"),
  ],
);
