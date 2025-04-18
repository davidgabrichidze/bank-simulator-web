export interface Account {
  id: number;
  accountNumber: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum AccountType {
  PERSONAL = 'personal',
  BUSINESS = 'business'
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
}

export interface AccountSummary {
  personal: number;
  business: number;
  total: number;
}
