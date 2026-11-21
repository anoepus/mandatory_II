import { Router } from "express";
const router = Router();

import { authLogin } from '../middleware/auth.js'

router.post("/auth/login", authLogin, (req, res) => {
    res.send({ data: req.session.user });
});

router.get("/auth/logout", (req, res) => {
    req.session.destroy();
    res.send({ data: "logged out successfully" });
});

router.get("/auth", (req, res) => {
    const user = req.session.user;
    res.send({ data: user });
});

export default router;