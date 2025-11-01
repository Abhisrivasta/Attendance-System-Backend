import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// =============== CREATE USER ===============
export const createUser = async (req: Request, res: Response) => {
  try {
    const { id, email, role , name} = req.body;

    if (!id || !email) {
      return res.status(400).json({ error: "Missing id or email" });
    }

    // Check if already exists
    const existing = await prisma.user.findUnique({ where: { id } });
    if (existing) {
      return res.status(200).json({ message: "User already exists", user: existing });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id,
        email,
        name : name  || "",
        role: role || "STUDENT",
      },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// =============== GET PROFILE ===============
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // Comes from auth middleware
    const role = (req as any).user?.role;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: role === "STUDENT"
          ? {
              include: {
                batch: { include: { course: true } },
                college: true,
              },
            }
          : false,
        teacher: role === "TEACHER"
          ? {
              include: {
                college: true,
                subjectLinks: { include: { subject: true } },
              },
            }
          : false,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User profile not found in database." });
    }

    const { password, ...safeUser } = user as any;
    return res.status(200).json(safeUser);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Internal server error while fetching profile." });
  }
};
