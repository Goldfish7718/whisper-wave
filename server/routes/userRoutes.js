import { Router } from "express";
import {
  sendContactRequest,
  createUser,
  getUser,
  updateContactRequest,
  deleteContact,
} from "../controllers/userControllers.js";

const router = Router();

router.get("/get/:userId", getUser);
router.post("/create", createUser);

router.patch("/add", sendContactRequest);
router.patch("/update", updateContactRequest);
router.patch("/delete", deleteContact);

export default router;
