import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kspjvouxsxwoidkhklhe.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseAnonKey) {
      return res.status(401).json({ error: "Unauthorized: Supabase Anon Key is missing" });
    }

    // Direct HTTP call to Supabase to verify session using official endpoint
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": supabaseAnonKey,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }

    const userData = await response.json();
    req.user = {
      id: userData.id,
      email: userData.email,
      ...userData,
    };

    next();
  } catch (error: any) {
    console.error("Supabase verification error:", error);
    return res.status(401).json({ error: `Unauthorized: Verification failed - ${error.message}` });
  }
};
