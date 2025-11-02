import { prisma } from "../prisma/client";
import { Request, Response } from "express";
import { geoCoordinatesFromAddress } from "../utils/geolocation";

export const createCollege = async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      type,
      address,
      city,
      state,
      country,
      postalCode,
      email,
      phone,
      establishedYear,
      universityId,
    } = req.body;

    if (!name || !address || !universityId) {
      return res
        .status(400)
        .json({ message: "Name, address, and universityId are required." });
    }

    const university = await prisma.university.findUnique({
      where: { id: Number(universityId) },
    });

    if (!university)
      return res.status(404).json({ message: "University not found" });

    const fullAddress = `${address}, ${city || ""}, ${state || ""}, ${
      country || ""
    } ${postalCode || ""}`;

    //  Get coordinates via utils
    const coordinates = await geoCoordinatesFromAddress(fullAddress);
    if (!coordinates) {
      return res
        .status(400)
        .json({
          message: "Could not get coordinates for the provided address",
        });
    }
    const { latitude, longitude } = coordinates;

    const college = await prisma.college.create({
      data: {
        name,
        code,
        type,
        address,
        city,
        state,
        country,
        postalCode,
        latitude,
        longitude,
        email,
        phone,
        establishedYear: establishedYear ? Number(establishedYear) : null,
        university: { connect: { id: Number(universityId) } },
      },
    });

    res.status(201).json({
      message: "College created successfully with geolocation.",
      college,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating college" });
  }
};



export const getAllColleges = async (req: Request, res: Response) => {
  try {
    const colleges = await prisma.college.findMany({
      where: { isDeleted: false },
      orderBy: { name: "asc" },
    });
    res.json(colleges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching colleges" });
  }
};
