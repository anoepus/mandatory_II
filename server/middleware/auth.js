import { users } from "../db/users.js"; //fake db gemt in memory array

import { comparePassword } from "../util/password.js";
import { hashPassword } from "../util/password.js";

export async function authLogin(req, res, next) {
	const username = req.body.username;
	const password = req.body.password;
	//fake db lookup
	const user = users.find(u => u.username === username);
	if (!user) { //hvis user er undefined vil validpassword crash før tjekket
		return res.status(401).send({ error: "Invalid Credentials" });
	};
	const validPassword = await comparePassword(password, user.password);
	if (!validPassword) {
		return res.status(401).send({ error: "Invalid Credentials" });
	};

	req.session.user = user.username;
	console.log("user saved in session", req.session.user);
	next();
};

export async function saveUser(req, res, next) {
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
	} else if (findExistingUsername) {
		console.log("Username already taken");
		return res.status(409).send({ error: `Username ${username} already taken` });
	} else if (password.length < 8) {
		console.log("Password is too weak");
		return res.status(400).send({ error: "Password should be at least 8 characters" });
	};
	const hashedPassword = await hashPassword(password);

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
};