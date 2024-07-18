import { Router } from "express";
import userRoute from "./userRoute.js";
import quoteRoute from "./quoteRoute.js";

const router = Router();

router.use("/user", userRoute);
router.use("/quotation", quoteRoute);

export default router;
