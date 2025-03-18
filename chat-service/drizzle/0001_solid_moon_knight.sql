ALTER TABLE "messages" ADD COLUMN "global_seq_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "room_seq_id" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "last_seq_id" integer DEFAULT 0 NOT NULL;