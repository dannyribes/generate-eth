import { useContext } from "react";
import { MetamaskBalanceContext } from "./MetamaskProvider";

const useMetamaskBalance = () => {
  return useContext(MetamaskBalanceContext);
};

export default useMetamaskBalance;
