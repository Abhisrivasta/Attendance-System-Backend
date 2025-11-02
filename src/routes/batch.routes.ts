import { Router } from "express";
import { createBatch } from "../controllers/batch.controller";

const router = Router();

router.post("/create-batch", createBatch);

export default router;
