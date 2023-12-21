const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require('path');
const { ethers } = require("ethers");
const { DIR_NETWORKS } = require("./eth-utils");


const app = express();
const port = 3000;
app.listen(port, () => console.log("Listening on port 3000"));

var networkRouter = require("./routes/network");
var faucetRouter = require("./routes/faucet");

app.use(cors());
app.use(bodyParser.json());

app.use("/network", networkRouter);
app.use("/faucet", faucetRouter);

app.get('/faucet/:account/:amount', async (req, res) => {
    // los parametros son la red, la cuenta y la cantidad
    const { account, amount } = req.params
    // obtenemos la red
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    // const network = networks.find(i => i.id == net)
    // si no existe not data found
    /*
    if (!network) {
        res.status(404).send('No se ha encontrado la red');
        return;
    }
    */
    // obtenemos el directorio donde esta y los datos de la password la cuenta
    const pathNetwork = path.join("./datos/networks/", fs.readFileSync(`../back/env.txt`).toString().trim())
    
    
    // path.join(DIR_NETWORKS, network.id)
    const address = fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()
    const password = fs.readFileSync(`${pathNetwork}/password.txt`).toString().trim()
    const files = fs.readdirSync(`${pathNetwork}/keystore`)
    // obtenemos el port del rpc
    const port = 8545
        // network.nodos.find(i => i.type == 'rpc').port
    // creamos el provider y el signer
    const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`);
    // leemos la clave privada para hacer un wallet
    const json = fs.readFileSync(path.join(pathNetwork, 'keystore', files[0])).toString()
    const wallet = await ethers.Wallet.fromEncryptedJson(
        json, password);
    // creamos el signer a partir del wallet y del provider
    const signer = wallet.connect(provider);
    // enviamos la cantidad a la cuenta
    const tx = await signer.sendTransaction({
        from: address,
        to: account,
        value: ethers.parseUnits(amount,18)

    });
    // devolvemos la transaccion
    res.send({hash:tx});
})