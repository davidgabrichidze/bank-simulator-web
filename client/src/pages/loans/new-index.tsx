import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Check,
  X,
  AlertCircle
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Account, Client, Loan, LoanPayment, ProductCatalog } from "@/types";

export default function LoansPage() {
  const { toast } = useToast();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [missedDialogOpen, setMissedDialogOpen] = useState(false);
  
  // Form state for loan application
  const [accountId, setAccountId] = useState("");
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanCurrency, setLoanCurrency] = useState("USD");
  const [interestRate, setInterestRate] = useState("5.5");
  const [term, setTerm] = useState("12");
  const [startDate, setStartDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [collateral, setCollateral] = useState("");
  
  // Form state for payment
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  
  // Sample data - in a real app, this would come from an API
  const accounts: Account[] = [];
  const clients: Client[] = [];
  const loanProducts: ProductCatalog[] = [];
  const loans: Loan[] = [];
  const loanPayments: LoanPayment[] = [];

  const handleLoanApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!accountId) {
      toast({
        variant: "destructive",
        title: "Account required",
        description: "Please select an account for the loan.",
      });
      return;
    }
    
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Customer required",
        description: "Please select a customer for the loan.",
      });
      return;
    }
    
    if (!loanAmount || isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid loan amount.",
      });
      return;
    }
    
    if (!interestRate || isNaN(Number(interestRate)) || Number(interestRate) < 0) {
      toast({
        variant: "destructive",
        title: "Invalid interest rate",
        description: "Please enter a valid interest rate percentage.",
      });
      return;
    }
    
    if (!term || isNaN(Number(term)) || Number(term) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid term",
        description: "Please enter a valid loan term in months.",
      });
      return;
    }
    
    if (!startDate) {
      toast({
        variant: "destructive",
        title: "Start date required",
        description: "Please select a start date for the loan.",
      });
      return;
    }
    
    if (!purpose) {
      toast({
        variant: "destructive",
        title: "Purpose required",
        description: "Please specify the purpose of the loan.",
      });
      return;
    }
    
    // In a real app, this would call an API to apply for the loan
    toast({
      title: "Loan application submitted",
      description: `Applied for a ${loanCurrency} ${loanAmount} loan with ${interestRate}% interest over ${term} months.`,
    });
    
    setApplyDialogOpen(false);
    
    // Reset form
    setAccountId("");
    setClientId("");
    setProductId("");
    setLoanAmount("");
    setLoanCurrency("USD");
    setInterestRate("5.5");
    setTerm("12");
    setStartDate("");
    setPurpose("");
    setCollateral("");
  };

  const handlePayLoanInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedLoanId) {
      toast({
        variant: "destructive",
        title: "Loan required",
        description: "Please select a loan.",
      });
      return;
    }
    
    if (!selectedPaymentId) {
      toast({
        variant: "destructive",
        title: "Payment required",
        description: "Please select a payment installment.",
      });
      return;
    }
    
    if (!paymentDate) {
      toast({
        variant: "destructive",
        title: "Payment date required",
        description: "Please select a payment date.",
      });
      return;
    }
    
    // In a real app, this would call an API to process the payment
    toast({
      title: "Payment successful",
      description: `Payment processed for loan #${selectedLoanId}, installment #${selectedPaymentId}.`,
    });
    
    setPaymentDialogOpen(false);
    
    // Reset form
    setSelectedLoanId("");
    setSelectedPaymentId("");
    setPaymentDate("");
  };

  const handleMarkAsMissed = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedLoanId) {
      toast({
        variant: "destructive",
        title: "Loan required",
        description: "Please select a loan.",
      });
      return;
    }
    
    if (!selectedPaymentId) {
      toast({
        variant: "destructive",
        title: "Payment required",
        description: "Please select a payment installment.",
      });
      return;
    }
    
    // In a real app, this would call an API to mark the payment as missed
    toast({
      title: "Payment marked as missed",
      description: `Installment #${selectedPaymentId} for loan #${selectedLoanId} has been marked as missed.`,
    });
    
    setMissedDialogOpen(false);
    
    // Reset form
    setSelectedLoanId("");
    setSelectedPaymentId("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
            <p className="text-muted-foreground">
              Apply for loans and manage loan payments.
            </p>
          </div>
          <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <form onSubmit={handleLoanApplication}>
                <DialogHeader>
                  <DialogTitle>Loan Application</DialogTitle>
                  <DialogDescription>
                    Fill out the form to apply for a new loan.
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
                    <Label htmlFor="product">Loan Product (Optional)</Label>
                    <Select
                      value={productId}
                      onValueChange={setProductId}
                    >
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select loan product" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanProducts.length > 0 ? (
                          loanProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="demo-product">Standard Personal Loan</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="loan-amount">Loan Amount</Label>
                      <Input
                        id="loan-amount"
                        type="number"
                        step="0.01"
                        min="100"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="loan-currency">Currency</Label>
                      <Select
                        value={loanCurrency}
                        onValueChange={setLoanCurrency}
                      >
                        <SelectTrigger id="loan-currency">
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                      <Input
                        id="interest-rate"
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="30"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="Enter interest rate"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="term">Term (months)</Label>
                      <Input
                        id="term"
                        type="number"
                        step="1"
                        min="1"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Enter loan term"
                      />
                    </div>
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
                    <Label htmlFor="purpose">Loan Purpose</Label>
                    <Input
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="E.g., Home Improvement, Education, Business"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="collateral">Collateral (Optional)</Label>
                    <Textarea
                      id="collateral"
                      value={collateral}
                      onChange={(e) => setCollateral(e.target.value)}
                      placeholder="Describe any collateral for this loan"
                      className="resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setApplyDialogOpen(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Apply</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="loans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="loans">Active Loans</TabsTrigger>
            <TabsTrigger value="payments">Loan Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="loans" className="space-y-4">
            {loans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">No active loans</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    You don't have any active loans. Apply for a loan to get started.
                  </p>
                  <Button className="mt-4" onClick={() => setApplyDialogOpen(true)}>Apply for Loan</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {/* Loan cards would go here */}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            {/* Payment content */}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}