import express from "express";

import {
  createScreenController,
  deleteScreenController,
  getScreensByTheatreController} from "../../controllers/screen.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createScreenController);
router.get("/:theatreId", getScreensByTheatreController);
router.delete("/:screenId", isAuthenticated, deleteScreenController);

export default router;