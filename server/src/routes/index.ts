import { Router } from "express";
import authRoutes from "./auth.routes.js";
import busRoutes from "./bus.routes.js";
import tripRoutes from "./trip.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/buses", busRoutes);
router.use("/trips", tripRoutes);

export default router;
