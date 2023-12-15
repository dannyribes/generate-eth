const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

DIR_BASE = path.join(__dirname, "datos");
DIR_NETWORKS = path.join(DIR_BASE, "networks");

function existsDir(dir) {
  try {
    fs.statSync(dir);
    return true;
  } catch (err) {
    return false;
  }
}
function createDir(dir) {
  if (!existsDir(dir)) {
    fs.mkdirSync(dir);
  }
}

function createGenesis(network) {
  const pathNetwork = path.join(DIR_NETWORKS, network.id);
  // ejemplo de genesis
  let genesis = {
    config: {
      chainId: network.chainId,
      homesteadBlock: 0,
      eip150Block: 0,
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      clique: {
        period: 4,
        epoch: 30000,
      },
    },
    nonce: "0x0",
    timestamp: "0x5e9d4d7c",

    extradata:
      "0x00000000000000000000000000000000000000000000000000000000000000002235dea2f59600419e3e894d4f2092f0f9c4bb620000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",

    gasLimit: "0x2fefd8",
    difficulty: "0x1",

    alloc: {
      "2235dea2f59600419e3e894d4f2092f0f9c4bb62": {
        balance: "0xad78ebc5ac6200000",
      },
      C077193960479a5e769f27B1ce41469C89Bec299: {
        balance: "0xad78ebc5ac6200000",
      },
    },
  };
  // metemos la cuenta generada
  network.alloc.push(
    fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()
  );
  genesis.alloc = network.alloc.reduce((acc, i) => {
    const cuenta = i.substring(0, 2) == "0x" ? i.substring(2) : i;
    acc[cuenta] = { balance: "0xad78ebc5ac6200000" };
    return acc;
  }, {});

  // cuenta que firma
  let cuenta = fs.readFileSync(`${pathNetwork}/address.txt`).toString();
  cuenta = cuenta.substring(0, 2) == "0x" ? cuenta.substring(2) : i;

  genesis.extradata = "0x" + "0".repeat(64) + cuenta.trim() + "0".repeat(130);
  return genesis;
}
function createPassword(network) {
  return "12345678";
}

function createNodeMiner(node) {
  const miner = `
    ${node.name}:
        image: ethereum/client-go:latest
        volumes:
            - ./${node.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
            - ./password.txt:/root/.ethereum/password.sec
            - ./keystore:/root/.ethereum/keystore
        depends_on:
            - geth-bootnode
        networks:
            ethnetwork:
                ipv4_address: ${node.ip}
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth   
            --nat "extip:${node.ip}"
            --netrestrict=\${SUBNET} 
            --bootnodes="\${BOOTNODE}"
            --miner.etherbase \${ETHERBASE}   
            --mine  
            --unlock \${UNLOCK}
            --password /root/.ethereum/password.sec'

`;
  return miner;
}

function createBootnode(network) {
  const bootnode = `
    geth-bootnode:
        hostname: geth-bootnode
        image: ethereum/client-go:alltools-latest-arm64
        command: 'bootnode     --addr \${IPBOOTNODE}:30301 
            --netrestrict=\${SUBNET} 
            --nodekey=/root/.ethereum/bootnode.key'
        volumes:
        - ./bootnode.key:/root/.ethereum/bootnode.key
        networks:
            ethnetwork:
                ipv4_address: \${IPBOOTNODE} `;
  return bootnode;
}

function createNodeRpc(node) {
  const rpc = `
    ${node.name}:
        image: ethereum/client-go:latest
        volumes:
            - ./${node.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
        depends_on:
             - geth-bootnode
        networks:
            ethnetwork:
                    ipv4_address: ${node.ip}
        ports:
            - "${node.port}:8545"
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth     
            --netrestrict=\${SUBNET}    
            --bootnodes="\${BOOTNODE}"
            --nat "extip:${node.ip}"
            --http 
            --http.addr "0.0.0.0" 
            --http.port ${node.port} 
            --http.corsdomain "*" 
            --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'
    `;
  return rpc;
}

function createNodeNormal(node) {
  const n = `
    ${node.name}:
        image: ethereum/client-go:latest
        volumes:
            - ./${node.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
        depends_on:
            - geth-bootnode
        networks:
            ethnetwork:
                    ipv4_address: ${node.ip}
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth   
            --bootnodes="\${BOOTNODE}"
            --nat "extip:${node.ip}"
            --netrestrict=\${SUBNET}  ' `;
  return n;
}

function createNode(node) {
  switch (node.type) {
    case "miner":
      return createNodeMiner(node);
    case "rpc":
      return createNodeRpc(node);
    case "normal":
      return createNodeNormal(node);
  }
}
function createDockerCompose(network) {
  const dockerCompose = `
version: '3'
services:
${createBootnode(network)}
${network.nodes.map((node) => createNode(node)).join("\n")}
networks:
  ethnetwork:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: \${SUBNET}

`;
  return dockerCompose;
}
function createEnv(network) {
  const pathNetwork = path.join(DIR_NETWORKS, network.id);
  let bootnode = `enode://${fs
    .readFileSync(`${pathNetwork}/bootnode`)
    .toString()}@${network.ipBootnode}:0?discport=30301`;
  bootnode = bootnode.replace("\n", "");
  const file = `
BOOTNODE=${bootnode}
SUBNET=${network.subnet}
IPBOOTNODE=${network.ipBootnode}
ETHERBASE=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
UNLOCK=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
`;
  return file;
}

function createCuentaBootnode(pathNetwork) {
  const cmd = `
    docker run -e IP="@172.16.238.20:0?discport=30301" \
    --rm -v ${pathNetwork}:/root ethereum/client-go:alltools-latest-arm64 \
sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30-  \
> /root/address.txt  \
 &&  bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode"`;

  execSync(cmd);
}

module.exports = {
  existsDir,
  createCuentaBootnode,
  createEnv,
  createDockerCompose,
  createGenesis,
  createPassword,
};
