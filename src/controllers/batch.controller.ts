import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const createBatch = async (req: Request, res: Response) => {
  try {
    const { name, startYear, endYear, courseId, collegeId } = req.body;

    if (!name || !startYear || !endYear || !courseId || !collegeId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        startYear: new Date(startYear),
        endYear: new Date(endYear),
        course: { connect: { id: Number(courseId) } },
      },
    });

    res.status(201).json({ message: "Batch created successfully", batch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating batch" });
  }
};
