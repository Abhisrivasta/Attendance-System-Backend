import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const createUniversity = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Missing required fields: name, code" });
    }

    const existingUniversity = await prisma.university.findUnique({
      where: { code },
    });

    if (existingUniversity) {
      return res.status(400).json({ message: "University with this code already exists" });
    }

    const university = await prisma.university.create({
      data: {
        name,
        code
      },
   
    });

    return res.status(201).json({
      message: "University created successfully",
      university,
    });
  } catch (error: any) {
    console.error("Error creating university:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



/**
 * @desc   Get all universities (or one by ID/code)
 * @route  GET /api/universities
 * @query  id?: number | code?: string
 */
export const getUniversities = async (req: Request, res: Response) => {
  try {
    const { id, code } = req.query;

    // If ID or code is provided — fetch a single university
    if (id || code) {
      const university = await prisma.university.findFirst({
        where: {
          isDeleted: false,
          ...(id ? { id: Number(id) } : {}),
          ...(code ? { code: String(code) } : {}),
        },
        include: {
          colleges: {
            where: { isDeleted: false },
            select: {
              id: true,
              name: true,
              code: true,
              createdAt: true,
            },
          },
        },
      });

      if (!university) {
        return res.status(404).json({ message: "University not found" });
      }

      return res.status(200).json({
        message: "University fetched successfully",
        university,
      });
    }

    // Otherwise, fetch all active universities
    const universities = await prisma.university.findMany({
      where: { isDeleted: false },
      include: {
        colleges: {
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Universities fetched successfully",
      count: universities.length,
      universities,
    });
  } catch (error: any) {
    console.error("Error fetching universities:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



/**
 * @desc   Soft delete (deactivate) a university
 * @route  DELETE /api/universities/:id
 */
export const deleteUniversity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "University ID is required" });
    }

    const university = await prisma.university.findUnique({
      where: { id: Number(id) },
    });

    if (!university || university.isDeleted) {
      return res.status(404).json({ message: "University not found or already deleted" });
    }

    const deletedUniversity = await prisma.university.update({
      where: { id: Number(id) },
      data: {
        isDeleted: true,
        isActive: false,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "University deactivated successfully",
      university: deletedUniversity,
    });
  } catch (error: any) {
    console.error("Error deleting university:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



/**
 * @desc   Restore (reactivate) a soft-deleted university
 * @route  PATCH /api/universities/:id/restore
 */
export const restoreUniversity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "University ID is required" });
    }

    const university = await prisma.university.findUnique({
      where: { id: Number(id) },
    });

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    if (!university.isDeleted) {
      return res.status(400).json({ message: "University is already active" });
    }

    const restoredUniversity = await prisma.university.update({
      where: { id: Number(id) },
      data: {
        isDeleted: false,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "University restored successfully",
      university: restoredUniversity,
    });
  } catch (error: any) {
    console.error("Error restoring university:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



/**
 * @desc   Update a university (name, code, or nested colleges)
 * @route  PUT /api/universities/:id
 */
export const updateUniversity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, colleges } = req.body;

    if (!id) {
      return res.status(400).json({ message: "University ID is required" });
    }

    // Check if university exists
    const university = await prisma.university.findUnique({
      where: { id: Number(id) },
      include: { colleges: true },
    });

    if (!university || university.isDeleted) {
      return res.status(404).json({ message: "University not found or deleted" });
    }

    // Check if another university already uses this code
    if (code && code !== university.code) {
      const existing = await prisma.university.findUnique({ where: { code } });
      if (existing) {
        return res.status(400).json({ message: "Another university with this code already exists" });
      }
    }

    // Prepare data for update
    const updateData: any = {};
    if (name) updateData.name = name;
    if (code) updateData.code = code;

    // Update the university
    const updatedUniversity = await prisma.university.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    // Optionally update or add colleges if provided
    if (Array.isArray(colleges)) {
      for (const college of colleges) {
        // Update existing college (if id present)
        if (college.id) {
          await prisma.college.update({
            where: { id: college.id },
            data: {
              name: college.name ?? undefined,
              code: college.code ?? undefined,
              updatedAt: new Date(),
            },
          });
        } 
        // Create new college if no ID
        else if (college.name) {
          await prisma.college.create({
            data: {
              name: college.name,
              code: college.code ?? null,
              universityId: Number(id),
            },
          });
        }
      }
    }

    // Fetch updated result with colleges
    const finalUniversity = await prisma.university.findUnique({
      where: { id: Number(id) },
      include: { colleges: { where: { isDeleted: false } } },
    });

    return res.status(200).json({
      message: "University updated successfully",
      university: finalUniversity,
    });
  } catch (error: any) {
    console.error("Error updating university:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
