CREATE TABLE IF NOT EXISTS "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"is_group" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" varchar(256) NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now(),
	"delivered_at" timestamp with time zone,
	"seen_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_conversations" (
	"user_id" uuid NOT NULL,
	"conversation_id" integer NOT NULL,
	CONSTRAINT "users_conversations_user_id_conversation_id_pk" PRIMARY KEY("user_id","conversation_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"username" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"full_name" varchar(256),
	"last_online" timestamp with time zone,
	"is_online" text DEFAULT 'false',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_username_pk" PRIMARY KEY("username"),
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
