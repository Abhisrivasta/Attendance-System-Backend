import { Router } from "express";
import { createUniversity, deleteUniversity, getUniversities, restoreUniversity, updateUniversity } from "../controllers/university.controller";


const router = Router();

router.post("/create-university",createUniversity);
router.get("/", getUniversities);
router.put("/:id", updateUniversity);
router.delete("/:id", deleteUniversity);
router.patch("/:id/restore", restoreUniversity);


export default router;