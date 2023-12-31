import Home from "./components/Home";
import NetworkCreator from "./components/NetworkCreator";
import AccountDisplay from "./components/AccountDisplay";
import Transfer from "./components/Transfer";
import NavLink from "./components/NavLink";
import Faucet from "./components/Faucet";
import { AppBar, Typography, Toolbar } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";

function App() {
  return (
    <main>
      <AppBar className="bg-gray-800" position="static">
        <Toolbar>
          <Typography variant="h5" component={Link} to="/">
            Eth Project
          </Typography>
          <div className="grow">
            <NavLink to="create-network">Create Network</NavLink>
            <NavLink to="transfer">Transfer</NavLink>
            <NavLink to="faucet">Faucet</NavLink>
          </div>
          <AccountDisplay />
        </Toolbar>
      </AppBar>
      <Routes>
        <Route index element={<Home />} />
        <Route path="create-network" element={<NetworkCreator />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="faucet" element={<Faucet />} />
      </Routes>
    </main>
  );
}

export default App;
