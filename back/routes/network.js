const { execSync } = require("child_process");
const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  existsDir,
  createCuentaBootnode,
  createEnv,
  createDockerCompose,
  createGenesis,
  createPassword,
  DIR_NETWORKS,
  DIR_BASE,
} = require("../eth-utils");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    const network = req.body;
    const id = network.id;

    const pathNetwork = path.join(DIR_NETWORKS, id);

    if (existsDir(path.join(DIR_BASE, "networks", id)))
      fs.rmdirSync(path.join(DIR_BASE, "networks", id), { recursive: true });

    fs.mkdirSync(path.join(DIR_BASE, "networks", id), { recursive: true });

    fs.writeFileSync(`${pathNetwork}/password.txt`, createPassword(network));

    createCuentaBootnode(pathNetwork);
    fs.writeFileSync(
      `${pathNetwork}/genesis.json`,
      JSON.stringify(createGenesis(network), null, 4)
    );
    //------------------------------------------------------------
    fs.writeFileSync(`./env.txt`, id);

    


      

    fs.writeFileSync(
      `${pathNetwork}/docker-compose.yml`,
      createDockerCompose(network)
    );
    fs.writeFileSync(`${pathNetwork}/.env`, createEnv(network));
    execSync(`docker-compose -f ${pathNetwork}/docker-compose.yml up -d`);
    res.send(network);
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

module.exports = router;
