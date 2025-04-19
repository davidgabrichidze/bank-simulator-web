import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ArrowRightLeft,
  Calendar
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
import { Account, Client, Transaction } from "@/types";

export default function TransactionsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deposit");
  
  // Dialog state
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [externalOpen, setExternalOpen] = useState(false);
  const [scheduledOpen, setScheduledOpen] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [clientId, setClientId] = useState("");
  const [targetAccountId, setTargetAccountId] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryAccount, setBeneficiaryAccount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [channel, setChannel] = useState("online");
  const [method, setMethod] = useState("transfer");
  const [frequency, setFrequency] = useState("one-off");
  const [startDate, setStartDate] = useState("");
  
  // Sample data - in a real app, this would come from an API
  const accounts: Account[] = [];
  const clients: Client[] = [];
  const transactions: Transaction[] = [];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
      });
      return;
    }
    
    if (!accountId) {
      toast({
        variant: "destructive",
        title: "Account required",
        description: "Please select an account for the deposit.",
      });
      return;
    }
    
    // In a real app, this would call an API to process the deposit
    toast({
      title: "Deposit successful",
      description: `Deposited $${amount} to account #${accountId}`,
    });
    
    setDepositOpen(false);
    setAmount("");
    setAccountId("");
    setDescription("");
    setChannel("online");
    setMethod("transfer");
  };
  
  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
      });
      return;
    }
    
    if (!accountId) {
      toast({
        variant: "destructive",
        title: "Account required",
        description: "Please select an account for the withdrawal.",
      });
      return;
    }
    
    // In a real app, this would call an API to process the withdrawal
    toast({
      title: "Withdrawal successful",
      description: `Withdrew $${amount} from account #${accountId}`,
    });
    
    setWithdrawOpen(false);
    setAmount("");
    setAccountId("");
    setDescription("");
    setChannel("online");
    setMethod("transfer");
  };
  
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid transfer amount.",
      });
      return;
    }
    
    if (!accountId) {
      toast({
        variant: "destructive",
        title: "Source account required",
        description: "Please select a source account.",
      });
      return;
    }
    
    if (!targetAccountId) {
      toast({
        variant: "destructive",
        title: "Target account required",
        description: "Please select a target account.",
      });
      return;
    }
    
    if (accountId === targetAccountId) {
      toast({
        variant: "destructive",
        title: "Invalid accounts",
        description: "Source and target accounts must be different.",
      });
      return;
    }
    
    // In a real app, this would call an API to process the transfer
    toast({
      title: "Transfer successful",
      description: `Transferred $${amount} from account #${accountId} to #${targetAccountId}`,
    });
    
    setTransferOpen(false);
    setAmount("");
    setAccountId("");
    setTargetAccountId("");
    setDescription("");
    setReference("");
    setChannel("online");
    setMethod("transfer");
  };
  
  const handleExternalTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid transfer amount.",
      });
      return;
    }
    
    if (!accountId) {
      toast({
        variant: "destructive",
        title: "Source account required",
        description: "Please select a source account.",
      });
      return;
    }
    
    if (!beneficiaryName || !beneficiaryAccount || !bankCode) {
      toast({
        variant: "destructive",
        title: "Beneficiary details required",
        description: "Please complete all beneficiary fields.",
      });
      return;
    }
    
    // In a real app, this would call an API to process the external transfer
    toast({
      title: "External transfer initiated",
      description: `Transferred $${amount} from account #${accountId} to ${beneficiaryName}`,
    });
    
    setExternalOpen(false);
    setAmount("");
    setAccountId("");
    setBeneficiaryName("");
    setBeneficiaryAccount("");
    setBankCode("");
    setDescription("");
    setReference("");
    setChannel("online");
    setMethod("transfer");
  };
  
  const handleScheduledPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid payment amount.",
      });
      return;
    }
    
    if (!accountId) {
      toast({
        variant: "destructive",
        title: "Source account required",
        description: "Please select a source account.",
      });
      return;
    }
    
    if (!targetAccountId) {
      toast({
        variant: "destructive",
        title: "Target account required",
        description: "Please select a target account.",
      });
      return;
    }
    
    if (!startDate) {
      toast({
        variant: "destructive",
        title: "Start date required",
        description: "Please select a start date for the payment.",
      });
      return;
    }
    
    // In a real app, this would call an API to schedule the payment
    toast({
      title: "Payment scheduled",
      description: `Scheduled ${frequency} payment of $${amount} from account #${accountId} to #${targetAccountId} starting ${startDate}`,
    });
    
    setScheduledOpen(false);
    setAmount("");
    setAccountId("");
    setTargetAccountId("");
    setFrequency("one-off");
    setStartDate("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Process various types of banking transactions.
          </p>
        </div>
        
        <Tabs defaultValue="deposit" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="external">External Transfer</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Deposit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Add funds to an account in the simulator.</p>
                <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Make Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleDeposit}>
                      <DialogHeader>
                        <DialogTitle>Cash Deposit</DialogTitle>
                        <DialogDescription>
                          Add funds to an account in the simulator.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="client">Customer</Label>
                            <Select
                              value={clientId}
                              onValueChange={setClientId}
                            >
                              <SelectTrigger id="client">
                                <SelectValue placeholder="Select customer" />
                              </SelectTrigger>
                              <SelectContent>
                                {clients.length > 0 ? (
                                  clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                      {client.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="demo-client">Demo Customer</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="account">Account</Label>
                            <Select
                              value={accountId}
                              onValueChange={setAccountId}
                            >
                              <SelectTrigger id="account">
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.length > 0 ? (
                                  accounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                      {account.accountNumber} ({account.currency})
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="demo-account">Demo Account (USD)</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Transaction description"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="channel">Channel</Label>
                            <Select
                              value={channel}
                              onValueChange={setChannel}
                            >
                              <SelectTrigger id="channel">
                                <SelectValue placeholder="Select channel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="branch">Branch</SelectItem>
                                <SelectItem value="atm">ATM</SelectItem>
                                <SelectItem value="pos">POS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="method">Method</Label>
                            <Select
                              value={method}
                              onValueChange={setMethod}
                            >
                              <SelectTrigger id="method">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="check">Check</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDepositOpen(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit">Deposit</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Withdrawal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Withdraw funds from an account in the simulator.</p>
                <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <ArrowUpFromLine className="mr-2 h-4 w-4" />
                      Make Withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleWithdrawal}>
                      <DialogHeader>
                        <DialogTitle>Cash Withdrawal</DialogTitle>
                        <DialogDescription>
                          Withdraw funds from an account in the simulator.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="client">Customer</Label>
                            <Select
                              value={clientId}
                              onValueChange={setClientId}
                            >
                              <SelectTrigger id="client">
                                <SelectValue placeholder="Select customer" />
                              </SelectTrigger>
                              <SelectContent>
                                {clients.length > 0 ? (
                                  clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                      {client.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="demo-client">Demo Customer</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="account">Account</Label>
                            <Select
                              value={accountId}
                              onValueChange={setAccountId}
                            >
                              <SelectTrigger id="account">
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts.length > 0 ? (
                                  accounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                      {account.accountNumber} ({account.currency})
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="demo-account">Demo Account (USD)</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Transaction description"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="channel">Channel</Label>
                            <Select
                              value={channel}
                              onValueChange={setChannel}
                            >
                              <SelectTrigger id="channel">
                                <SelectValue placeholder="Select channel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="branch">Branch</SelectItem>
                                <SelectItem value="atm">ATM</SelectItem>
                                <SelectItem value="pos">POS</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="method">Method</Label>
                            <Select
                              value={method}
                              onValueChange={setMethod}
                            >
                              <SelectTrigger id="method">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="check">Check</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setWithdrawOpen(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit">Withdraw</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transfer tab - similar structure with added fields */}
          <TabsContent value="transfer" className="space-y-4">
            {/* Transfer card content */}
          </TabsContent>
          
          {/* External Transfer tab - similar structure with added fields */}
          <TabsContent value="external" className="space-y-4">
            {/* External Transfer card content */}
          </TabsContent>
          
          {/* Scheduled Payments tab - similar structure with added fields */}
          <TabsContent value="scheduled" className="space-y-4">
            {/* Scheduled Payments card content */}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}