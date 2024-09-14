import { Router } from "express";
import { getChats } from "../controllers/chatControllers.js";

const router = Router()

router.get('/get/:userId/:contactId', getChats)

export default router