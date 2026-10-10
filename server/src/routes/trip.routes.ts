import { Router } from "express";
import * as seatController from "../controllers/seat.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/:tripId/seats", seatController.getSeatMap);
router.post("/:tripId/seats/:seatNumber/lock", authenticate, seatController.lockSeat);
router.delete("/:tripId/seats/:seatNumber/lock", authenticate, seatController.unlockSeat);

export default router;
