require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const environment = process.env.NODE_ENV;
const clientDev = require("twilio")(
	process.env.DEV_ACCOUNTSID,
	process.env.DEV_AUTHTOKEN
);
const clientProd = require("twilio")(
	process.env.PROD_ACCOUNTSID,
	process.env.PROD_AUTHTOKEN
);

const app = express();

const port = process.env.PORT || 3000;

const twilioMiddleware = (req, res, next) => {
	res.header("Content-Type", "text/richtext");
	next();
};

const authMiddleware = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, PUT");
	res.header("Access-Control-Allow-Headers", "*");
	res.header("Access-Control-Allow-Credentials", "true");
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

app.post("/twilio/prod/testsms", (req, res) => {
	clientProd.messages
		.create({
			from: "+16314064104",
			body: `${req.body.Body}`,
			to: "+916386717156"
		})
		.then(message => {
			console.log(message);
			res.send(message.sid);
		})
		.catch(err => {
			console.log(err);
			// next();
			res.status(500).send(err);
		});
});

app.post("/twilio/dev/testsms", (req, res) => {
	clientDev.messages
		.create({
			from: "+15005550006",
			body: `${req.body.Body}`,
			to: "+916386717156"
		})
		.then(message => {
			console.log(message);
			res.send(message.sid);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

app.get("/twilio/prod/testsms", (req, res, next) => {
	clientProd.messages
		.create({
			from: "+16314064104",
			body: `testing`,
			to: "+916386717156"
		})
		.then(message => {
			console.log(message);
			next();
		})
		.catch(err => {
			console.log(err);
			next();
			// res.status(500).send(err);
		});
});

app.get("/twilio/dev/testsms", (req, res) => {
	clientDev.messages
		.create({
			from: "+15005550006",
			body: `testing`,
			to: "+916386717156"
		})
		.then(message => {
			console.log(message);
			res.send(message);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

app.get("/twilio/prod/conv/start/:name", (req, res) => {
	const { name } = req.params;
	var cSid;
	clientProd.conversations.conversations
		.create({
			friendlyName: name
		})
		.then(conversation => res.send(conversation.sid))
		.catch(err => res.status(500).send(err));
});

app.get("/twilio/prod/conv/participant/add/:type/:number/:sid", (req, res) => {
	const { type, number, sid } = req.params;
	let channel = `${type === "sms" ? "" : type}${
		type === "sms" ? "" : ":"
	}${number}`;
	let proxyBinding = `${type === "sms" ? "" : type}${
		type === "sms" ? "" : ":"
	}+16314064104`;
	console.log(channel, proxyBinding);
	// res.send(proxyBinding)
	clientProd.conversations
		.conversations(sid)
		.participants.create({
			"messagingBinding.address": `${channel}`,
			"messagingBinding.proxyAddress": `${proxyBinding}`
		})
		.then(participant => res.send(participant.sid))
		.catch(err => res.status(500).send(err));
});

app.get(
	"/twilio/prod/conv/participant/remove/:type/:number/:sid/:mid",
	(req, res) => {
		const { type, number, sid, mid } = req.params;
		let channel = `${type === "sms" ? "" : type}${
			type === "sms" ? "" : ":"
		}${number}`;
		let proxyBinding = `${type === "sms" ? "" : type}${
			type === "sms" ? "" : ":"
		}+16314064104`;
		console.log(channel, proxyBinding);
		// res.send(proxyBinding)
		clientProd.conversations
			.conversations(sid)
			.participants(mid)
			.remove()
			.then(participant => res.send(participant))
			.catch(err => res.status(500).send(err));
	}
);

app.get("/twilio/prod/testwhatsapp", (req, res) => {
	clientProd.messages
		.create({
			from: "whatsapp:+16314064104",
			body: `Thank you for applying for SOAL Product Engineering. Your interview is scheduled for the following date and time.`,
			to: "whatsapp:+919807422073"
		})
		.then(message => {
			console.log(message);
			res.send(message);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});

	clientProd.messages
		.create({
			from: "whatsapp:+16314064104",
			body: `Thank you for applying for SOAL Product Engineering. Your interview is scheduled for the following date and time.`,
			to: "whatsapp:+919706671567"
		})
		.then(message => {
			console.log(message);
			res.send(message);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

app.use("/twilio", twilioMiddleware);

app.post("/twilio/endpoint", (req, res) => {
	clientProd.messages
		.create({
			from: "whatsapp:+16314064104",
			body: `${req.body.Body}`,
			to: "whatsapp:+919706671567"
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
