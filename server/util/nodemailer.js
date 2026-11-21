import nodemailer from "nodemailer";

//REFRESH TOKEN EXPIRE EFTER 7 DAGE (LAV NY PÅ GCP)
const transporter = nodemailer.createTransport({
	service: "gmail", //default gmail SMTP settings i nodemailer
	auth: {
		type: "OAuth2",
		user: "anoepbrsundahl@gmail.com",
		clientId: process.env.GCP_CLIENT_ID,
		clientSecret: process.env.GCP_CLIENT_SECRET,
		refreshToken: process.env.GCP_REFRESH_TOKEN,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error(error);
	} else {
		console.log("Server is ready to take our messages");
	}
});

export default transporter;