import express from "express";
import ChargerController from "../controllers/charger.js";
import authMiddleware from "../middleware/authMiddleware.js";

const chargerRouter = express.Router();

chargerRouter.post("/", authMiddleware, ChargerController.createCharger);

chargerRouter.get("/:id", authMiddleware, ChargerController.getChargerById);

chargerRouter.get("/", ChargerController.getAllChargers);

chargerRouter.delete("/:id", authMiddleware, ChargerController.deleteChargerById);

chargerRouter.put("/:id", authMiddleware, ChargerController.updateChargerById);

export default chargerRouter;
