import { pgTable, foreignKey, serial, integer, numeric, timestamp, boolean, unique, varchar, text, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const loanPayments = pgTable("loan_payments", {
	id: serial().primaryKey().notNull(),
	loanId: integer("loan_id").notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	dueDate: timestamp("due_date", { mode: 'string' }).notNull(),
	isPaid: boolean("is_paid").default(false).notNull(),
	paymentDate: timestamp("payment_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.loanId],
			foreignColumns: [loans.id],
			name: "loan_payments_loan_id_loans_id_fk"
		}),
]);

export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	eventId: varchar("event_id", { length: 36 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	occurredAt: timestamp("occurred_at", { mode: 'string' }).defaultNow().notNull(),
	payload: text().notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	optioResponse: text("optio_response"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	clientId: integer("client_id"),
	accountId: integer("account_id"),
	transactionId: integer("transaction_id"),
	loanId: integer("loan_id"),
	cardId: integer("card_id"),
	depositId: integer("deposit_id"),
	customerProductId: integer("customer_product_id"),
	channel: varchar({ length: 30 }),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "events_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "events_account_id_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "events_transaction_id_transactions_id_fk"
		}),
	foreignKey({
			columns: [table.loanId],
			foreignColumns: [loans.id],
			name: "events_loan_id_loans_id_fk"
		}),
	foreignKey({
			columns: [table.cardId],
			foreignColumns: [cards.id],
			name: "events_card_id_cards_id_fk"
		}),
	foreignKey({
			columns: [table.depositId],
			foreignColumns: [deposits.id],
			name: "events_deposit_id_deposits_id_fk"
		}),
	foreignKey({
			columns: [table.customerProductId],
			foreignColumns: [customerProducts.id],
			name: "events_customer_product_id_customer_products_id_fk"
		}),
	unique("events_event_id_unique").on(table.eventId),
]);

export const settings = pgTable("settings", {
	id: serial().primaryKey().notNull(),
	key: varchar({ length: 50 }).notNull(),
	value: text().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("settings_key_unique").on(table.key),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	passwordHash: varchar("password_hash", { length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	isAdmin: boolean("is_admin").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_username_unique").on(table.username),
]);

export const clients = pgTable("clients", {
	id: serial().primaryKey().notNull(),
	type: varchar({ length: 20 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	identifier: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	phone: varchar({ length: 20 }),
	address: text(),
	businessName: varchar("business_name", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("clients_identifier_unique").on(table.identifier),
]);

export const accounts = pgTable("accounts", {
	id: serial().primaryKey().notNull(),
	clientId: integer("client_id").notNull(),
	accountNumber: varchar("account_number", { length: 20 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	currency: varchar({ length: 3 }).default('USD').notNull(),
	balance: numeric({ precision: 15, scale:  2 }).default('0').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "accounts_client_id_clients_id_fk"
		}),
	unique("accounts_account_number_unique").on(table.accountNumber),
]);

export const transactions = pgTable("transactions", {
	id: serial().primaryKey().notNull(),
	accountId: integer("account_id").notNull(),
	type: varchar({ length: 20 }).notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	currency: varchar({ length: 3 }).default('USD').notNull(),
	description: text(),
	targetAccountId: integer("target_account_id"),
	status: varchar({ length: 20 }).default('completed').notNull(),
	transactionDate: timestamp("transaction_date", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	channel: varchar({ length: 30 }),
	method: varchar({ length: 30 }),
	reference: varchar({ length: 50 }),
	cardId: integer("card_id"),
	clientId: integer("client_id"),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "transactions_account_id_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.targetAccountId],
			foreignColumns: [accounts.id],
			name: "transactions_target_account_id_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.cardId],
			foreignColumns: [cards.id],
			name: "transactions_card_id_cards_id_fk"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "transactions_client_id_clients_id_fk"
		}),
]);

export const scheduledPayments = pgTable("scheduled_payments", {
	id: serial().primaryKey().notNull(),
	accountId: integer("account_id").notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	currency: varchar({ length: 3 }).default('USD').notNull(),
	description: text(),
	targetAccountId: integer("target_account_id"),
	frequency: varchar({ length: 20 }),
	nextPaymentDate: timestamp("next_payment_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "scheduled_payments_account_id_accounts_id_fk"
		}),
]);

export const productCatalog = pgTable("product_catalog", {
	id: serial().primaryKey().notNull(),
	type: varchar({ length: 50 }).notNull(),
	code: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	details: jsonb(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("product_catalog_code_unique").on(table.code),
]);

export const deposits = pgTable("deposits", {
	id: serial().primaryKey().notNull(),
	customerProductId: integer("customer_product_id").notNull(),
	accountId: integer("account_id").notNull(),
	depositType: varchar("deposit_type", { length: 50 }).notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	currency: varchar({ length: 3 }).default('USD').notNull(),
	interestRate: numeric("interest_rate", { precision: 5, scale:  2 }).notNull(),
	term: integer(),
	maturityDate: timestamp("maturity_date", { mode: 'string' }),
	status: varchar({ length: 50 }).default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.customerProductId],
			foreignColumns: [customerProducts.id],
			name: "deposits_customer_product_id_customer_products_id_fk"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "deposits_account_id_accounts_id_fk"
		}),
]);

export const customerProducts = pgTable("customer_products", {
	id: serial().primaryKey().notNull(),
	clientId: integer("client_id").notNull(),
	productId: integer("product_id").notNull(),
	accountId: integer("account_id"),
	status: varchar({ length: 50 }).default('active').notNull(),
	appliedAt: timestamp("applied_at", { mode: 'string' }).defaultNow().notNull(),
	approvedAt: timestamp("approved_at", { mode: 'string' }),
	details: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "customer_products_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [productCatalog.id],
			name: "customer_products_product_id_product_catalog_id_fk"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "customer_products_account_id_accounts_id_fk"
		}),
]);

export const cards = pgTable("cards", {
	id: serial().primaryKey().notNull(),
	customerProductId: integer("customer_product_id").notNull(),
	accountId: integer("account_id").notNull(),
	cardNumber: varchar("card_number", { length: 30 }),
	cardType: varchar("card_type", { length: 50 }).notNull(),
	cardNetwork: varchar("card_network", { length: 50 }).notNull(),
	expiryDate: varchar("expiry_date", { length: 10 }),
	cvv: varchar({ length: 5 }),
	cardholderName: varchar("cardholder_name", { length: 100 }).notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	creditLimit: numeric("credit_limit", { precision: 15, scale:  2 }),
	availableCredit: numeric("available_credit", { precision: 15, scale:  2 }),
	pinHash: varchar("pin_hash", { length: 100 }),
	isContactless: boolean("is_contactless").default(true).notNull(),
	isVirtual: boolean("is_virtual").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.customerProductId],
			foreignColumns: [customerProducts.id],
			name: "cards_customer_product_id_customer_products_id_fk"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "cards_account_id_accounts_id_fk"
		}),
]);

export const loans = pgTable("loans", {
	id: serial().primaryKey().notNull(),
	accountId: integer("account_id").notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	currency: varchar({ length: 3 }).default('USD').notNull(),
	interestRate: numeric("interest_rate", { precision: 5, scale:  2 }).notNull(),
	term: integer().notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	creditScore: integer("credit_score"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	clientId: integer("client_id"),
	customerProductId: integer("customer_product_id"),
	purpose: varchar({ length: 100 }),
	collateral: text(),
	approvalDate: timestamp("approval_date", { mode: 'string' }),
	decisionNotes: text("decision_notes"),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "loans_account_id_accounts_id_fk"
		}),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "loans_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.customerProductId],
			foreignColumns: [customerProducts.id],
			name: "loans_customer_product_id_customer_products_id_fk"
		}),
]);
