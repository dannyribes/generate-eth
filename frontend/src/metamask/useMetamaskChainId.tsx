import { useContext } from "react";
import { MetamaskContext } from "./MetamaskProvider";

const useMetamaskChainId = () => {
  const metamaskInfo = useContext(MetamaskContext);
  return metamaskInfo.chainId;
};

export default useMetamaskChainId;
