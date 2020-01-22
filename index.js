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

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.json());
app.use(
	bodyparser.urlencoded({
		extended: true
	})
);

app.get("/", (req, res) => {
	res.send("backend started");
});

app.post("/twilio/endpoint", (req, res) => {
	client.messages
		.create({
			from: "+15005550006",
			body: "Hello there!",
			to: "+916386717156"
		})
		.then(message => {
			console.log(req.body);
			res.send(req.body);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

app.listen(port, err => console.log(err ? err : `server running on ${port}`));
module.exports.app = app;
