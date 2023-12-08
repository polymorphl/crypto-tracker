CREATE TABLE IF NOT EXISTS "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"asset_slug" varchar(256) NOT NULL,
	"asset_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"url" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_asset_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_provider_id_providers_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "link_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "asset_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "provider_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "links" ADD CONSTRAINT "links_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
