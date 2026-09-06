import { Router } from "express";
import * as searchController from "../controllers/search.controller.js";
import { validate } from "../middleware/validate.js";
import { searchQuerySchema } from "../validators/search.validator.js";

const router = Router();

router.get("/", validate(searchQuerySchema, "query"), searchController.searchBuses);

export default router;
