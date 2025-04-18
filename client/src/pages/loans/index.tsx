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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Account, Loan, LoanPayment } from "@/types";

export default function LoansPage() {
  const { toast } = useToast();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [missedDialogOpen, setMissedDialogOpen] = useState(false);
  
  // Form state for loan application
  const [accountId, setAccountId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanCurrency, setLoanCurrency] = useState("USD");
  const [interestRate, setInterestRate] = useState("5.5");
  const [term, setTerm] = useState("12");
  const [startDate, setStartDate] = useState("");
  
  // Form state for payment
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  
  // Sample data - in a real app, this would come from an API
  const accounts: Account[] = [];
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
    
    // In a real app, this would call an API to apply for the loan
    toast({
      title: "Loan application submitted",
      description: `Applied for a ${loanCurrency} ${loanAmount} loan with ${interestRate}% interest over ${term} months.`,
    });
    
    setApplyDialogOpen(false);
    
    // Reset form
    setAccountId("");
    setLoanAmount("");
    setLoanCurrency("USD");
    setInterestRate("5.5");
    setTerm("12");
    setStartDate("");
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
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleLoanApplication}>
                <DialogHeader>
                  <DialogTitle>Loan Application</DialogTitle>
                  <DialogDescription>
                    Fill out the form to apply for a new loan.
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
            <div className="flex gap-4">
              <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Check className="mr-2 h-4 w-4" />
                    Pay Installment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handlePayLoanInstallment}>
                    <DialogHeader>
                      <DialogTitle>Pay Loan Installment</DialogTitle>
                      <DialogDescription>
                        Record a payment for a loan installment.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loan-select">Loan</Label>
                        <Select
                          value={selectedLoanId}
                          onValueChange={setSelectedLoanId}
                        >
                          <SelectTrigger id="loan-select">
                            <SelectValue placeholder="Select loan" />
                          </SelectTrigger>
                          <SelectContent>
                            {loans.length > 0 ? (
                              loans.map((loan) => (
                                <SelectItem key={loan.id} value={loan.id.toString()}>
                                  Loan #{loan.id} - {loan.amount} {loan.currency}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="demo-loan">Demo Loan #1 - $10,000</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="payment-select">Payment</Label>
                        <Select
                          value={selectedPaymentId}
                          onValueChange={setSelectedPaymentId}
                        >
                          <SelectTrigger id="payment-select">
                            <SelectValue placeholder="Select payment" />
                          </SelectTrigger>
                          <SelectContent>
                            {loanPayments.length > 0 ? (
                              loanPayments.map((payment) => (
                                <SelectItem key={payment.id} value={payment.id.toString()}>
                                  Payment #{payment.id} - Due {payment.dueDate} - ${payment.amount}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="demo-payment">Payment #1 - Due 2023-07-01 - $500</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="payment-date">Payment Date</Label>
                        <Input
                          id="payment-date"
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} type="button">
                        Cancel
                      </Button>
                      <Button type="submit">Pay</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Dialog open={missedDialogOpen} onOpenChange={setMissedDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Mark as Missed
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleMarkAsMissed}>
                    <DialogHeader>
                      <DialogTitle>Mark Installment as Missed</DialogTitle>
                      <DialogDescription>
                        Record a loan installment as missed.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loan-select-missed">Loan</Label>
                        <Select
                          value={selectedLoanId}
                          onValueChange={setSelectedLoanId}
                        >
                          <SelectTrigger id="loan-select-missed">
                            <SelectValue placeholder="Select loan" />
                          </SelectTrigger>
                          <SelectContent>
                            {loans.length > 0 ? (
                              loans.map((loan) => (
                                <SelectItem key={loan.id} value={loan.id.toString()}>
                                  Loan #{loan.id} - {loan.amount} {loan.currency}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="demo-loan">Demo Loan #1 - $10,000</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="payment-select-missed">Payment</Label>
                        <Select
                          value={selectedPaymentId}
                          onValueChange={setSelectedPaymentId}
                        >
                          <SelectTrigger id="payment-select-missed">
                            <SelectValue placeholder="Select payment" />
                          </SelectTrigger>
                          <SelectContent>
                            {loanPayments.length > 0 ? (
                              loanPayments.map((payment) => (
                                <SelectItem key={payment.id} value={payment.id.toString()}>
                                  Payment #{payment.id} - Due {payment.dueDate} - ${payment.amount}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="demo-payment">Payment #1 - Due 2023-07-01 - $500</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Warning</p>
                          <p className="text-xs">Marking a payment as missed may affect credit score and lead to late fees.</p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMissedDialogOpen(false)} type="button">
                        Cancel
                      </Button>
                      <Button variant="destructive" type="submit">Mark as Missed</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {loanPayments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">No loan payments</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    There are no loan payments to display. Apply for a loan to generate a payment schedule.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Loan Payment Schedule</CardTitle>
                  <CardDescription>View and manage upcoming loan payments</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Payment schedule table would go here */}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}