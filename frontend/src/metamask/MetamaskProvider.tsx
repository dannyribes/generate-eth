import React, { useCallback } from "react";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Web3 from "web3";

export const MetamaskAccountContext = createContext("");
export const MetamaskBalanceContext = createContext("0");
export const MetamaskChainIdContext = createContext("");
export const MetamaskRefreshBalanceContext = createContext<() => void>(
  () => {}
);

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

  const refreshBalance = useCallback(async () => {
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    const balanceInEther = Web3.utils.fromWei(balance, "ether");
    setBalance(balanceInEther);
  }, [account]);

  return (
    <MetamaskAccountContext.Provider value={account}>
      <MetamaskChainIdContext.Provider value={chainId}>
        <MetamaskBalanceContext.Provider value={balance}>
          <MetamaskRefreshBalanceContext.Provider value={refreshBalance}>
            {children}
          </MetamaskRefreshBalanceContext.Provider>
        </MetamaskBalanceContext.Provider>
      </MetamaskChainIdContext.Provider>
    </MetamaskAccountContext.Provider>
  );
};
