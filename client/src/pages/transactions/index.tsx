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
import { Account, Transaction } from "@/types";

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
    setReference("");
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
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleDeposit}>
                      <DialogHeader>
                        <DialogTitle>Cash Deposit</DialogTitle>
                        <DialogDescription>
                          Add funds to an account in the simulator.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
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
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleWithdrawal}>
                      <DialogHeader>
                        <DialogTitle>Cash Withdrawal</DialogTitle>
                        <DialogDescription>
                          Withdraw funds from an account in the simulator.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
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
          
          <TabsContent value="transfer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Internal Transfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Transfer funds between accounts in the simulator.</p>
                <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      Make Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleTransfer}>
                      <DialogHeader>
                        <DialogTitle>Internal Transfer</DialogTitle>
                        <DialogDescription>
                          Transfer funds between accounts in the simulator.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="from-account">From Account</Label>
                          <Select
                            value={accountId}
                            onValueChange={setAccountId}
                          >
                            <SelectTrigger id="from-account">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.length > 0 ? (
                                accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.accountNumber} ({account.currency})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="demo-account-1">Demo Account 1 (USD)</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="to-account">To Account</Label>
                          <Select
                            value={targetAccountId}
                            onValueChange={setTargetAccountId}
                          >
                            <SelectTrigger id="to-account">
                              <SelectValue placeholder="Select target account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.length > 0 ? (
                                accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.accountNumber} ({account.currency})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="demo-account-2">Demo Account 2 (EUR)</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
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
                          <Label htmlFor="reference">Reference (Optional)</Label>
                          <Input
                            id="reference"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Payment reference"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setTransferOpen(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit">Transfer</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="external" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>External Transfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Simulate SWIFT/SEPA transfers to external accounts.</p>
                <Dialog open={externalOpen} onOpenChange={setExternalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      Make External Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleExternalTransfer}>
                      <DialogHeader>
                        <DialogTitle>External Transfer</DialogTitle>
                        <DialogDescription>
                          Simulate SWIFT/SEPA transfers to external accounts.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="from-account">From Account</Label>
                          <Select
                            value={accountId}
                            onValueChange={setAccountId}
                          >
                            <SelectTrigger id="from-account">
                              <SelectValue placeholder="Select source account" />
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
                        
                        <div className="grid gap-2">
                          <Label htmlFor="beneficiary-name">Beneficiary Name</Label>
                          <Input
                            id="beneficiary-name"
                            value={beneficiaryName}
                            onChange={(e) => setBeneficiaryName(e.target.value)}
                            placeholder="Enter beneficiary name"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="beneficiary-account">Beneficiary Account/IBAN</Label>
                          <Input
                            id="beneficiary-account"
                            value={beneficiaryAccount}
                            onChange={(e) => setBeneficiaryAccount(e.target.value)}
                            placeholder="Enter account number or IBAN"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="bank-code">Bank Code (BIC/SWIFT)</Label>
                          <Input
                            id="bank-code"
                            value={bankCode}
                            onChange={(e) => setBankCode(e.target.value)}
                            placeholder="Enter BIC or SWIFT code"
                          />
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
                          <Label htmlFor="reference">Reference (Optional)</Label>
                          <Input
                            id="reference"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Payment reference"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setExternalOpen(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit">Send Transfer</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Set up one-off or recurring payments between accounts.</p>
                <Dialog open={scheduledOpen} onOpenChange={setScheduledOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleScheduledPayment}>
                      <DialogHeader>
                        <DialogTitle>Schedule Payment</DialogTitle>
                        <DialogDescription>
                          Set up a one-off or recurring payment between accounts.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="from-account">From Account</Label>
                          <Select
                            value={accountId}
                            onValueChange={setAccountId}
                          >
                            <SelectTrigger id="from-account">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.length > 0 ? (
                                accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.accountNumber} ({account.currency})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="demo-account-1">Demo Account 1 (USD)</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="to-account">To Account</Label>
                          <Select
                            value={targetAccountId}
                            onValueChange={setTargetAccountId}
                          >
                            <SelectTrigger id="to-account">
                              <SelectValue placeholder="Select target account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.length > 0 ? (
                                accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.accountNumber} ({account.currency})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="demo-account-2">Demo Account 2 (EUR)</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
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
                          <Label htmlFor="frequency">Frequency</Label>
                          <Select
                            value={frequency}
                            onValueChange={setFrequency}
                          >
                            <SelectTrigger id="frequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one-off">One-off</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="reference">Reference (Optional)</Label>
                          <Input
                            id="reference"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Payment reference"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduledOpen(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit">Schedule</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}