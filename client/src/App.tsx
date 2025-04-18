import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AccountsPage from "@/pages/accounts";
import TransactionsPage from "@/pages/transactions";
import LoansPage from "@/pages/loans";
import EventsPage from "@/pages/events";
import AdminPage from "@/pages/admin";
import ClientsPage from "@/pages/clients";
import SimulatorPage from "@/pages/simulator";
import GeneratorPage from "@/pages/generator";

function Router() {
  return (
    <Switch>
      {/* Main pages */}
      <Route path="/" component={Dashboard}/>
      <Route path="/clients" component={ClientsPage}/>
      <Route path="/accounts" component={AccountsPage}/>
      <Route path="/transactions" component={TransactionsPage}/>
      <Route path="/loans" component={LoansPage}/>
      <Route path="/simulator" component={SimulatorPage}/>
      <Route path="/generator" component={GeneratorPage}/>
      <Route path="/events" component={EventsPage}/>
      <Route path="/admin" component={AdminPage}/>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
