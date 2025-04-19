import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertClientSchema, insertAccountSchema, insertProductCatalogSchema, insertCustomerProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json({ success: true, data: clients });
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ success: false, message: "Failed to fetch clients" });
    }
  });
  
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
      }
      
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      res.json({ success: true, data: client });
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ success: false, message: "Failed to fetch client" });
    }
  });
  
  app.post("/api/clients", async (req, res) => {
    try {
      const result = insertClientSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid client data", 
          errors: result.error.format() 
        });
      }
      
      const client = await storage.createClient(result.data);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ success: false, message: "Failed to create client" });
    }
  });
  
  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
      }
      
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      // Validate update data
      const updateSchema = insertClientSchema.partial();
      const result = updateSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid client data", 
          errors: result.error.format() 
        });
      }
      
      const updatedClient = await storage.updateClient(id, result.data);
      res.json({ success: true, data: updatedClient });
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ success: false, message: "Failed to update client" });
    }
  });
  
  // Account routes
  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAccounts();
      res.json({ success: true, data: accounts });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ success: false, message: "Failed to fetch accounts" });
    }
  });
  
  app.post("/api/accounts", async (req, res) => {
    try {
      const result = insertAccountSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid account data", 
          errors: result.error.format() 
        });
      }
      
      const account = await storage.createAccount(result.data);
      res.status(201).json({ success: true, data: account });
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ success: false, message: "Failed to create account" });
    }
  });
  
  app.get("/api/clients/:clientId/accounts", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
      }
      
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      const accounts = await storage.getAccountsByClientId(clientId);
      res.json({ success: true, data: accounts });
    } catch (error) {
      console.error("Error fetching client accounts:", error);
      res.status(500).json({ success: false, message: "Failed to fetch client accounts" });
    }
  });
  
  app.get("/api/clients/:clientId/transactions", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
      }
      
      // First get the client's accounts
      const accounts = await storage.getAccountsByClientId(clientId);
      if (!accounts.length) {
        return res.json({ success: true, data: [] });
      }
      
      // Get transactions for each account
      const accountIds = accounts.map(account => account.id);
      let allTransactions: any[] = [];
      
      for (const accountId of accountIds) {
        const transactions = await storage.getTransactionsByAccountId(accountId);
        allTransactions = [...allTransactions, ...transactions];
      }
      
      // Sort by date (newest first)
      allTransactions.sort((a, b) => 
        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      );
      
      res.json({ success: true, data: allTransactions });
    } catch (error) {
      console.error("Error fetching client transactions:", error);
      res.status(500).json({ success: false, message: "Failed to fetch client transactions" });
    }
  });
  
  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json({ success: true, data: events });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
  });
  
  app.get("/api/clients/:clientId/events", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
      }
      
      // First check if client exists
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      // Get all events (we would filter by client in a real app)
      const events = await storage.getEvents();
      
      // For now, limit to a few events related to the client
      // In a real implementation, we would store clientId in events table
      const clientEvents = events.filter(event => {
        try {
          const payload = JSON.parse(event.payload);
          return payload.clientId === clientId;
        } catch (e) {
          return false;
        }
      });
      
      res.json({ success: true, data: clientEvents });
    } catch (error) {
      console.error("Error fetching client events:", error);
      res.status(500).json({ success: false, message: "Failed to fetch client events" });
    }
  });

  // Product catalog routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProductCatalog();
      res.json({ success: true, data: products });
    } catch (error) {
      console.error("Error fetching product catalog:", error);
      res.status(500).json({ success: false, message: "Failed to fetch product catalog" });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const result = insertProductCatalogSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid product data", 
          errors: result.error.format() 
        });
      }
      
      const product = await storage.createProduct(result.data);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ success: false, message: "Failed to create product" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      
      res.json({ success: true, data: product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ success: false, message: "Failed to fetch product" });
    }
  });
  
  // Customer products routes (products assigned to customers)
  app.get("/api/clients/:clientId/products", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
      }
      
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      const customerProducts = await storage.getCustomerProductsByClientId(clientId);
      res.json({ success: true, data: customerProducts });
    } catch (error) {
      console.error("Error fetching customer products:", error);
      res.status(500).json({ success: false, message: "Failed to fetch customer products" });
    }
  });
  
  app.post("/api/clients/:clientId/products", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        return res.status(400).json({ success: false, message: "Invalid client ID" });
      }
      
      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      // Add clientId to the body
      const customerProductData = { ...req.body, clientId };
      
      const result = insertCustomerProductSchema.safeParse(customerProductData);
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid customer product data", 
          errors: result.error.format() 
        });
      }
      
      const customerProduct = await storage.createCustomerProduct(result.data);
      res.status(201).json({ success: true, data: customerProduct });
    } catch (error) {
      console.error("Error creating customer product:", error);
      res.status(500).json({ success: false, message: "Failed to create customer product" });
    }
  });
  
  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ success: false, message: "Failed to fetch settings" });
    }
  });
  
  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      
      if (!key || typeof key !== 'string' || typeof value !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid setting data. Both key and value must be provided as strings." 
        });
      }
      
      const setting = await storage.updateSetting(key, value);
      res.json({ success: true, data: setting });
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ success: false, message: "Failed to update setting" });
    }
  });

  // Register error handler middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Global error handler caught:", err);
    res.status(500).json({ 
      success: false, 
      message: "An unexpected error occurred", 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
