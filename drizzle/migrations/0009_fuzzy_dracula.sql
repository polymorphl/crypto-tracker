CREATE TABLE IF NOT EXISTS "raw_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"path" varchar(256) NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
