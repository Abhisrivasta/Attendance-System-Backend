import { Router } from "express";
import { createUser, getProfile } from "../controllers/auth.controller";
const router = Router();


router.post("/create-user", createUser);

router.get("/profile",getProfile);

export default router;

