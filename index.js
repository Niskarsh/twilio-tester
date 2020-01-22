require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

const port  = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("backend started");
});

app.listen(port, err => console.log(err ? err : `server running on ${port}`));
module.exports.app = app;
