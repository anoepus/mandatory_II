import transporter from "./nodemailer";

export function sendVerificationLink (user, link) {
	const options = {
		from: "", //overwrites af auth email pga gmail qurks
		to: user.email,
		subject: "Verify your email",
		html: `Hello ${user.username}!\nPlease click the following link to verify your email:\n✨<a href="${link}">${link}</a>✨`,
	};
	return transporter.sendMail(options);
};