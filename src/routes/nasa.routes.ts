import { Router } from "express";
import { NasaController } from "../controllers/nasa.controller";

const router = Router();
const nasaController = new NasaController()
router.get("/nasa", nasaController.getAllNasaData)
router.post("/nasa/ask", nasaController.askQuestion)

export default router;