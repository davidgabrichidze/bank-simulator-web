import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  AlertTriangle, 
  Play, 
  Pause, 
  StopCircle, 
  Clock,
  Zap 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GeneratorPage() {
  const [clientCount, setClientCount] = useState<number>(100);
  const [operationRate, setOperationRate] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedClients, setGeneratedClients] = useState<number>(0);
  const [generatedOperations, setGeneratedOperations] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("00:00:00");
  
  const { toast } = useToast();
  
  const handleStartGenerator = () => {
    if (clientCount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid client count",
        description: "Please enter a number between 1 and 5,000,000.",
      });
      return;
    }
    
    setIsGenerating(true);
    setIsPaused(false);
    setProgress(0);
    setGeneratedClients(0);
    setGeneratedOperations(0);
    
    // Simulate generation process
    setTimeout(() => {
      setProgress(5);
      setGeneratedClients(Math.floor(clientCount * 0.05));
      setEstimatedTime("00:04:30");
      
      // This would be a real backend call in production
      setTimeout(() => updateProgress(), 1000);
    }, 500);
    
    toast({
      title: "Generator started",
      description: `Generating demo traffic for ${clientCount.toLocaleString()} clients.`,
    });
  };
  
  const updateProgress = () => {
    if (!isGenerating || isPaused) return;
    
    const newProgress = Math.min(progress + 1, 100);
    const clientsGenerated = Math.floor(clientCount * (newProgress / 100));
    const operationsGenerated = Math.floor(clientsGenerated * 2.5 * operationRate);
    
    setProgress(newProgress);
    setGeneratedClients(clientsGenerated);
    setGeneratedOperations(operationsGenerated);
    
    // Update estimated time
    const remainingPercentage = 100 - newProgress;
    const secondsPerPercent = 5; // simulated speed
    const remainingSeconds = remainingPercentage * secondsPerPercent;
    setEstimatedTime(formatTime(remainingSeconds));
    
    if (newProgress < 100) {
      setTimeout(() => updateProgress(), 500);
    } else {
      setIsGenerating(false);
      toast({
        title: "Generation complete",
        description: `Generated ${clientsGenerated.toLocaleString()} clients and ${operationsGenerated.toLocaleString()} operations.`,
      });
    }
  };
  
  const handlePauseResumeGenerator = () => {
    setIsPaused(!isPaused);
    
    if (isPaused) {
      // Resume
      toast({
        title: "Generator resumed",
        description: "The demo traffic generation has been resumed.",
      });
      setTimeout(() => updateProgress(), 500);
    } else {
      // Pause
      toast({
        title: "Generator paused",
        description: "The demo traffic generation has been paused.",
      });
    }
  };
  
  const handleStopGenerator = () => {
    setIsGenerating(false);
    setIsPaused(false);
    
    toast({
      title: "Generator stopped",
      description: `Generated ${generatedClients.toLocaleString()} clients and ${generatedOperations.toLocaleString()} operations before stopping.`,
    });
  };
  
  // Helper function to format time in HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [hours, minutes, secs]
      .map(v => v < 10 ? "0" + v : v)
      .join(":");
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Activity Generator</h1>
          <p className="text-muted-foreground">
            Generate realistic banking activity for multiple clients simultaneously.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Generator Controls
            </CardTitle>
            <CardDescription>
              Configure and control the bulk generation of demo banking traffic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="client-count">Number of Clients</Label>
                <div className="flex space-x-2">
                  <Input
                    id="client-count"
                    type="number"
                    min="1"
                    max="5000000"
                    value={clientCount}
                    onChange={(e) => setClientCount(parseInt(e.target.value) || 0)}
                    disabled={isGenerating}
                  />
                  <div className="w-[100px] text-sm flex items-center justify-center bg-muted rounded px-2">
                    {clientCount.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Number of clients to generate (1 - 5,000,000)
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="operation-rate">Operation Rate</Label>
                  <span className="text-sm text-muted-foreground">
                    {operationRate.toFixed(1)}x
                  </span>
                </div>
                <Slider
                  id="operation-rate"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[operationRate]}
                  onValueChange={(value) => setOperationRate(value[0])}
                  disabled={isGenerating}
                />
                <div className="text-xs text-muted-foreground">
                  Speed of operation generation (0.1x - 10x)
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {!isGenerating ? (
                  <Button 
                    onClick={handleStartGenerator} 
                    className="flex-1"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Start Generator
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handlePauseResumeGenerator}
                      variant="outline"
                      className="flex-1"
                    >
                      {isPaused ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleStopGenerator}
                      variant="destructive"
                      className="flex-1"
                    >
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
              
              {isGenerating && (
                <div className="space-y-4 mt-6 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Clients Generated</div>
                      <div className="font-medium">{generatedClients.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Operations Generated</div>
                      <div className="font-medium">{generatedOperations.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1 flex flex-col items-end">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        ETA
                      </div>
                      <div className="font-medium">{estimatedTime}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Generated Data</CardTitle>
            <CardDescription>
              Overview of the generated banking operations data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedOperations > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{generatedClients.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Clients Generated</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{generatedOperations.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Operations Generated</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{Math.floor(generatedOperations * 0.7).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Sent to Optio</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{(operationRate * 2.5).toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">Ops/Client Avg</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-6 border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Data Visualization</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      Detailed charts and analysis of the generated banking operations would appear here.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No data generated yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Use the generator controls above to start generating demo banking operations.
                  Statistics and visualizations will appear here once data is generated.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}