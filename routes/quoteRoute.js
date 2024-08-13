import { Router } from "express";

import {
  create,
  quotes,
  docx,
  singleQuote,
  docData,
  update,
  approve,
  getArchive,
  similarProjects,
} from "../controller/quoteController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = Router();

router.post("/create", verifyToken, create);
router.get("/getQuotes", verifyToken, quotes);
router.get("/docx", verifyToken, docx);
router.post("/similarPorjects", similarProjects);
router.get("/:id", verifyToken, singleQuote);
router.post("/:id", verifyToken, update);
router.get("/docx/:id", verifyToken, docData);
router.get("/approve/:id", verifyToken, approve);
router.get("/archive/:id", verifyToken, getArchive);
export default router;
