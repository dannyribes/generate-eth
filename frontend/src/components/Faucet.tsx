import React from "react";
import { Button } from "@mui/material";
import useMetamaskChainId from "../metamask/useMetamaskChainId";
import useMetamaskAccount from "../metamask/useMetamaskAccount";

const Faucet = () => {
  const chainId = useMetamaskChainId();
  const account = useMetamaskAccount();
  const handleFaucet = async () => {
    fetch("http://localhost:3000/faucet", {
      method: "POST",
      body: JSON.stringify({ chainId, account }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div className="m-5">
      <Button onClick={handleFaucet} variant="contained" color="success">
        Get 0.1 Eth Reward
      </Button>
    </div>
  );
};

export default Faucet;
