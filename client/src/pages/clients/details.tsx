import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building2,
  CreditCard, 
  Receipt, 
  PiggyBank, 
  Wallet,
  Landmark,
  Plus,
  Edit,
  ArrowLeft,
  Loader2,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AccountFormDialog from "@/components/ui/account-form-dialog";
import ProductCatalogDialog from "@/components/ui/product-catalog-dialog";
import { WithHelpContext } from "@/components/ui/help-context-provider";

// Define types
interface Client {
  id: number;
  type: 'person' | 'business';
  name: string;
  identifier: string;
  email: string;
  phone?: string;
  address?: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: number;
  accountNumber: string;
  type: string;
  name: string;
  balance: number;
  currency: string;
  isActive: boolean;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}

interface Loan {
  id: number;
  accountId: number;
  amount: number;
  currency: string;
  interestRate: number;
  term: number; 
  startDate: string;
  endDate?: string;
  status: string;
  creditScore?: number;
  createdAt: string;
}

interface Transaction {
  id: number;
  accountId: number;
  type: string;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  targetAccountId?: number;
  transactionDate: string;
  createdAt: string;
}

interface Event {
  id: number;
  eventId: string;
  type: string;
  occurredAt: string;
  payload: string;
  status: string;
  optioResponse?: string;
  createdAt: string;
}

interface ProductCatalog {
  id: number;
  type: string;
  code: string;
  name: string;
  description: string;
  details: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerProduct {
  id: number;
  clientId: number;
  productId: number;
  accountId?: number;
  status: string;
  appliedAt: string;
  approvedAt?: string;
  details?: any;
  createdAt: string;
  updatedAt: string;
  product?: ProductCatalog;
}

interface Card {
  id: number;
  customerProductId: number;
  accountId: number;
  cardNumber?: string;
  cardType: string;
  cardNetwork: string;
  expiryDate?: string;
  cardholderName: string;
  status: string;
  creditLimit?: number;
  availableCredit?: number;
  isContactless: boolean;
  isVirtual: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Deposit {
  id: number;
  customerProductId: number;
  accountId: number;
  depositType: string;
  amount: number;
  currency: string;
  interestRate: number;
  term?: number;
  maturityDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ClientDetailsPage() {
  const [_, params] = useRoute<{ id: string }>("/clients/:id");
  const clientId = params?.id ? parseInt(params.id) : 0;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch client data
  const { data: client, isLoading: isLoadingClient, isError: isErrorClient } = useQuery({
    queryKey: [`/api/clients/${clientId}`],
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: Client; message?: string }>(`/api/clients/${clientId}`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch client');
      }
      return response.data;
    },
    enabled: !!clientId
  });
  
  // Fetch client accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: [`/api/clients/${clientId}/accounts`],
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: Account[]; message?: string }>(`/api/clients/${clientId}/accounts`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch accounts');
      }
      return response.data;
    },
    enabled: !!clientId
  });
  
  // Fetch client transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: [`/api/clients/${clientId}/transactions`],
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: Transaction[]; message?: string }>(`/api/clients/${clientId}/transactions`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
      return response.data;
    },
    enabled: !!clientId
  });
  
  // Fetch client events
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: [`/api/clients/${clientId}/events`],
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: Event[]; message?: string }>(`/api/clients/${clientId}/events`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch events');
      }
      return response.data;
    },
    enabled: !!clientId
  });
  
  // Fetch customer products
  const { data: customerProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: [`/api/clients/${clientId}/products`],
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: CustomerProduct[]; message?: string }>(`/api/clients/${clientId}/products`);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch customer products');
      }
      return response.data;
    },
    enabled: !!clientId
  });
  
  if (isLoadingClient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (isErrorClient || !client) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
          <p className="text-muted-foreground mb-4">The client you're looking for could not be found.</p>
          <Button asChild><Link href="/clients">Back to Clients</Link></Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const clientName = client.type === 'business' && client.businessName ? client.businessName : client.name;
  
  // Create help context for this client
  const helpContext = {
    entity: clientName,
    entityType: client.type === 'person' ? 'person customer' : 'business customer',
    entityId: client.id,
    page: 'customer details',
    customerInfo: {
      accountCount: accounts?.length || 0,
      productCount: customerProducts?.length || 0,
      transactionCount: transactions?.length || 0,
    }
  };

  return (
    <WithHelpContext context={helpContext}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/clients">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{clientName}</h1>
              <p className="text-muted-foreground">
                {client.type === 'person' ? 'Person' : 'Business'} Client
              </p>
            </div>
          </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Type:</div>
                <div className="text-sm">{client.type === 'person' ? 'Person' : 'Business'}</div>
                
                <div className="text-sm font-medium">ID:</div>
                <div className="text-sm">{client.identifier}</div>
                
                {client.type === 'business' && client.businessName && (
                  <>
                    <div className="text-sm font-medium">Business Name:</div>
                    <div className="text-sm">{client.businessName}</div>
                    
                    <div className="text-sm font-medium">Contact:</div>
                    <div className="text-sm">{client.name}</div>
                  </>
                )}
                
                <div className="text-sm font-medium">Email:</div>
                <div className="text-sm truncate">{client.email}</div>
                
                {client.phone && (
                  <>
                    <div className="text-sm font-medium">Phone:</div>
                    <div className="text-sm">{client.phone}</div>
                  </>
                )}
                
                {client.address && (
                  <>
                    <div className="text-sm font-medium">Address:</div>
                    <div className="text-sm">{client.address}</div>
                  </>
                )}
                
                <div className="text-sm font-medium">Created:</div>
                <div className="text-sm">{new Date(client.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Products & Services</CardTitle>
                <CardDescription>Banking products and services for this client</CardDescription>
              </div>
              <ProductCatalogDialog 
                clientId={client.id} 
                clientName={clientName}
                accounts={accounts}
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <PiggyBank className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Accounts</span>
                  <span className="text-2xl font-bold">{accounts?.length || 0}</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <CreditCard className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Cards</span>
                  <span className="text-2xl font-bold">{customerProducts?.filter(p => p.product?.type === 'card')?.length || 0}</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <Receipt className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Loans</span>
                  <span className="text-2xl font-bold">{customerProducts?.filter(p => p.product?.type === 'loan')?.length || 0}</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <Package className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Products</span>
                  <span className="text-2xl font-bold">{customerProducts?.length || 0}</span>
                </div>
              </div>
              
              {isLoadingProducts ? (
                <div className="flex justify-center p-4 mt-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : customerProducts && customerProducts.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Active Products</h3>
                  <div className="grid gap-3">
                    {customerProducts.map(cp => (
                      <div key={cp.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {cp.product?.type === 'account' && <Landmark className="h-4 w-4 text-primary" />}
                            {cp.product?.type === 'card' && <CreditCard className="h-4 w-4 text-primary" />}
                            {cp.product?.type === 'loan' && <Receipt className="h-4 w-4 text-primary" />}
                            {cp.product?.type === 'deposit' && <PiggyBank className="h-4 w-4 text-primary" />}
                            {!cp.product?.type && <Package className="h-4 w-4 text-primary" />}
                          </div>
                          <div>
                            <div className="font-medium">{cp.product?.name || 'Unknown Product'}</div>
                            <div className="text-xs text-muted-foreground">
                              Added on {new Date(cp.appliedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            cp.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                            cp.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                            'bg-muted text-muted-foreground'
                          }`}>
                            {cp.status.charAt(0).toUpperCase() + cp.status.slice(1)}
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Accounts</CardTitle>
                  <CardDescription>Bank accounts owned by this client</CardDescription>
                </div>
                <AccountFormDialog 
                clientId={client.id} 
                clientName={clientName} 
              />
              </CardHeader>
              <CardContent>
                {isLoadingAccounts ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !accounts || accounts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Landmark className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Accounts Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      This client does not have any accounts yet. Create an account to enable banking services.
                    </p>
                    <AccountFormDialog 
                      clientId={client.id} 
                      clientName={clientName} 
                      trigger={<Button>Create Account</Button>}
                    />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {accounts.map(account => (
                      <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <PiggyBank className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{account.name}</div>
                            <div className="text-sm text-muted-foreground">{account.accountNumber}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">{new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: account.currency 
                            }).format(account.balance)}</div>
                            <div className="text-sm text-muted-foreground">{account.type}</div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/accounts/${account.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards">
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>Credit and debit cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Cards Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    This client does not have any cards yet. Issue a card linked to one of their accounts.
                  </p>
                  <Button>Issue New Card</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="loans">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Loans</CardTitle>
                  <CardDescription>Active and past loans</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Loan Application
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Loans</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    This client does not have any loans. Apply for a new loan.
                  </p>
                  <Button>Start Loan Application</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Recent transaction activity</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !transactions || transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Transactions</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      This client has not made any transactions yet. Transactions will appear once the client starts using their accounts.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {transactions.slice(0, 10).map(transaction => {
                      // Determine icon and color based on transaction type
                      let icon = <Wallet className="h-5 w-5" />;
                      let bgColor = "bg-primary/10";
                      let textColor = "text-primary";
                      
                      if (transaction.type === 'deposit') {
                        icon = <ArrowDown className="h-5 w-5" />;
                        bgColor = "bg-green-100 dark:bg-green-900";
                        textColor = "text-green-600 dark:text-green-400";
                      } else if (transaction.type === 'withdrawal') {
                        icon = <ArrowUp className="h-5 w-5" />;
                        bgColor = "bg-orange-100 dark:bg-orange-900";
                        textColor = "text-orange-600 dark:text-orange-400";
                      } else if (transaction.type === 'transfer') {
                        icon = <RefreshCw className="h-5 w-5" />;
                        bgColor = "bg-blue-100 dark:bg-blue-900";
                        textColor = "text-blue-600 dark:text-blue-400";
                      } else if (transaction.type === 'payment') {
                        icon = <CreditCard className="h-5 w-5" />;
                        bgColor = "bg-purple-100 dark:bg-purple-900";
                        textColor = "text-purple-600 dark:text-purple-400";
                      }
                      
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`${bgColor} p-2 rounded-full`}>
                              <div className={textColor}>
                                {icon}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium capitalize">{transaction.type}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(transaction.transactionDate).toLocaleDateString()} • 
                                {transaction.description || `Transaction #${transaction.id}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className={`font-medium ${
                              transaction.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 
                              transaction.type === 'withdrawal' ? 'text-red-600 dark:text-red-400' : ''
                            }`}>
                              {new Intl.NumberFormat('en-US', { 
                                style: 'currency', 
                                currency: transaction.currency 
                              }).format(transaction.amount)}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">{transaction.status}</div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {transactions.length > 10 && (
                      <div className="text-center mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/transactions?clientId=${client.id}`}>View All Transactions</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>Client activity events</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !events || events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="h-12 w-12 text-muted-foreground mb-4">🔔</div>
                    <h3 className="text-lg font-medium mb-2">No Events</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      No events have been recorded for this client yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {events.map(event => {
                      // Determine icon based on event type
                      let iconElement: React.ReactNode = <span>🔔</span>;
                      let bgColor = "bg-primary/10";
                      
                      if (event.type === 'account_created') {
                        iconElement = <span>🏦</span>;
                        bgColor = "bg-green-100 dark:bg-green-900";
                      } else if (event.type === 'transaction_completed') {
                        iconElement = <span>💸</span>;
                        bgColor = "bg-blue-100 dark:bg-blue-900";
                      } else if (event.type === 'loan_application') {
                        iconElement = <span>📝</span>;
                        bgColor = "bg-orange-100 dark:bg-orange-900";
                      } else if (event.type === 'kyc_verification') {
                        iconElement = <span>🔒</span>;
                        bgColor = "bg-purple-100 dark:bg-purple-900";
                      }
                      
                      // Try to parse payload for more details
                      let payloadObj: any = {};
                      try {
                        payloadObj = JSON.parse(event.payload);
                      } catch (e) {
                        // Ignore parsing error
                      }
                      
                      // Get description from payload or default to event ID
                      const eventDescription = 
                        typeof payloadObj === 'object' && 
                        payloadObj !== null && 
                        'description' in payloadObj && 
                        typeof payloadObj.description === 'string' 
                          ? payloadObj.description 
                          : `Event ID: ${event.eventId}`;
                      
                      return (
                        <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className={`${bgColor} p-2 rounded-full h-10 w-10 flex items-center justify-center text-lg`}>
                            {iconElement}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(event.occurredAt).toLocaleString()}
                            </div>
                            <div className="text-sm mt-1 text-muted-foreground">
                              {eventDescription}
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-muted">{event.status}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </DashboardLayout>
    </WithHelpContext>
  );
}