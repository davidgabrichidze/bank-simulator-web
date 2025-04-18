import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, varchar, decimal, uniqueIndex } from "drizzle-orm/pg-core";
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
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  term: integer("term").notNull(), // in months
  startDate: timestamp("start_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected, active, completed
  creditScore: integer("credit_score"),
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
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
  payload: text("payload").notNull(),
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
export const accountsRelations = relations(accounts, ({ one, many }) => ({
  client: one(clients, {
    fields: [accounts.id],
    references: [clients.id],
  }),
  transactions: many(transactions),
  scheduledPayments: many(scheduledPayments),
  loans: many(loans),
}));

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
