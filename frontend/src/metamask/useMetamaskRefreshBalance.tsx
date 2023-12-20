import { useContext } from "react";
import { MetamaskRefreshBalanceContext } from "./MetamaskProvider";

const useMetamaskRefreshBalance = () => {
  return useContext(MetamaskRefreshBalanceContext);
};

export default useMetamaskRefreshBalance;
