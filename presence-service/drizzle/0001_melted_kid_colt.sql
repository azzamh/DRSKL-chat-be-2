CREATE TABLE IF NOT EXISTS "users_status" (
	"id" uuid,
	"username" varchar NOT NULL,
	"last_seen" timestamp with time zone,
	CONSTRAINT "users_status_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "users_status_id_unique" UNIQUE("id"),
	CONSTRAINT "users_status_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DROP TABLE "users";