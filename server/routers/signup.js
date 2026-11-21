import { Router } from "express";
const router = Router();

let users = [
	{
		"id": 1,
		"email": "admin@swag.dk",
		"username": "admin",
		"password": "$2b$14$uAMLIBIUQXelScTEuFPq2.AiTBbfCfBi4MowMA7.ZACI5goDmq.Om",
		"isVerified": true
	},
	{
		id: 2,
		email: 'anoepsundahl@gmail.com',
		username: 'anoep',
		password: '$2b$14$CPIEsmQOh.Gm2afQvO78muU6ChPsk3BgwqwkC8OHelbR.pVxXD0he',
		isVerified: false
	}
];

router.post("/auth/register", saveUser, sendConfirmationEmail, (req, res) => {
	res.status(201).send({ data: "Registered successfully, please verify your email" });
});

router.get("/auth/verify", verifyEmail, (req, res) => {
	res.send({ data: `Email has been verified!` });
});

import jwt from "jsonwebtoken";
import transporter from "../util/nodemailer.js";
function sendConfirmationEmail(req, res, next) {
	// TODO lookup user i DB før confirmation.
	const user = users.find((u) => u.email === req.body.email);

	if (user === undefined) {
		console.log("User was not created successfully");
		return res.status(404).send({ data: "User not found! Try registering again" });
	};

	const emailToken = jwt.sign({
		email: user.email
	}, process.env.JWT_ACCESS_TOKEN, {
		expiresIn: "1h"
	});

	const verificationUrl = `${process.env.HOST}/auth/verify?token=${emailToken}`;

	const options = {
		from: "", //overwrites af auth email pga gmail qurks
		to: user.email,
		subject: "Verify your email",
		html: `Hello ${user.username}!\nPlease click the following link to verify your email:\n✨<a href="${verificationUrl}">${verificationUrl}</a>✨`,
	};
	transporter.sendMail(options);
	next();
}

function verifyEmail(req, res, next) {
	const jwtToken = req.query;
	const decodedEmail = jwt.verify(jwtToken.token, process.env.JWT_ACCESS_TOKEN);

	console.log(decodedEmail);

	//erstat med DB lookup
	const user = users.find((u) => u.email === decodedEmail.email);

	console.log(user);

	if (!user) {
		console.log("User was not created successfully");
		return res.status(404).send({ data: "User not found! Try registering again" });
	};

	user.isVerified = true;
	next();
}

import { hashPassword } from "../util/password.js";
async function saveUser(req, res, next) {
	//fake DB lookup (increment id)
	const lastUser = users.findLast((user) => user.id);
	let id = Number(lastUser.id);
	id++;

	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;

	const findExistingEmail = users.find((u) => u.email === email);
	const findExistingUsername = users.find((u) => u.username === username);

	if (findExistingEmail) {
		console.log("Email already taken");
		return res.status(409).send({ error: `Email ${email} already taken` });
	};
	if (findExistingUsername) {
		console.log("Username already taken");
		return res.status(409).send({ error: `Username ${username} already taken` });
	};
	if (password.length < 8) {
		console.log("Password is too weak");
		return res.status(400).send({ error: "Password should be at least 8 characters" });
	};

	const hashedPassword = await hashPassword(req.body.password);

	const user = {
		"id": id,
		"email": email,
		"username": username,
		"password": hashedPassword,
		"isVerified": false
	};
	//save to DB
	users.push(user);

	console.log(users);
	next();
}

export default router;