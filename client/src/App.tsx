import React from "react";
import { Switch, Route } from "wouter";
import Login from "./pages/Login";
import MatchDeFr from "./pages/MatchDeFr";
import MatchDeFrIt from "@/pages/MatchDeFrIt";

function App() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/match" component={MatchDeFr} />
      <Route path="/matchdefrit" component={MatchDeFrIt} />
      
    </Switch>
  );
}

export default App;
