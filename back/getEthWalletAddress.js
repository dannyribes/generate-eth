const fs = require("fs");
const ethers = require("ethers");

const data = fs
  .readFileSync(
    "./datos/networks/net1/keystore/UTC--2023-12-15T10-59-18.963191008Z--ccc9c51bb202deabee4f0f04ff2db1f9a6a5515e"
  )
  .toString("utf-8");

const wallet = ethers.Wallet.fromEncryptedJsonSync(data, "12345678");

console.log("Private Key: ", wallet.privateKey);
console.log("Address: ", wallet.address);
console.log("Public Key: ", wallet.publicKey);
