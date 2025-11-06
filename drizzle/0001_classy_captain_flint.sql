ALTER TABLE "sessions" RENAME COLUMN "session_token" TO "token";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");