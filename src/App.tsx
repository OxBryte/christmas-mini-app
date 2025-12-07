import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateGift from "./pages/CreateGift";
import GiftDetails from "./pages/GiftDetails";
import Claim from "./pages/Claim";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateGift />} />
          <Route path="/gift/:id" element={<GiftDetails />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/claim/:id" element={<Claim />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
