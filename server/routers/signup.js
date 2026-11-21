import { Router } from "express";
const router = Router();

import { saveUser } from "../middleware/auth.js";
import { sendConfirmationEmail, verifyEmail } from "../middleware/verify.js";

router.post("/auth/register", saveUser, sendConfirmationEmail, (req, res) => {
	res.status(201).send({ data: "Registered successfully, please verify your email" });
});

router.get("/auth/verify", verifyEmail, (req, res) => {
	res.send({ data: `Email has been verified!` });
});

export default router;