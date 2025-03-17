CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid,
	"username" varchar NOT NULL,
	"last_seen" timestamp with time zone,
	CONSTRAINT "users_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
