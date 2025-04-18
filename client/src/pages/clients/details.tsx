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
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
  
  return (
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
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
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
                  <span className="text-2xl font-bold">0</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <Receipt className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Loans</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <Wallet className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Transactions</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
              </div>
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Account
                </Button>
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
                    <Button>Create Account</Button>
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
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Transactions</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    This client has not made any transactions yet. Transactions will appear once the client starts using their accounts.
                  </p>
                </div>
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
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 text-muted-foreground mb-4">🔔</div>
                  <h3 className="text-lg font-medium mb-2">No Events</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    No events have been recorded for this client yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}