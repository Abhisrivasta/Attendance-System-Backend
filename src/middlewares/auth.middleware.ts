import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

//Custom middleware to verify Supabase JWT
export const verifySupabaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Supabase token verification failed:", error?.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach the Supabase user 
    req.user = user;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
