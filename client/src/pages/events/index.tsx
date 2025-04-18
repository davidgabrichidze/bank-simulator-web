import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Sample data - in a real app, this would come from an API
  const events = [];

  const openEventDetails = (event: any) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Sent
        </Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="h-3 w-3 mr-1" /> Failed
        </Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Feed</h1>
          <p className="text-muted-foreground">
            Real-time log of all banking operations and their Optio CDP integration status.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Events
            </CardTitle>
            <CardDescription>
              All banking operations are logged here with their status in Optio CDP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-lg font-medium">No events yet</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-md">
                  Events will appear here as you perform banking operations in the simulator.
                  Each operation will be sent to Optio CDP and tracked here.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Event ID</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample row - in a real app, this would be generated from API data */}
                    <TableRow>
                      <TableCell className="font-medium">deposit-made</TableCell>
                      <TableCell>{formatDate(new Date().toISOString())}</TableCell>
                      <TableCell>{getStatusBadge('sent')}</TableCell>
                      <TableCell className="font-mono text-xs">a1b2c3d4-e5f6-7g8h-9i0j</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEventDetails({
                          type: 'deposit-made',
                          occurredAt: new Date().toISOString(),
                          status: 'sent',
                          eventId: 'a1b2c3d4-e5f6-7g8h-9i0j',
                          payload: JSON.stringify({
                            accountId: 'A123',
                            amount: 150.00,
                            currency: 'USD',
                            channel: 'web-simulator'
                          }, null, 2),
                          optioResponse: JSON.stringify({
                            success: true,
                            receivedAt: new Date().toISOString(),
                            status: 'accepted'
                          }, null, 2)
                        })}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
              <DialogDescription>
                Information about the event and its processing in Optio CDP.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Event Type</h3>
                    <p className="text-sm">{selectedEvent.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Event ID</h3>
                    <p className="text-sm font-mono">{selectedEvent.eventId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Occurred At</h3>
                    <p className="text-sm">{formatDate(selectedEvent.occurredAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className="text-sm">{getStatusBadge(selectedEvent.status)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Event Payload</h3>
                  <pre className="mt-1 rounded-md bg-muted p-4 overflow-auto text-xs">
                    {selectedEvent.payload}
                  </pre>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Optio Response</h3>
                  <pre className="mt-1 rounded-md bg-muted p-4 overflow-auto text-xs">
                    {selectedEvent.optioResponse}
                  </pre>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Optio Dashboard
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}