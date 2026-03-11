import { Switch, Route } from "wouter";
import Login from "./pages/Login";
import MatchDeFr from "./pages/MatchDeFr";

function App() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/match" component={MatchDeFr} />
    </Switch>
  );
}

export default App;
