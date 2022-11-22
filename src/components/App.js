import { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "../styles/app.scss";
import LoginContainer from "./routing/LoginContainer";
import DefaultContainer from "./routing/DefaultContainer";
import solidIcons from "../util/fontawesome-icons/solidIcons";
import brandIcons from "../util/fontawesome-icons/brandIcons";

solidIcons();
brandIcons();

function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            path="/login"
            render={(routeProps) => {
              return (
                <LoginContainer
                  {...routeProps}
                  authToken={authToken}
                  setAuthToken={setAuthToken}
                />
              );
            }}
          />

          <Redirect exact from="/" to="/login" />

          <Route
            render={(routeProps) => (
              <DefaultContainer
                {...routeProps}
                authToken={authToken}
                setAuthToken={setAuthToken}
              />
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
