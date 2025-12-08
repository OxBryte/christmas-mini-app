import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateGift from "./pages/CreateGift";
import Claim from "./pages/Claim";
import Admin from "./pages/Admin";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateGift />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/claim/:id" element={<Claim />} />
        </Route>
        <Route path="/0xadmin0x" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
