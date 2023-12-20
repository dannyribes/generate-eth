import React, { FormEvent, useState } from "react";
import { FormControl, InputLabel, Button, Input, Alert } from "@mui/material";

type Node = {
  type: string;
  name: string;
};

const NetworkCreator = () => {
  const [networkId, setNetworkId] = useState("");
  const [chainId, setChainId] = useState("");
  const [alloc, setAlloc] = useState<string[]>([""]);
  const [nodes, setNodes] = useState<Node[]>([{ type: "", name: "" }]);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [isError, setIsError] = useState<Object | null>();

  const handleAddAlloc = () => {
    setAlloc((state) => [...state, ""]);
  };

  const handleAllocChange = (index: number, value: string) => {
    setAlloc((state) => [
      ...state.slice(0, index),
      value,
      ...state.slice(index + 1),
    ]);
  };

  const handleRemoveAlloc = (index: number) => {
    setAlloc((state) => [...state.slice(0, index), ...state.slice(index + 1)]);
  };

  const handleAddNode = () => {
    setNodes((state) => [...state, { type: "", name: "", ip: "", port: "" }]);
  };

  const handleNodeChange = (index: number, key: keyof Node, value: string) => {
    setNodes((state) => [
      ...state.slice(0, index),
      { ...state[index], [key]: value },
      ...state.slice(index + 1),
    ]);
  };

  const handleRemoveNode = (index: number) => {
    setNodes((state) => [...state.slice(0, index), ...state.slice(index + 1)]);
  };

  const handleSubmit = async (e: FormEvent) => {
    setIsError(null);
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/network", {
        method: "POST",
        body: JSON.stringify({
          id: networkId,
          chainId: Number(chainId),
          nodes,
          alloc,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) setIsSuccessfull(true);
      else setIsError(await res.json());
    } catch (e) {
      setIsError(e.body);
    }
  };
  return (
    <>
      <h3 className=" m-2 font-bold text-lg">Create Network</h3>
      {isSuccessfull ? (
        <Alert color="success">Network created sucessfully!</Alert>
      ) : (
        <form className="m-2" onSubmit={handleSubmit}>
          <div className="flex justify-evenly">
            <FormControl className="w-[20%]">
              <InputLabel>Network ID</InputLabel>
              <Input
                id="network-id"
                name="network-id"
                value={networkId}
                onChange={(e) => setNetworkId(e.target.value)}
              />
            </FormControl>
            <FormControl className="w-[20%]">
              <InputLabel>Chain ID</InputLabel>
              <Input
                id="chain-id"
                name="chain-id"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
              />
            </FormControl>
          </div>

          <h4>Alloc</h4>
          <Button onClick={handleAddAlloc}>Add</Button>
          {alloc.map((address, i) => (
            <div key={i} className="flex gap-1 mb-3 items-center">
              <Button
                className="w-5 h-6 min-w-0 mt-3"
                color="error"
                variant="contained"
                onClick={() => handleRemoveAlloc(i)}
              >
                X
              </Button>
              <FormControl className="w-[20%]">
                <InputLabel>Account</InputLabel>
                <Input
                  id="account"
                  name="account"
                  value={address}
                  onChange={(e) => handleAllocChange(i, e.target.value)}
                />
              </FormControl>
            </div>
          ))}

          <h4>Nodes</h4>
          <Button onClick={handleAddNode}>Add</Button>
          {nodes.map((node, i) => (
            <div
              key={i}
              className="flex gap-1 mb-10 items-center justify-between"
            >
              <Button
                className="w-5 h-6 min-w-0 mt-3"
                color="error"
                variant="contained"
                onClick={() => handleRemoveNode(i)}
              >
                X
              </Button>
              <FormControl className="w-[20%]">
                <InputLabel>Type</InputLabel>
                <Input
                  id="node-type"
                  name="node-type"
                  value={node.type}
                  onChange={(e) => handleNodeChange(i, "type", e.target.value)}
                />
              </FormControl>
              <FormControl className="w-[20%]">
                <InputLabel>Name</InputLabel>
                <Input
                  id="node-name"
                  name="node-name"
                  value={node.name}
                  onChange={(e) => handleNodeChange(i, "name", e.target.value)}
                />
              </FormControl>
            </div>
          ))}

          <Button color="success" type="submit" variant="contained">
            Create
          </Button>
          {isError && <pre>{JSON.stringify(isError, undefined, 1)}</pre>}
        </form>
      )}
    </>
  );
};

export default NetworkCreator;
