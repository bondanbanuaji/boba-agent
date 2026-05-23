import { Router, Request, Response } from "express";

const router = Router();

router.get("/status", async (req: Request, res: Response) => {
  res.json({
    google: false,
    telegram: false,
    whatsapp: false,
  });
});

router.post("/connect/:service", async (req: Request, res: Response) => {
  const { service } = req.params;
  res.json({
    status: "success",
    message: `Connection flow for ${service} initiated.`,
  });
});

export default router;
