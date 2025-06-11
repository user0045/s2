import { 
  users, content, upcomingContent,
  type User, type InsertUser, 
  type Content, type InsertContent,
  type UpcomingContent, type InsertUpcomingContent
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content operations
  getContent(): Promise<Content[]>;
  getContentById(id: string): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: string, updates: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: string): Promise<boolean>;
  
  // Upcoming content operations
  getUpcomingContent(): Promise<UpcomingContent[]>;
  getUpcomingContentById(id: string): Promise<UpcomingContent | undefined>;
  createUpcomingContent(content: InsertUpcomingContent): Promise<UpcomingContent>;
  updateUpcomingContent(id: string, updates: Partial<InsertUpcomingContent>): Promise<UpcomingContent | undefined>;
  deleteUpcomingContent(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Content operations
  async getContent(): Promise<Content[]> {
    return await db.select().from(content).where(eq(content.status, "Published"));
  }

  async getContentById(id: string): Promise<Content | undefined> {
    const result = await db.select().from(content).where(eq(content.id, id));
    return result[0];
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const result = await db.insert(content).values(insertContent).returning();
    return result[0];
  }

  async updateContent(id: string, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const result = await db.update(content).set(updates).where(eq(content.id, id)).returning();
    return result[0];
  }

  async deleteContent(id: string): Promise<boolean> {
    const result = await db.delete(content).where(eq(content.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Upcoming content operations
  async getUpcomingContent(): Promise<UpcomingContent[]> {
    return await db.select().from(upcomingContent);
  }

  async getUpcomingContentById(id: string): Promise<UpcomingContent | undefined> {
    const result = await db.select().from(upcomingContent).where(eq(upcomingContent.id, id));
    return result[0];
  }

  async createUpcomingContent(insertUpcoming: InsertUpcomingContent): Promise<UpcomingContent> {
    const result = await db.insert(upcomingContent).values(insertUpcoming).returning();
    return result[0];
  }

  async updateUpcomingContent(id: string, updates: Partial<InsertUpcomingContent>): Promise<UpcomingContent | undefined> {
    const result = await db.update(upcomingContent).set(updates).where(eq(upcomingContent.id, id)).returning();
    return result[0];
  }

  async deleteUpcomingContent(id: string): Promise<boolean> {
    const result = await db.delete(upcomingContent).where(eq(upcomingContent.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
