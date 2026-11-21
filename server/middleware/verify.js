import { users } from "../db/users.js"; //fake db gemt in memory array

import jwt from "jsonwebtoken";
import { sendVerificationLink } from "../util/sendEmail.js";

export function sendConfirmationEmail(req, res, next) {
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
	sendVerificationLink(user, verificationUrl);
	next();
}

export function verifyEmail(req, res, next) {
	const jwtToken = req.query;
	const decodedEmail = jwt.verify(jwtToken.token, process.env.JWT_ACCESS_TOKEN);
	//erstat med DB lookup
	const user = users.find((u) => u.email === decodedEmail.email);
	if (!user) {
		console.log("User was not created successfully");
		return res.status(404).send({ data: "User not found! Try registering again" });
	};

	user.isVerified = true;
	next();
}