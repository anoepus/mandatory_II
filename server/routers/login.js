import { Router } from "express";
const router = Router();

import { authLogin } from '../middleware/auth.js'
import { users } from "../db/users.js";

router.post("/auth/login", authLogin, (req, res) => {
    res.send({ data: req.session.user });
});

router.get("/auth/logout", (req, res) => {
    req.session.destroy();
    res.send({ data: "logged out successfully" });
});

router.get("/auth", (req, res) => {
    const user = users.find((u) => u.email === req.session.user);
	if (!user) {
		return res.status(401).send({ error: "Unauthorized, please login" });
	} else if (!user.isVerified) {
		return res.status(401).send({ error: "Not verified, please verify your email and try again" });
	}
    res.send({ data: user });
});

export default router;