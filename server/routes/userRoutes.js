import { Router } from "express";
import { sendContactRequest, createUser, getUser, acceptContactRequest, deleteContact } from "../controllers/userControllers.js";

const router = Router()

router.get('/get/:userId', getUser)
router.post('/create', createUser)

router.patch('/add', sendContactRequest)
router.patch('/accept', acceptContactRequest)
router.patch('/delete', deleteContact)

export default router;