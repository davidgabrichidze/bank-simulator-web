import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

export interface CreateAccountData {
  clientId: number;
  name: string;
  type: string;
  balance?: string;
  currency?: string;
}

interface Account {
  id: number;
  accountNumber: string;
  clientId: number;
  name: string;
  type: string;
  balance: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccountFormDialogProps {
  clientId: number;
  clientName: string;
  trigger?: React.ReactNode;
  onSuccess?: (account: Account) => void;
}

export default function AccountFormDialog({ 
  clientId, 
  clientName,
  trigger,
  onSuccess
}: AccountFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('personal');
  const [balance, setBalance] = useState('0');
  const [currency, setCurrency] = useState('USD');
  
  const resetForm = () => {
    setName('');
    setType('personal');
    setBalance('0');
    setCurrency('USD');
  };
  
  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: async (accountData: CreateAccountData) => {
      return apiRequest<{ success: boolean; data: Account; message?: string }>('/api/accounts', {
        method: 'POST',
        body: accountData
      });
    },
    onSuccess: (response) => {
      // Invalidate queries to refresh the accounts list
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/accounts`] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      
      toast({
        title: "Account created",
        description: `New account '${name}' has been created for ${clientName}.`,
      });
      
      setOpen(false);
      resetForm();
      
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to create account",
        description: error.message || "An error occurred. Please try again.",
      });
    }
  });
  
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter an account name.",
      });
      return;
    }
    
    if (!type) {
      toast({
        variant: "destructive",
        title: "Type required",
        description: "Please select an account type.",
      });
      return;
    }
    
    // Create account data
    const accountData: CreateAccountData = {
      clientId,
      name,
      type,
      balance,
      currency
    };
    
    // Call the mutation
    createAccountMutation.mutate(accountData);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateAccount}>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Create a new account for client {clientName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Checking Account"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Account Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="balance">Initial Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(value) => setCurrency(value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={createAccountMutation.isPending}>
              {createAccountMutation.isPending ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}