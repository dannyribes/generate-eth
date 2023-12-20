const fs = require("fs");
const ethers = require("ethers");

const data = fs
  .readFileSync(
    "./back/datos/networks/testnet2/keystore/UTC--2023-12-20T15-05-21.271980172Z--832d5c06263400eaa5f7a5d20688597d1d40d094"
  )
  .toString("utf-8");

const wallet = ethers.Wallet.fromEncryptedJsonSync(data, "12345678");

console.log("Private Key: ", wallet.privateKey);
console.log("Address: ", wallet.address);
console.log("Public Key: ", wallet.publicKey);
