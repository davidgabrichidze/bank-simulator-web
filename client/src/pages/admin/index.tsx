import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  RefreshCw,
  ToggleLeft,
  ExternalLink,
  Settings
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AdminPage() {
  const { toast } = useToast();
  const [optioSyncEnabled, setOptioSyncEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Optio API response states
  const [lastRequest, setLastRequest] = useState<any>({
    eventId: "a1b2c3d4-e5f6-7g8h-9i0j",
    type: "deposit-made",
    occurredAt: new Date().toISOString(),
    payload: {
      accountId: "A123",
      amount: 150.00,
      currency: "USD",
      channel: "web-simulator"
    }
  });
  
  const [lastResponse, setLastResponse] = useState<any>({
    success: true,
    eventId: "a1b2c3d4-e5f6-7g8h-9i0j",
    receivedAt: new Date().toISOString(),
    status: "accepted"
  });

  const handleToggleOptioSync = () => {
    // In a real app, this would call an API to update the setting
    setOptioSyncEnabled(!optioSyncEnabled);
    
    toast({
      title: "Optio sync setting updated",
      description: `Optio CDP integration is now ${!optioSyncEnabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleToggleDarkMode = () => {
    // In a real app, this would call an API to update the setting
    setDarkMode(!darkMode);
    
    toast({
      title: "Dark mode setting updated",
      description: `Dark mode is now ${!darkMode ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleResetDatabase = () => {
    // In a real app, this would call an API to reset the database
    toast({
      title: "Database reset successfully",
      description: "All simulator data has been reset to defaults.",
    });
  };

  const handleUpdateOptioToken = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('optio-token') as string;
    
    if (!token) {
      toast({
        variant: "destructive",
        title: "Token required",
        description: "Please enter a valid Optio API token.",
      });
      return;
    }
    
    // In a real app, this would call an API to update the token
    toast({
      title: "Optio API token updated",
      description: "Your Optio CDP API token has been updated successfully.",
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure simulator settings and manage Optio CDP integration.
          </p>
        </div>
        
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="optio">Optio API</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simulator Settings</CardTitle>
                <CardDescription>
                  Configure how the bank operations simulator behaves.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="optio-sync" className="flex flex-col space-y-1">
                    <span>Optio CDP Integration</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Send all banking events to Optio CDP API
                    </span>
                  </Label>
                  <Switch
                    id="optio-sync"
                    checked={optioSyncEnabled}
                    onCheckedChange={handleToggleOptioSync}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>Dark Mode</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </span>
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleToggleDarkMode}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Optio API Configuration</CardTitle>
                <CardDescription>
                  Set up your Optio CDP API credentials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateOptioToken} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="optio-token">Optio API Token</Label>
                    <Input
                      id="optio-token"
                      name="optio-token"
                      type="password"
                      placeholder="Enter your Optio API token"
                    />
                    <p className="text-sm text-muted-foreground">
                      This token is used to authenticate requests to the Optio CDP API.
                    </p>
                  </div>
                  <Button type="submit">Update Token</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="optio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optio API Integration</CardTitle>
                <CardDescription>
                  View the last API request and response to Optio CDP.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Integration Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${optioSyncEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{optioSyncEnabled ? 'Connected' : 'Disconnected'}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Last API Request</h3>
                    <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                      {JSON.stringify(lastRequest, null, 2)}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Last API Response</h3>
                    <pre className="rounded-md bg-muted p-4 overflow-auto text-xs">
                      {JSON.stringify(lastResponse, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Optio Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reset" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Reset Simulator
                </CardTitle>
                <CardDescription>
                  Reset the simulator database and return to initial state. This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Database
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete all accounts, transactions, loans, and events from the simulator database.
                        Settings and configuration will be preserved.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetDatabase}>
                        Reset Database
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}