import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, varchar, decimal, uniqueIndex, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Client
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // person, business
  name: varchar("name", { length: 100 }).notNull(),
  identifier: varchar("identifier", { length: 50 }).notNull().unique(), // SSN for persons, business ID for businesses
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  businessName: varchar("business_name", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

// Account
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  accountNumber: varchar("account_number", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // personal, business
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAccountSchema = createInsertSchema(accounts).omit({ 
  id: true,
  accountNumber: true,
  createdAt: true,
  updatedAt: true 
});

// Transaction
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  type: varchar("type", { length: 20 }).notNull(), // deposit, withdrawal, transfer
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  description: text("description"),
  targetAccountId: integer("target_account_id").references(() => accounts.id),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  channel: varchar("channel", { length: 30 }), // mobile, online, branch, atm, pos
  method: varchar("method", { length: 30 }), // card, cash, transfer, check
  reference: varchar("reference", { length: 50 }), // Transaction reference number
  cardId: integer("card_id").references(() => cards.id), // Reference to card if transaction was made with a card
  clientId: integer("client_id").references(() => clients.id), // Customer who initiated the transaction
  transactionDate: timestamp("transaction_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true,
  createdAt: true 
});

// Scheduled Payment
export const scheduledPayments = pgTable("scheduled_payments", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  description: text("description"),
  targetAccountId: integer("target_account_id"),
  frequency: varchar("frequency", { length: 20 }), // one-off, weekly, monthly
  nextPaymentDate: timestamp("next_payment_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertScheduledPaymentSchema = createInsertSchema(scheduledPayments).omit({ 
  id: true,
  createdAt: true 
});

// Loan
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  clientId: integer("client_id").references(() => clients.id), // Customer who applied for the loan
  customerProductId: integer("customer_product_id").references(() => customerProducts.id), // Link to product catalog
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  term: integer("term").notNull(), // in months
  startDate: timestamp("start_date").notNull(),
  purpose: varchar("purpose", { length: 100 }), // Purpose of the loan
  collateral: text("collateral"), // Description of collateral if any
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected, active, completed
  creditScore: integer("credit_score"),
  approvalDate: timestamp("approval_date"),
  decisionNotes: text("decision_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLoanSchema = createInsertSchema(loans).omit({ 
  id: true,
  status: true,
  creditScore: true,
  createdAt: true 
});

// Loan Payment
export const loanPayments = pgTable("loan_payments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").notNull().references(() => loans.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLoanPaymentSchema = createInsertSchema(loanPayments).omit({ 
  id: true,
  createdAt: true 
});

// Event
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  eventId: varchar("event_id", { length: 36 }).notNull().unique(),
  type: varchar("type", { length: 50 }).notNull(),
  clientId: integer("client_id").references(() => clients.id), // Customer associated with the event
  accountId: integer("account_id").references(() => accounts.id), // Account associated with the event
  transactionId: integer("transaction_id").references(() => transactions.id), // Transaction associated with the event
  loanId: integer("loan_id").references(() => loans.id), // Loan associated with the event
  cardId: integer("card_id").references(() => cards.id), // Card associated with the event
  depositId: integer("deposit_id").references(() => deposits.id), // Deposit associated with the event
  customerProductId: integer("customer_product_id").references(() => customerProducts.id), // Product associated with the event
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
  payload: text("payload").notNull(),
  channel: varchar("channel", { length: 30 }), // online, branch, atm, mobile, etc.
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, sent, failed
  optioResponse: text("optio_response"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({ 
  id: true,
  status: true,
  optioResponse: true,
  createdAt: true 
});

// Settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({ 
  id: true,
  updatedAt: true 
});

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type ScheduledPayment = typeof scheduledPayments.$inferSelect;
export type InsertScheduledPayment = z.infer<typeof insertScheduledPaymentSchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type LoanPayment = typeof loanPayments.$inferSelect;
export type InsertLoanPayment = z.infer<typeof insertLoanPaymentSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

// User
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

// Define relations
export const clientsRelations = relations(clients, ({ many }) => ({
  accounts: many(accounts),
  customerProducts: many(customerProducts),
  transactions: many(transactions),
  loans: many(loans),
  events: many(events),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  client: one(clients, {
    fields: [accounts.clientId],
    references: [clients.id],
  }),
  transactions: many(transactions),
  scheduledPayments: many(scheduledPayments),
  loans: many(loans),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  targetAccount: one(accounts, {
    fields: [transactions.targetAccountId],
    references: [accounts.id],
  }),
  client: one(clients, {
    fields: [transactions.clientId],
    references: [clients.id],
  }),
  card: one(cards, {
    fields: [transactions.cardId],
    references: [cards.id],
  }),
}));

export const loansRelations = relations(loans, ({ one, many }) => ({
  account: one(accounts, {
    fields: [loans.accountId],
    references: [accounts.id],
  }),
  client: one(clients, {
    fields: [loans.clientId],
    references: [clients.id],
  }),
  customerProduct: one(customerProducts, {
    fields: [loans.customerProductId],
    references: [customerProducts.id],
  }),
  payments: many(loanPayments),
}));

export const loanPaymentsRelations = relations(loanPayments, ({ one }) => ({
  loan: one(loans, {
    fields: [loanPayments.loanId],
    references: [loans.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  client: one(clients, {
    fields: [events.clientId],
    references: [clients.id],
  }),
  account: one(accounts, {
    fields: [events.accountId],
    references: [accounts.id],
  }),
  transaction: one(transactions, {
    fields: [events.transactionId],
    references: [transactions.id],
  }),
  loan: one(loans, {
    fields: [events.loanId],
    references: [loans.id],
  }),
  card: one(cards, {
    fields: [events.cardId],
    references: [cards.id],
  }),
  deposit: one(deposits, {
    fields: [events.depositId],
    references: [deposits.id],
  }),
  customerProduct: one(customerProducts, {
    fields: [events.customerProductId],
    references: [customerProducts.id],
  })
}));

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Product catalog tables
export const productCatalog = pgTable("product_catalog", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // account, loan, deposit, card
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  details: jsonb("details"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProductCatalogSchema = createInsertSchema(productCatalog).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Customer products - linking customers to products they have
export const customerProducts = pgTable("customer_products", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  productId: integer("product_id").notNull().references(() => productCatalog.id),
  accountId: integer("account_id").references(() => accounts.id),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, pending, closed
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCustomerProductSchema = createInsertSchema(customerProducts).omit({
  id: true,
  status: true,
  appliedAt: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true
});

// Card products
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  customerProductId: integer("customer_product_id").notNull().references(() => customerProducts.id),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  cardNumber: varchar("card_number", { length: 30 }),
  cardType: varchar("card_type", { length: 50 }).notNull(), // debit, credit
  cardNetwork: varchar("card_network", { length: 50 }).notNull(), // visa, mastercard, etc.
  expiryDate: varchar("expiry_date", { length: 10 }),
  cvv: varchar("cvv", { length: 5 }),
  cardholderName: varchar("cardholder_name", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, active, blocked, expired
  creditLimit: decimal("credit_limit", { precision: 15, scale: 2 }),
  availableCredit: decimal("available_credit", { precision: 15, scale: 2 }),
  pinHash: varchar("pin_hash", { length: 100 }),
  isContactless: boolean("is_contactless").notNull().default(true),
  isVirtual: boolean("is_virtual").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  cardNumber: true,
  expiryDate: true,
  cvv: true,
  status: true,
  pinHash: true,
  createdAt: true,
  updatedAt: true
});

// Deposit (savings) products
export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  customerProductId: integer("customer_product_id").notNull().references(() => customerProducts.id),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  depositType: varchar("deposit_type", { length: 50 }).notNull(), // fixed, savings, etc.
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  term: integer("term"), // in months (null for open-ended)
  maturityDate: timestamp("maturity_date"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, matured, closed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
});

// Add types
export type ProductCatalog = typeof productCatalog.$inferSelect;
export type InsertProductCatalog = z.infer<typeof insertProductCatalogSchema>;

export type CustomerProduct = typeof customerProducts.$inferSelect;
export type InsertCustomerProduct = z.infer<typeof insertCustomerProductSchema>;

export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;

export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;

// Define relations for product catalog tables
export const productCatalogRelations = relations(productCatalog, ({ many }) => ({
  customerProducts: many(customerProducts),
}));

export const customerProductsRelations = relations(customerProducts, ({ one, many }) => ({
  client: one(clients, {
    fields: [customerProducts.clientId],
    references: [clients.id],
  }),
  product: one(productCatalog, {
    fields: [customerProducts.productId],
    references: [productCatalog.id],
  }),
  account: one(accounts, {
    fields: [customerProducts.accountId],
    references: [accounts.id],
  }),
  cards: many(cards),
  deposits: many(deposits),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  customerProduct: one(customerProducts, {
    fields: [cards.customerProductId],
    references: [customerProducts.id],
  }),
  account: one(accounts, {
    fields: [cards.accountId],
    references: [accounts.id],
  }),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  customerProduct: one(customerProducts, {
    fields: [deposits.customerProductId],
    references: [customerProducts.id],
  }),
  account: one(accounts, {
    fields: [deposits.accountId],
    references: [accounts.id],
  }),
}));
