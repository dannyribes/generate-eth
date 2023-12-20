import { useContext } from "react";
import { MetamaskAccountContext } from "./MetamaskProvider";

const useMetamaskAccount = () => {
  return useContext(MetamaskAccountContext);
};

export default useMetamaskAccount;
