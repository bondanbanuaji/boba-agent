import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

const executeSchema = z.object({
  action: z.string(),
  params: z.any().optional(),
});

router.post("/execute", async (req: Request, res: Response) => {
  try {
    const { action, params } = executeSchema.parse(req.body);
    res.json({
      status: "success",
      action,
      result: `Executed action ${action} successfully.`,
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid agent command format" });
  }
});

router.get("/status", async (req: Request, res: Response) => {
  res.json({
    status: "idle",
    currentTask: null,
  });
});

export default router;
