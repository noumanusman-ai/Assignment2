CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(255) DEFAULT 'New Chat',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" varchar(10) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verificationToken" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "verificationToken" CASCADE;--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_provider_providerAccountId_pk";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "provider_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned_reason" text;--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "provider";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "providerAccountId";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "token_type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "session_state";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "sessionToken";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "expires";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "emailVerified";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "password_hash";--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE("token");--> statement-breakpoint
DROP TYPE "public"."role";