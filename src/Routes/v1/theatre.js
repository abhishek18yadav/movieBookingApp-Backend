import express from 'express';

import { createTheatreController, deleteTheatreController, getAllTheatreController, getTheatreController, UpdateStatus, updateTheatreController } from '../../controllers/theatre.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
const router = express.Router();

router.post("/",isAuthenticated , createTheatreController);
router.get("/",isAuthenticated , getAllTheatreController);
router.get("/:theatreId",isAuthenticated , getTheatreController);
router.patch("/:theatreAdminId/:theatreId",isAuthenticated , updateTheatreController);
router.patch("/",isAuthenticated , UpdateStatus);//only superAdmin
router.delete("/:theatreAdminId/:theatreId",isAuthenticated , deleteTheatreController);
export default router;