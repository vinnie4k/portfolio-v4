CREATE TABLE "gallery_guests" (
	"client_id" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "gallery_guests_client_id_name_pk" PRIMARY KEY("client_id","name")
);
--> statement-breakpoint
CREATE TABLE "photo_likes" (
	"client_id" text NOT NULL,
	"photo_src" text NOT NULL,
	"guest_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "photo_likes_client_id_photo_src_guest_name_pk" PRIMARY KEY("client_id","photo_src","guest_name")
);
--> statement-breakpoint
ALTER TABLE "photo_likes" ADD CONSTRAINT "photo_likes_client_id_guest_name_gallery_guests_client_id_name_fk" FOREIGN KEY ("client_id","guest_name") REFERENCES "public"."gallery_guests"("client_id","name") ON DELETE cascade ON UPDATE no action;