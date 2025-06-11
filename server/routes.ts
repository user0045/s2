import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentSchema, insertUpcomingContentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const content = await storage.getContentById(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid content data", details: error.errors });
      }
      console.error("Error creating content:", error);
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const validatedData = insertContentSchema.partial().parse(req.body);
      const content = await storage.updateContent(req.params.id, validatedData);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid content data", details: error.errors });
      }
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // Upcoming content routes
  app.get("/api/upcoming-content", async (req, res) => {
    try {
      const content = await storage.getUpcomingContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching upcoming content:", error);
      res.status(500).json({ error: "Failed to fetch upcoming content" });
    }
  });

  app.get("/api/upcoming-content/:id", async (req, res) => {
    try {
      const content = await storage.getUpcomingContentById(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Upcoming content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching upcoming content:", error);
      res.status(500).json({ error: "Failed to fetch upcoming content" });
    }
  });

  app.post("/api/upcoming-content", async (req, res) => {
    try {
      const validatedData = insertUpcomingContentSchema.parse(req.body);
      const content = await storage.createUpcomingContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid upcoming content data", details: error.errors });
      }
      console.error("Error creating upcoming content:", error);
      res.status(500).json({ error: "Failed to create upcoming content" });
    }
  });

  app.put("/api/upcoming-content/:id", async (req, res) => {
    try {
      const validatedData = insertUpcomingContentSchema.partial().parse(req.body);
      const content = await storage.updateUpcomingContent(req.params.id, validatedData);
      if (!content) {
        return res.status(404).json({ error: "Upcoming content not found" });
      }
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid upcoming content data", details: error.errors });
      }
      console.error("Error updating upcoming content:", error);
      res.status(500).json({ error: "Failed to update upcoming content" });
    }
  });

  app.delete("/api/upcoming-content/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUpcomingContent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Upcoming content not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting upcoming content:", error);
      res.status(500).json({ error: "Failed to delete upcoming content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
