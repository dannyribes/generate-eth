import { Button } from "@mui/material";
import useMetamaskChainId from "../metamask/useMetamaskChainId";
import useMetamaskAccount from "../metamask/useMetamaskAccount";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

declare global {interface Window {ethereum: any}}

function Faucet() {
  const [account, setAccount] = useState(null);
  const [tx, setTx] = useState(null); // [tx, setTx
  const params = useParams();
  useEffect(() => {
    const ethereum = window.ethereum;

    if (ethereum) {
      ethereum.on("accountsChanged", (accounts) => {
        console.log(accounts);
        setAccount(accounts[0]);
      });
      ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => {
          console.log(accounts);
          setAccount(accounts[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  async function send(amount) {
    fetch(`http://localhost:3000/faucet/${account}/${amount}`)
      .then((response) => {
        response.json().then((data) => {
          setTx(data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <form>
    <div>
        <br></br>
        </div>
    <div>
        <Button 
          className="btn btn-primary"         
          type="submit"
          variant="contained"
          color="success" 
          onClick={() => {send(10)}}>
            Request 10 ETH
        </Button>
    </div>
    <p>{tx ? "Done" : <br></br>}</p>
    </form>
  );
}
// <p>{tx ? <pre>Transaction: {JSON.stringify(tx,null, 4)}</pre> : <p>Transaction: No hay transacción</p>}</p>
export default Faucet;
