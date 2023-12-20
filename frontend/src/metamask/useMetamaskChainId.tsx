import { useContext } from "react";
import { MetamaskChainIdContext } from "./MetamaskProvider";

const useMetamaskChainId = () => {
  return useContext(MetamaskChainIdContext);
};

export default useMetamaskChainId;
