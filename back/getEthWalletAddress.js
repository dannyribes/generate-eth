const fs = require("fs");
const ethers = require("ethers");

const data = fs
  .readFileSync(
    "./datos/networks/testnet003/keystore/UTC--2023-12-21T13-23-37.395582882Z--03304301beeefd4d2cf2ed682ffb0cd511997d8d"
  )
  .toString("utf-8");

const wallet = ethers.Wallet.fromEncryptedJsonSync(data, "12345678");

console.log("Private Key: ", wallet.privateKey);
console.log("Address: ", wallet.address);
console.log("Public Key: ", wallet.publicKey);
