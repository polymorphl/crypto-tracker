CREATE TABLE IF NOT EXISTS "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"ticker" varchar(256) NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(20, 8) DEFAULT '0' NOT NULL,
	"price" numeric(20, 8) DEFAULT '0' NOT NULL,
	"icon" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "asset_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "provider_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "amount" numeric(20, 8) NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "price_per_unit" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "linked_url" varchar(256);--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
