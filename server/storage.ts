import { 
  users, accounts, clients, transactions, events, loans, loanPayments, scheduledPayments, settings,
  type User, type InsertUser,
  type Client, type InsertClient,
  type Account, type InsertAccount,
  type Transaction, type InsertTransaction,
  type Event, type InsertEvent,
  type Loan, type InsertLoan,
  type LoanPayment, type InsertLoanPayment,
  type ScheduledPayment, type InsertScheduledPayment,
  type Setting, type InsertSetting
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

// Extended storage interface with all the CRUD methods needed
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client methods
  getClient(id: number): Promise<Client | undefined>;
  getClientByIdentifier(identifier: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Account methods
  getAccount(id: number): Promise<Account | undefined>;
  getAccountByNumber(accountNumber: string): Promise<Account | undefined>;
  getAccountsByClientId(clientId: number): Promise<Account[]>;
  getAccounts(): Promise<Account[]>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account | undefined>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByAccountId(accountId: number): Promise<Transaction[]>;
  getTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Event methods
  getEvent(id: number): Promise<Event | undefined>;
  getEventByEventId(eventId: string): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEventStatus(eventId: string, status: string, response?: string): Promise<Event | undefined>;
  
  // Loan methods
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByAccountId(accountId: number): Promise<Loan[]>;
  getLoans(): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoanStatus(id: number, status: string): Promise<Loan | undefined>;
  
  // Loan Payment methods
  getLoanPayment(id: number): Promise<LoanPayment | undefined>;
  getLoanPaymentsByLoanId(loanId: number): Promise<LoanPayment[]>;
  createLoanPayment(payment: InsertLoanPayment): Promise<LoanPayment>;
  updateLoanPayment(id: number, isPaid: boolean, paymentDate?: Date): Promise<LoanPayment | undefined>;
  
  // Scheduled Payment methods
  getScheduledPayment(id: number): Promise<ScheduledPayment | undefined>;
  getScheduledPaymentsByAccountId(accountId: number): Promise<ScheduledPayment[]>;
  getScheduledPayments(): Promise<ScheduledPayment[]>;
  createScheduledPayment(payment: InsertScheduledPayment): Promise<ScheduledPayment>;
  updateScheduledPayment(id: number, isActive: boolean): Promise<ScheduledPayment | undefined>;
  
  // Settings methods
  getSetting(key: string): Promise<string | undefined>;
  getSettings(): Promise<{ [key: string]: string }>;
  updateSetting(key: string, value: string): Promise<Setting>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }
  
  async getClientByIdentifier(identifier: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.identifier, identifier));
    return client || undefined;
  }
  
  async getClients(): Promise<Client[]> {
    return db.select().from(clients).orderBy(clients.name);
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db
      .insert(clients)
      .values(client)
      .returning();
    return newClient;
  }
  
  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updatedClient || undefined;
  }
  
  // Account methods
  async getAccount(id: number): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account || undefined;
  }
  
  async getAccountByNumber(accountNumber: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.accountNumber, accountNumber));
    return account || undefined;
  }
  
  async getAccountsByClientId(clientId: number): Promise<Account[]> {
    return db.select().from(accounts).where(eq(accounts.clientId, clientId));
  }
  
  async getAccounts(): Promise<Account[]> {
    return db.select().from(accounts);
  }
  
  async createAccount(account: InsertAccount): Promise<Account> {
    // Generate a random account number if not provided
    if (!account.accountNumber) {
      account = {
        ...account,
        accountNumber: Math.floor(10000000 + Math.random() * 90000000).toString()
      };
    }
    
    const [newAccount] = await db
      .insert(accounts)
      .values(account)
      .returning();
    return newAccount;
  }
  
  async updateAccount(id: number, account: Partial<InsertAccount>): Promise<Account | undefined> {
    const [updatedAccount] = await db
      .update(accounts)
      .set({ ...account, updatedAt: new Date() })
      .where(eq(accounts.id, id))
      .returning();
    return updatedAccount || undefined;
  }
  
  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }
  
  async getTransactionsByAccountId(accountId: number): Promise<Transaction[]> {
    return db.select()
      .from(transactions)
      .where(
        eq(transactions.accountId, accountId)
      )
      .orderBy(desc(transactions.transactionDate));
  }
  
  async getTransactions(): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.transactionDate));
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }
  
  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }
  
  async getEventByEventId(eventId: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.eventId, eventId));
    return event || undefined;
  }
  
  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.occurredAt));
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    // Generate event ID if not provided
    if (!event.eventId) {
      event = {
        ...event,
        eventId: uuidv4()
      };
    }
    
    const [newEvent] = await db
      .insert(events)
      .values(event)
      .returning();
    return newEvent;
  }
  
  async updateEventStatus(eventId: string, status: string, response?: string): Promise<Event | undefined> {
    const updates: any = { status };
    if (response) {
      updates.optioResponse = response;
    }
    
    const [updatedEvent] = await db
      .update(events)
      .set(updates)
      .where(eq(events.eventId, eventId))
      .returning();
    return updatedEvent || undefined;
  }
  
  // Loan methods
  async getLoan(id: number): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan || undefined;
  }
  
  async getLoansByAccountId(accountId: number): Promise<Loan[]> {
    return db.select().from(loans).where(eq(loans.accountId, accountId));
  }
  
  async getLoans(): Promise<Loan[]> {
    return db.select().from(loans);
  }
  
  async createLoan(loan: InsertLoan): Promise<Loan> {
    const [newLoan] = await db
      .insert(loans)
      .values(loan)
      .returning();
    return newLoan;
  }
  
  async updateLoanStatus(id: number, status: string): Promise<Loan | undefined> {
    const [updatedLoan] = await db
      .update(loans)
      .set({ status })
      .where(eq(loans.id, id))
      .returning();
    return updatedLoan || undefined;
  }
  
  // Loan Payment methods
  async getLoanPayment(id: number): Promise<LoanPayment | undefined> {
    const [payment] = await db.select().from(loanPayments).where(eq(loanPayments.id, id));
    return payment || undefined;
  }
  
  async getLoanPaymentsByLoanId(loanId: number): Promise<LoanPayment[]> {
    return db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId));
  }
  
  async createLoanPayment(payment: InsertLoanPayment): Promise<LoanPayment> {
    const [newPayment] = await db
      .insert(loanPayments)
      .values(payment)
      .returning();
    return newPayment;
  }
  
  async updateLoanPayment(id: number, isPaid: boolean, paymentDate?: Date): Promise<LoanPayment | undefined> {
    const updates: any = { isPaid };
    if (paymentDate) {
      updates.paymentDate = paymentDate;
    }
    
    const [updatedPayment] = await db
      .update(loanPayments)
      .set(updates)
      .where(eq(loanPayments.id, id))
      .returning();
    return updatedPayment || undefined;
  }
  
  // Scheduled Payment methods
  async getScheduledPayment(id: number): Promise<ScheduledPayment | undefined> {
    const [payment] = await db.select().from(scheduledPayments).where(eq(scheduledPayments.id, id));
    return payment || undefined;
  }
  
  async getScheduledPaymentsByAccountId(accountId: number): Promise<ScheduledPayment[]> {
    return db.select().from(scheduledPayments).where(eq(scheduledPayments.accountId, accountId));
  }
  
  async getScheduledPayments(): Promise<ScheduledPayment[]> {
    return db.select().from(scheduledPayments);
  }
  
  async createScheduledPayment(payment: InsertScheduledPayment): Promise<ScheduledPayment> {
    const [newPayment] = await db
      .insert(scheduledPayments)
      .values(payment)
      .returning();
    return newPayment;
  }
  
  async updateScheduledPayment(id: number, isActive: boolean): Promise<ScheduledPayment | undefined> {
    const [updatedPayment] = await db
      .update(scheduledPayments)
      .set({ isActive })
      .where(eq(scheduledPayments.id, id))
      .returning();
    return updatedPayment || undefined;
  }
  
  // Settings methods
  async getSetting(key: string): Promise<string | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting?.value;
  }
  
  async getSettings(): Promise<{ [key: string]: string }> {
    const allSettings = await db.select().from(settings);
    const settingsMap: { [key: string]: string } = {};
    
    for (const setting of allSettings) {
      settingsMap[setting.key] = setting.value;
    }
    
    return settingsMap;
  }
  
  async updateSetting(key: string, value: string): Promise<Setting> {
    // Try to update first
    const [existingSetting] = await db
      .update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key))
      .returning();
    
    if (existingSetting) {
      return existingSetting;
    }
    
    // If no rows were updated, insert a new setting
    const [newSetting] = await db
      .insert(settings)
      .values({ key, value })
      .returning();
    
    return newSetting;
  }
}

export const storage = new DatabaseStorage();
