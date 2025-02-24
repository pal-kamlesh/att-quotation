import express from "express";
import {
  addFileToCorrespondence,
  getCorrespondence,
  updateFile,
  deleteFile,
  deleteCorrespondence,
} from "../controller/correspondenceController.js";

const router = express.Router();

router.post("/files", addFileToCorrespondence);

router.get("/", getCorrespondence);

router.put("/:correspondenceId/files/:direction/:publicId", updateFile);

router.delete("/:correspondenceId/files/:direction/:publicId", deleteFile);

router.delete("/:correspondenceId", deleteCorrespondence);

export default router;
