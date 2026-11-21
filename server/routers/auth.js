import { Router } from "express";
const router = Router();

import { comparePassword } from "../util/password.js";

const users = [
    {
        "id": 1,
        "email": "admin@swag.dk",
        "username": "admin",
        "password": "$2b$14$uAMLIBIUQXelScTEuFPq2.AiTBbfCfBi4MowMA7.ZACI5goDmq.Om",
        "isVerified": true
    }
];

router.get("/auth", (req, res) => {
    const user = req.session.user;
    res.send({ data: user });
});

router.post("/auth/login", authLogin, (req, res) => {
    res.send({ data: req.session.user });
});

router.get("/auth/logout", (req, res) => {
    req.session.destroy();
    res.send({ data: "logged out successfully" });
});

async function authLogin (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    //fake db lookup
    const user = users.find(u => u.username === username);

    const validPassword = await comparePassword(password, user.password);
    
    console.log(validPassword);

    if (!user || !validPassword) {
        res.status(401).send({ error: "Invalid Credentials" });
    }
    if (validPassword) {
        req.session.user = user.username;
        console.log("user saved in session", req.session.user);
        next();
    }
}

export default router;