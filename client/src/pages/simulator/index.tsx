import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Smartphone, 
  Monitor, 
  CreditCard, 
  DollarSign, 
  Wallet, 
  ExternalLink, 
  Clock,
  LayoutGrid
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function SimulatorPage() {
  const [clientId, setClientId] = useState("");
  const [channel, setChannel] = useState("web");
  const { toast } = useToast();
  
  // Normally this data would come from an API
  const clients = [
    { id: "C123", name: "John Doe", type: "person" },
    { id: "C124", name: "Acme Inc.", type: "business" },
  ];
  
  const launchSimulator = () => {
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Client required",
        description: "Please select a client to simulate.",
      });
      return;
    }
    
    toast({
      title: "Simulator launched",
      description: `Digital channel simulator launched for client in ${channel} mode.`,
    });
  };
  
  // This would be a styled representation of the digital channel simulator
  const renderSimulatorInterface = () => {
    if (channel === "web") {
      return (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted p-2 flex items-center space-x-2 border-b">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-xs font-medium">Bank Web Interface</div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <div className="font-bold text-lg">My Banking</div>
              <div className="text-sm">Welcome, {clients.find(c => c.id === clientId)?.name || 'User'}</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border shadow-none">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <Wallet className="h-6 w-6 mb-2 text-primary" />
                  <div className="text-sm font-medium">Accounts</div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-none">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <CreditCard className="h-6 w-6 mb-2 text-primary" />
                  <div className="text-sm font-medium">Cards</div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-none">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <DollarSign className="h-6 w-6 mb-2 text-primary" />
                  <div className="text-sm font-medium">Payments</div>
                </CardContent>
              </Card>
              
              <Card className="border shadow-none">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <ExternalLink className="h-6 w-6 mb-2 text-primary" />
                  <div className="text-sm font-medium">Transfers</div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-4">
                  No recent transactions to display
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button>Make New Transaction</Button>
            </div>
          </div>
        </div>
      );
    } else if (channel === "ios" || channel === "android") {
      return (
        <div className="max-w-[320px] mx-auto border rounded-[30px] overflow-hidden shadow-lg p-1 bg-muted">
          <div className="bg-muted rounded-[25px] overflow-hidden">
            <div className="bg-black text-white p-2 flex justify-center relative">
              <div className="absolute top-0 left-0 right-0 h-6 flex justify-center">
                <div className="w-32 h-5 bg-black rounded-b-xl"></div>
              </div>
              <div className="mt-4 text-xs">12:34</div>
            </div>
            
            <div className="bg-white p-4">
              <div className="text-center mb-4">
                <div className="font-bold text-lg">{channel === "ios" ? 'iOS' : 'Android'} Banking App</div>
                <div className="text-xs text-muted-foreground">Client: {clients.find(c => c.id === clientId)?.name || 'Unknown'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="border rounded p-2 flex flex-col items-center text-center">
                  <Wallet className="h-5 w-5 mb-1 text-primary" />
                  <div className="text-xs font-medium">Accounts</div>
                </div>
                <div className="border rounded p-2 flex flex-col items-center text-center">
                  <CreditCard className="h-5 w-5 mb-1 text-primary" />
                  <div className="text-xs font-medium">Cards</div>
                </div>
                <div className="border rounded p-2 flex flex-col items-center text-center">
                  <DollarSign className="h-5 w-5 mb-1 text-primary" />
                  <div className="text-xs font-medium">Pay</div>
                </div>
              </div>
              
              <Card className="mb-4 shadow-none">
                <CardContent className="p-3">
                  <div className="text-sm font-medium mb-2">Main Account</div>
                  <div className="text-2xl font-bold mb-1">$1,234.56</div>
                  <div className="text-xs text-muted-foreground">**** 1234</div>
                </CardContent>
              </Card>
              
              <div className="text-xs font-medium mb-2">Recent Transactions</div>
              <div className="space-y-2 mb-4">
                <div className="text-xs text-muted-foreground text-center p-2 border rounded">
                  No transactions to display
                </div>
              </div>
              
              <Button size="sm" className="w-full">Make Transaction</Button>
              
              <div className="flex justify-between mt-6 pt-2 border-t">
                <div className="flex flex-col items-center text-xs">
                  <Wallet className="h-4 w-4" />
                  <span>Home</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <CreditCard className="h-4 w-4" />
                  <span>Cards</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <Clock className="h-4 w-4" />
                  <span>History</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <LayoutGrid className="h-4 w-4" />
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Channel Simulator</h1>
          <p className="text-muted-foreground">
            Simulate client banking experiences across different digital channels.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Launch Simulator</CardTitle>
            <CardDescription>
              Select a client and digital channel to simulate the banking experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="space-y-2">
                <Label htmlFor="client-select">Select Client</Label>
                <Select
                  value={clientId}
                  onValueChange={setClientId}
                >
                  <SelectTrigger id="client-select">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="channel-select">Digital Channel</Label>
                <Select
                  value={channel}
                  onValueChange={setChannel}
                >
                  <SelectTrigger id="channel-select">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">
                      <div className="flex items-center">
                        <Monitor className="mr-2 h-4 w-4" />
                        Web Banking
                      </div>
                    </SelectItem>
                    <SelectItem value="ios">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4" />
                        iOS Mobile Banking
                      </div>
                    </SelectItem>
                    <SelectItem value="android">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Android Mobile Banking
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={launchSimulator} disabled={!clientId}>
              Launch Simulator
            </Button>
          </CardContent>
        </Card>
        
        <Tabs defaultValue={channel} value={channel} onValueChange={setChannel}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="web">
              <Monitor className="mr-2 h-4 w-4" />
              Web Banking
            </TabsTrigger>
            <TabsTrigger value="ios">
              <Smartphone className="mr-2 h-4 w-4" />
              iOS Banking
            </TabsTrigger>
            <TabsTrigger value="android">
              <Smartphone className="mr-2 h-4 w-4" />
              Android Banking
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="web" className="mt-6">
            {clientId ? renderSimulatorInterface() : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Monitor className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">Web Banking Simulator</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    Please select a client to launch the web banking simulator.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="ios" className="mt-6">
            {clientId ? renderSimulatorInterface() : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">iOS Banking Simulator</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    Please select a client to launch the iOS banking simulator.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="android" className="mt-6">
            {clientId ? renderSimulatorInterface() : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium">Android Banking Simulator</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    Please select a client to launch the Android banking simulator.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}