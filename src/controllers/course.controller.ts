import { prisma } from "../prisma/client";
import { Request, Response } from "express";

export const createCourse = async (req: Request, res: Response) => {
  const { name, code, collegeId } = req.body;

  if (!name || !collegeId) {
    return res.status(400).json({ message: "Missing required fields: name or collegeId" });
  }

  try {
    const existingCollege = await prisma.college.findUnique({
      where: { id: Number(collegeId) },
    });

    if (!existingCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    const course = await prisma.course.create({
      data: {
        name,
        code,
        college: { connect: { id: Number(collegeId) } }, 
      },
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error: any) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        college: true, 
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};