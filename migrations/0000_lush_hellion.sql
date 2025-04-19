-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "loan_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_id" integer NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"due_date" timestamp NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"payment_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" varchar(36) NOT NULL,
	"type" varchar(50) NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"payload" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"optio_response" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"client_id" integer,
	"account_id" integer,
	"transaction_id" integer,
	"loan_id" integer,
	"card_id" integer,
	"deposit_id" integer,
	"customer_product_id" integer,
	"channel" varchar(30),
	CONSTRAINT "events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(50) NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"identifier" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(20),
	"address" text,
	"business_name" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"account_number" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(20) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_account_number_unique" UNIQUE("account_number")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"description" text,
	"target_account_id" integer,
	"status" varchar(20) DEFAULT 'completed' NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"channel" varchar(30),
	"method" varchar(30),
	"reference" varchar(50),
	"card_id" integer,
	"client_id" integer
);
--> statement-breakpoint
CREATE TABLE "scheduled_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"description" text,
	"target_account_id" integer,
	"frequency" varchar(20),
	"next_payment_date" timestamp NOT NULL,
	"end_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_catalog" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"details" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_catalog_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "deposits" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_product_id" integer NOT NULL,
	"account_id" integer NOT NULL,
	"deposit_type" varchar(50) NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"interest_rate" numeric(5, 2) NOT NULL,
	"term" integer,
	"maturity_date" timestamp,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"account_id" integer,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_product_id" integer NOT NULL,
	"account_id" integer NOT NULL,
	"card_number" varchar(30),
	"card_type" varchar(50) NOT NULL,
	"card_network" varchar(50) NOT NULL,
	"expiry_date" varchar(10),
	"cvv" varchar(5),
	"cardholder_name" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"credit_limit" numeric(15, 2),
	"available_credit" numeric(15, 2),
	"pin_hash" varchar(100),
	"is_contactless" boolean DEFAULT true NOT NULL,
	"is_virtual" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"interest_rate" numeric(5, 2) NOT NULL,
	"term" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"credit_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"client_id" integer,
	"customer_product_id" integer,
	"purpose" varchar(100),
	"collateral" text,
	"approval_date" timestamp,
	"decision_notes" text
);
--> statement-breakpoint
ALTER TABLE "loan_payments" ADD CONSTRAINT "loan_payments_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_deposit_id_deposits_id_fk" FOREIGN KEY ("deposit_id") REFERENCES "public"."deposits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_customer_product_id_customer_products_id_fk" FOREIGN KEY ("customer_product_id") REFERENCES "public"."customer_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_target_account_id_accounts_id_fk" FOREIGN KEY ("target_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_payments" ADD CONSTRAINT "scheduled_payments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_customer_product_id_customer_products_id_fk" FOREIGN KEY ("customer_product_id") REFERENCES "public"."customer_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_products" ADD CONSTRAINT "customer_products_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_products" ADD CONSTRAINT "customer_products_product_id_product_catalog_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_products" ADD CONSTRAINT "customer_products_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_customer_product_id_customer_products_id_fk" FOREIGN KEY ("customer_product_id") REFERENCES "public"."customer_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_customer_product_id_customer_products_id_fk" FOREIGN KEY ("customer_product_id") REFERENCES "public"."customer_products"("id") ON DELETE no action ON UPDATE no action;
*/