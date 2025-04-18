import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Building2, 
  User,
  CreditCard, 
  Receipt, 
  PiggyBank,
  Loader2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define client types
interface Client {
  id: number;
  type: 'person' | 'business';
  name: string;
  identifier: string; // SSN for persons, business ID for businesses
  email: string;
  phone?: string;
  address?: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateClientData {
  type: 'person' | 'business';
  name: string;
  identifier: string;
  email: string;
  phone?: string;
  address?: string;
  businessName?: string;
}

export default function ClientsPage() {
  const [open, setOpen] = useState(false);
  const [clientType, setClientType] = useState<'person' | 'business'>('person');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  
  // Fetch clients
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: Client[]; message?: string }>('/api/clients');
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch clients');
      }
      return response.data;
    }
  });
  
  const clients = data || [];
  
  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (clientData: CreateClientData) => {
      return apiRequest<{ success: boolean; data: Client; message?: string }>('/api/clients', {
        method: 'POST',
        body: clientData
      });
    },
    onSuccess: () => {
      // Invalidate clients query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      
      toast({
        title: "Client created",
        description: `New ${clientType} client '${clientType === 'person' ? name : businessName}' has been created.`,
      });
      
      setOpen(false);
      
      // Reset form
      setName("");
      setIdentifier("");
      setEmail("");
      setPhone("");
      setAddress("");
      setBusinessName("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to create client",
        description: error.message || "An error occurred. Please try again.",
      });
    }
  });
  
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter a name.",
      });
      return;
    }
    
    if (!identifier) {
      toast({
        variant: "destructive",
        title: "Identifier required",
        description: clientType === 'person' ? "Please enter a SSN." : "Please enter a business ID.",
      });
      return;
    }
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address.",
      });
      return;
    }
    
    // Create client data object
    const clientData: CreateClientData = {
      type: clientType,
      name,
      identifier,
      email
    };
    
    if (phone) clientData.phone = phone;
    if (address) clientData.address = address;
    if (clientType === 'business' && businessName) clientData.businessName = businessName;
    
    // Call the mutation
    createClientMutation.mutate(clientData);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground">
              Manage clients and their banking products.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <form onSubmit={handleCreateClient}>
                <DialogHeader>
                  <DialogTitle>Create New Client</DialogTitle>
                  <DialogDescription>
                    Add a new person or business client to the banking system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client-type">Client Type</Label>
                    <Select
                      value={clientType}
                      onValueChange={(value) => setClientType(value as 'person' | 'business')}
                    >
                      <SelectTrigger id="client-type">
                        <SelectValue placeholder="Select client type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="person">Person</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {clientType === 'business' && (
                    <div className="grid gap-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Enter business name"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{clientType === 'person' ? 'Full Name' : 'Contact Person'}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="identifier">{clientType === 'person' ? 'SSN/Tax ID' : 'Business ID'}</Label>
                      <Input
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={clientType === 'person' ? "123-45-6789" : "B123456789"}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Create Client</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="persons">Persons</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {clients.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">No clients yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    Create your first client to get started with banking operations.
                    You can add persons or businesses.
                  </p>
                  <Button className="mt-4" onClick={() => setOpen(true)}>Create Client</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Client cards would go here */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">John Doe</CardTitle>
                      <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">Person</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      <div>ID: XXX-XX-1234</div>
                      <div>john.doe@example.com</div>
                      <div>(555) 123-4567</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="text-xs bg-muted rounded-full px-2 py-1 flex items-center">
                        <CreditCard className="w-3 h-3 mr-1" /> 2 Cards
                      </div>
                      <div className="text-xs bg-muted rounded-full px-2 py-1 flex items-center">
                        <PiggyBank className="w-3 h-3 mr-1" /> 1 Account
                      </div>
                      <div className="text-xs bg-muted rounded-full px-2 py-1 flex items-center">
                        <Receipt className="w-3 h-3 mr-1" /> 1 Loan
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">View Details</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Acme Inc.</CardTitle>
                      <div className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full px-2 py-1">Business</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      <div>ID: B98765432</div>
                      <div>contact@acme.com</div>
                      <div>(555) 987-6543</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="text-xs bg-muted rounded-full px-2 py-1 flex items-center">
                        <CreditCard className="w-3 h-3 mr-1" /> 3 Cards
                      </div>
                      <div className="text-xs bg-muted rounded-full px-2 py-1 flex items-center">
                        <PiggyBank className="w-3 h-3 mr-1" /> 2 Accounts
                      </div>
                      <div className="text-xs bg-muted rounded-full px-2 py-1 flex items-center">
                        <Receipt className="w-3 h-3 mr-1" /> 0 Loans
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">View Details</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="persons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Persons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">No person clients yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    Create your first person client.
                  </p>
                  <Button className="mt-4" onClick={() => {setClientType('person'); setOpen(true);}}>Create Person</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="businesses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">No business clients yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    Create your first business client.
                  </p>
                  <Button className="mt-4" onClick={() => {setClientType('business'); setOpen(true);}}>Create Business</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}