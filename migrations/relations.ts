import { relations } from "drizzle-orm/relations";
import { loans, loanPayments, clients, events, accounts, transactions, cards, deposits, customerProducts, scheduledPayments, productCatalog } from "./schema";

export const loanPaymentsRelations = relations(loanPayments, ({one}) => ({
	loan: one(loans, {
		fields: [loanPayments.loanId],
		references: [loans.id]
	}),
}));

export const loansRelations = relations(loans, ({one, many}) => ({
	loanPayments: many(loanPayments),
	events: many(events),
	account: one(accounts, {
		fields: [loans.accountId],
		references: [accounts.id]
	}),
	client: one(clients, {
		fields: [loans.clientId],
		references: [clients.id]
	}),
	customerProduct: one(customerProducts, {
		fields: [loans.customerProductId],
		references: [customerProducts.id]
	}),
}));

export const eventsRelations = relations(events, ({one}) => ({
	client: one(clients, {
		fields: [events.clientId],
		references: [clients.id]
	}),
	account: one(accounts, {
		fields: [events.accountId],
		references: [accounts.id]
	}),
	transaction: one(transactions, {
		fields: [events.transactionId],
		references: [transactions.id]
	}),
	loan: one(loans, {
		fields: [events.loanId],
		references: [loans.id]
	}),
	card: one(cards, {
		fields: [events.cardId],
		references: [cards.id]
	}),
	deposit: one(deposits, {
		fields: [events.depositId],
		references: [deposits.id]
	}),
	customerProduct: one(customerProducts, {
		fields: [events.customerProductId],
		references: [customerProducts.id]
	}),
}));

export const clientsRelations = relations(clients, ({many}) => ({
	events: many(events),
	accounts: many(accounts),
	transactions: many(transactions),
	customerProducts: many(customerProducts),
	loans: many(loans),
}));

export const accountsRelations = relations(accounts, ({one, many}) => ({
	events: many(events),
	client: one(clients, {
		fields: [accounts.clientId],
		references: [clients.id]
	}),
	transactions_accountId: many(transactions, {
		relationName: "transactions_accountId_accounts_id"
	}),
	transactions_targetAccountId: many(transactions, {
		relationName: "transactions_targetAccountId_accounts_id"
	}),
	scheduledPayments: many(scheduledPayments),
	deposits: many(deposits),
	customerProducts: many(customerProducts),
	cards: many(cards),
	loans: many(loans),
}));

export const transactionsRelations = relations(transactions, ({one, many}) => ({
	events: many(events),
	account_accountId: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id],
		relationName: "transactions_accountId_accounts_id"
	}),
	account_targetAccountId: one(accounts, {
		fields: [transactions.targetAccountId],
		references: [accounts.id],
		relationName: "transactions_targetAccountId_accounts_id"
	}),
	card: one(cards, {
		fields: [transactions.cardId],
		references: [cards.id]
	}),
	client: one(clients, {
		fields: [transactions.clientId],
		references: [clients.id]
	}),
}));

export const cardsRelations = relations(cards, ({one, many}) => ({
	events: many(events),
	transactions: many(transactions),
	customerProduct: one(customerProducts, {
		fields: [cards.customerProductId],
		references: [customerProducts.id]
	}),
	account: one(accounts, {
		fields: [cards.accountId],
		references: [accounts.id]
	}),
}));

export const depositsRelations = relations(deposits, ({one, many}) => ({
	events: many(events),
	customerProduct: one(customerProducts, {
		fields: [deposits.customerProductId],
		references: [customerProducts.id]
	}),
	account: one(accounts, {
		fields: [deposits.accountId],
		references: [accounts.id]
	}),
}));

export const customerProductsRelations = relations(customerProducts, ({one, many}) => ({
	events: many(events),
	deposits: many(deposits),
	client: one(clients, {
		fields: [customerProducts.clientId],
		references: [clients.id]
	}),
	productCatalog: one(productCatalog, {
		fields: [customerProducts.productId],
		references: [productCatalog.id]
	}),
	account: one(accounts, {
		fields: [customerProducts.accountId],
		references: [accounts.id]
	}),
	cards: many(cards),
	loans: many(loans),
}));

export const scheduledPaymentsRelations = relations(scheduledPayments, ({one}) => ({
	account: one(accounts, {
		fields: [scheduledPayments.accountId],
		references: [accounts.id]
	}),
}));

export const productCatalogRelations = relations(productCatalog, ({many}) => ({
	customerProducts: many(customerProducts),
}));