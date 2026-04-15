import { Router } from "express";
import * as controller from "./booking.controller.js";
import { checkLoggedIn } from "./booking.middleware.js";

const router = Router();

router.get("/", controller.getAllSeat);

// Backward compatible: old clients may still send /:id/:name
router.put("/:id", checkLoggedIn, controller.BookSeat);
router.put("/:id/:name", checkLoggedIn, controller.BookSeat);

export default router;
