import 'dotenv/config';
import express from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import session from 'express-session';
app.use(session({
    secret: process.env.SESSION_KEY, //kun serveren kan validere clientens cookie (session ID)
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // sender cookie over http (true = kun over https)
        maxAge: 60000 // ms = 1 min 
    }
}));

/* ROUTERS */
import authRouter from "./routers/auth.js";
app.use(authRouter);
import registerRouter from "./routers/signup.js";
app.use(registerRouter);

const port = process.env.PORT || 3000;
app.listen(port, (error) => {
    if (error) {
        console.log("Server failed to start", error);
    };
    console.log("Server running on port", port);
});
