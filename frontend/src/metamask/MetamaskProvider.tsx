import React from "react";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Web3 from "web3";

type MetamaskInfo = {
  account: string;
  balance: string;
  chainId: string;
};

export const MetamaskContext = createContext<MetamaskInfo>({
  account: "",
  balance: "",
  chainId: "",
});

export const MetamaskProvider = ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    async function handleAccountsChanged(accounts) {
      setAccount(accounts[0]);
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      const balanceInEther = Web3.utils.fromWei(balance, "ether");
      setBalance(balanceInEther);
    }
    const handleChainChanged = () => {
      setChainId(window.ethereum.networkVersion);
    };
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    window.ethereum.request({ method: "eth_chainId" }).then(setChainId);

    window.ethereum.on("chainChanged", setChainId);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", setChainId);
    };
  }, []);

  const metamaskInfo = useMemo(
    () => ({
      account,
      balance,
      chainId,
    }),
    [account, balance, chainId]
  );

  return (
    <MetamaskContext.Provider value={metamaskInfo}>
      {children}
    </MetamaskContext.Provider>
  );
};
