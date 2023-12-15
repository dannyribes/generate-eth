const express = require("express");
const { Web3 } = require("web3");

const router = express.Router();

const web3 = new Web3("http://localhost:8545");

router.post("/", async (req, res) => {});

module.exports = router;
