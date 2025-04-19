import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CreditCard, PiggyBank, Receipt, Landmark, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Product catalog types
interface ProductCatalog {
  id: number;
  type: string;
  code: string;
  name: string;
  description: string;
  details: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerProduct {
  id: number;
  clientId: number;
  productId: number;
  accountId?: number;
  status: string;
  appliedAt: string;
  approvedAt?: string;
  details?: any;
  createdAt: string;
  updatedAt: string;
}

interface ProductCatalogDialogProps {
  clientId: number;
  clientName: string;
  accounts?: any[];
  trigger?: React.ReactNode;
}

export default function ProductCatalogDialog({
  clientId,
  clientName,
  accounts = [],
  trigger
}: ProductCatalogDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch product catalog
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: ProductCatalog[]; message?: string }>('/api/products');
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch product catalog');
      }
      return response.data;
    }
  });

  // Create customer product mutation
  const createCustomerProduct = useMutation({
    mutationFn: async (data: { productId: number; accountId?: number; details?: any }) => {
      const response = await apiRequest<{ success: boolean; data: CustomerProduct; message?: string }>(
        `/api/clients/${clientId}/products`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to add product');
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/products`] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/accounts`] });
      
      toast({
        title: 'Product Added',
        description: 'The product has been successfully added to this customer',
      });
      
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Add Product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddProduct = () => {
    if (!selectedProductId) {
      toast({
        title: 'No Product Selected',
        description: 'Please select a product to add',
        variant: 'destructive',
      });
      return;
    }

    const selectedProduct = products?.find(p => p.id === selectedProductId);
    if (!selectedProduct) return;

    // For account-linked products, require an account selection
    const needsAccount = ['card', 'deposit'].includes(selectedProduct.type);
    
    if (needsAccount && !selectedAccountId) {
      toast({
        title: 'Account Required',
        description: 'Please select an account to link with this product',
        variant: 'destructive',
      });
      return;
    }

    createCustomerProduct.mutate({
      productId: selectedProductId,
      accountId: needsAccount ? selectedAccountId : undefined,
      details: {}
    });
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'account':
        return <Landmark className="h-5 w-5" />;
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'loan':
        return <Receipt className="h-5 w-5" />;
      case 'deposit':
        return <PiggyBank className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  const renderProductsByType = (type: string) => {
    const filteredProducts = products?.filter(product => product.type === type && product.isActive);
    
    if (!filteredProducts || filteredProducts.length === 0) {
      return (
        <div className="text-center p-6">
          <p className="text-muted-foreground">No {type} products available</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedProductId === product.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
            }`}
            onClick={() => setSelectedProductId(product.id)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                {getProductIcon(product.type)}
              </div>
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            </div>
            {selectedProductId === product.id && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Product Details:</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(product.details || {}).map(([key, value]) => {
                    // Skip arrays and objects for simple display
                    if (typeof value === 'object') return null;
                    
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span>{formattedKey}:</span>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const needsAccount = () => {
    if (!selectedProductId || !products) return false;
    const selectedProduct = products.find(p => p.id === selectedProductId);
    return selectedProduct && ['card', 'deposit'].includes(selectedProduct.type);
  };

  const renderAccountSelection = () => {
    if (!accounts || accounts.length === 0) {
      return (
        <div className="text-center p-4 mt-4 border rounded-lg bg-muted">
          <p className="text-sm">No accounts available. Please create an account first.</p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Select Account:</h3>
        <div className="grid gap-2">
          {accounts.map(account => (
            <div
              key={account.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAccountId === account.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedAccountId(account.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.accountNumber}</div>
                </div>
                <div className="text-sm">
                  {new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: account.currency 
                  }).format(account.balance)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Product for {clientName}</DialogTitle>
          <DialogDescription>
            Choose a product to add to this customer's portfolio.
          </DialogDescription>
        </DialogHeader>
        
        {isLoadingProducts ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="account" className="mt-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="account">Accounts</TabsTrigger>
              <TabsTrigger value="card">Cards</TabsTrigger>
              <TabsTrigger value="loan">Loans</TabsTrigger>
              <TabsTrigger value="deposit">Deposits</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mt-4 max-h-[350px] overflow-y-auto">
              {renderProductsByType('account')}
            </TabsContent>
            <TabsContent value="card" className="mt-4 max-h-[350px] overflow-y-auto">
              {renderProductsByType('card')}
              {selectedProductId && needsAccount() && renderAccountSelection()}
            </TabsContent>
            <TabsContent value="loan" className="mt-4 max-h-[350px] overflow-y-auto">
              {renderProductsByType('loan')}
            </TabsContent>
            <TabsContent value="deposit" className="mt-4 max-h-[350px] overflow-y-auto">
              {renderProductsByType('deposit')}
              {selectedProductId && needsAccount() && renderAccountSelection()}
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddProduct}
            disabled={createCustomerProduct.isPending || !selectedProductId || (needsAccount() && !selectedAccountId)}
          >
            {createCustomerProduct.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}