import React from "react";
import Home from "./Home";
import { RecoilRoot } from "recoil";
function App() {
  return (
    <>
      <RecoilRoot>
        <Home />
      </RecoilRoot>
    </>
  );
}

export default App;
