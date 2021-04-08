import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

// import {Link} from 'react-router';

import './styles/App.scss';

import LoginPage from "./pages/loginPage"
import LoginContainer from "./loginContainer"
import DefaultContainer from "./defaultContainer"

function App() {

  const [authToken, setAuthToken] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/login' render={(props) => {
            return (<LoginPage {...props} authToken={authToken} setAuthToken={setAuthToken} />);
          }} />
          <Route exact path='/login/email/sent' render={(props) => {
            return (<LoginContainer {...props} authToken={authToken} setAuthToken={setAuthToken} />);
          }} />
          <Route exact path='/login/password/recovery' render={(props) => {
            return (<LoginContainer {...props} authToken={authToken} setAuthToken={setAuthToken} />);
          }} />
          <Route exact path='/login/password/temporary' render={(props) => {
            return (<LoginContainer {...props} authToken={authToken} setAuthToken={setAuthToken} />);
          }} />
          <Route exact path='/login/password/change' render={(props) => {
            return (<LoginContainer {...props} authToken={authToken} setAuthToken={setAuthToken} />);
          }} />
          <Redirect exact from='/' to='/login' />
          <Route render={(props) => <DefaultContainer {...props} authToken={authToken} setAuthToken={setAuthToken} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
