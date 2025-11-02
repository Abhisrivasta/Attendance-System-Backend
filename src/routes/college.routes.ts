import { Router } from "express";
import { createCollege, getAllColleges } from "../controllers/college.controller";
const router = Router();

router.post("/create-college",createCollege);
router.get("/", getAllColleges);


export default router;