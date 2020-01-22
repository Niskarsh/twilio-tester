require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");

const client = require("twilio")(
	process.env.DEV_ACCOUNTSID,
	process.env.DEV_AUTHTOKEN
);

const app = express();

const port = process.env.PORT || 3000;

const twilioMiddleware = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, PUT");
	res.header("Access-Control-Allow-Headers", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Content-Type", "text/richtext");
	next();
};

const authMiddleware = (req, res, next) => {
	next();
};

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.json());
app.use(
	bodyparser.urlencoded({
		extended: true
	})
);

app.use("/", authMiddleware);

app.get("/", (req, res) => {
	res.send("backend started");
});

app.use("/twilio", twilioMiddleware);

app.post("/twilio/endpoint", (req, res) => {
	client.messages
		.create({
			from: "+15005550006",
			body: `${req.body.Body}`,
			to: "+916386717156"
		})
		.then(message => {
			console.log(req.body);
			res.send("fired");
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

app.listen(port, err => console.log(err ? err : `server running on ${port}`));
module.exports.app = app;
