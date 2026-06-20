import React from "react";
import { Switch, Route } from "wouter";
import Login from "./pages/Login";
import MatchDeFr from "./pages/MatchDeFr";
import MatchFrDeIt from "./pages/MatchFrDeIt";
import French90 from "./pages/French90";
import German90 from "./pages/German90";

function App() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/match" component={MatchDeFr} />
      <Route path="/matchdefrit" component={MatchFrDeIt} />
      <Route path="/fr90" component={French90} />
      <Route path="/de90" component={German90} />
    </Switch>
  );
}

export default App;
