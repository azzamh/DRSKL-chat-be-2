ALTER TABLE "messages" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN IF EXISTS "global_seq_id";