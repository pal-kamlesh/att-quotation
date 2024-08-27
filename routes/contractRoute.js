import { Router } from "express";
import {
  contracts,
  create,
  contractify,
  singleContract,
  update,
  approve,
  printCount,
  docData,
  createDC,
  createWorklog,
  getWorklogs,
  getDCs,
} from "../controller/contractController.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = Router();

router.post("/create", verifyToken, create);
router.get("/create/:id", verifyToken, contractify);
router.get("/getContracts", verifyToken, contracts);
router.get("/:id", verifyToken, singleContract);
router.post("/:id", verifyToken, update);
router.get("/approve/:id", verifyToken, approve);
router.get("/print/:id", verifyToken, printCount);
router.get("/docx/:id", verifyToken, docData);
router.post("/:id/dc/create", verifyToken, createDC);
router.post("/:id/worklog/create", verifyToken, createWorklog);
router.get("/worklog/:id", verifyToken, getWorklogs);
router.get("/dc/:id", verifyToken, getDCs);

export default router;
