import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
