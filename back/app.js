const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;
app.listen(port, () => console.log("Listening on port 3000"));

var networkRouter = require("./routes/network");
var accountsRouter = require("./routes/accounts");

app.use(cors());
app.use(bodyParser.json());

app.use("/network", networkRouter);
app.use("/accounts", accountsRouter);
