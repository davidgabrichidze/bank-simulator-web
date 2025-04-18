import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Link } from "wouter";
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

export default function AccountsPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [accountType, setAccountType] = useState("personal");
  const [currency, setCurrency] = useState("USD");
  const [initialBalance, setInitialBalance] = useState("");

  // Sample data - in a real app, this would come from an API
  const accounts = [];

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!initialBalance || isNaN(Number(initialBalance)) || Number(initialBalance) < 0) {
      toast({
        variant: "destructive",
        title: "Invalid balance",
        description: "Please enter a valid initial balance amount.",
      });
      return;
    }

    // In a real app, this would call an API to create the account
    toast({
      title: "Account created",
      description: `New ${accountType} account created with initial balance of ${currency} ${initialBalance}`,
    });
    
    setOpen(false);
    
    // Reset form
    setAccountType("personal");
    setCurrency("USD");
    setInitialBalance("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage bank accounts and view their details.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateAccount}>
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
                  <DialogDescription>
                    Set up a new bank account in the simulator.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="account-type">Account Type</Label>
                    <Select
                      value={accountType}
                      onValueChange={setAccountType}
                    >
                      <SelectTrigger id="account-type">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={currency}
                      onValueChange={setCurrency}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="initial-balance">Initial Balance</Label>
                    <Input
                      id="initial-balance"
                      type="number"
                      step="0.01"
                      min="0"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Create Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {accounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-muted p-3">
                <PlusCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-3 text-lg font-medium">No accounts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                Create your first account to get started with the simulator.
                You can create personal or business accounts with different currencies.
              </p>
              <DialogTrigger asChild>
                <Button className="mt-4">Create Account</Button>
              </DialogTrigger>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Account cards would go here */}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}