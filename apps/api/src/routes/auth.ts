import { Router, Request, Response } from "express";
import { z } from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const syncSchema = z.object({
  displayName: z.string().optional(),
});

router.post("/sync", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { displayName } = syncSchema.parse(req.body);
    const { id, email } = req.user!;
    
    // Check if user already exists in DB
    const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (existing.length === 0) {
      // Insert user if not found
      await db.insert(users).values({
        id,
        email,
        passwordHash: null,
        walletAddress: null,
        displayName: displayName || email.split("@")[0],
        avatarUrl: null,
        role: "user",
      });
      return res.status(201).json({ message: "User synced and created successfully", id, email });
    } else {
      // Update display name if it has changed
      if (displayName && existing[0].displayName !== displayName) {
        await db.update(users).set({ displayName, updatedAt: new Date() }).where(eq(users.id, id));
      }
      return res.json({ message: "User profile synced and updated", id, email });
    }
  } catch (error: any) {
    console.error("Auth sync error:", error);
    res.status(500).json({ error: error.message || "Failed to sync user data" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    res.json({ message: "Login endpoint connected", email });
  } catch (error) {
    res.status(400).json({ error: "Invalid request data" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    res.status(201).json({ message: "Register endpoint connected", email });
  } catch (error) {
    res.status(400).json({ error: "Invalid request data" });
  }
});

export default router;
