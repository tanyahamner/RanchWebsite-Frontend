import React from "react";
import { Route } from "react-router-dom";

import ForgotPassword from "../auth/forgotPassword/ForgotPasswordPage";
import EmailSent from "../auth/forgotPassword/EmailSentPage";
import TempPassword from "../auth/forgotPassword/TempPassword";
import ChangePassword from "../auth/forgotPassword/ChangePassword";
import LoginPage from "../pages/auth/LoginPage";

export default function loginContainer(props) {
  return (
    <div className="wrapper">
      <div className="container">
        <Route
          exact
          path="/login"
          render={(props) => (
            <LoginPage
              {...props}
              authToken={props.authToken}
              setAuthToken={props.setAuthToken}
            />
          )}
        />

        <Route
          exact
          path="/login/password/recovery"
          component={ForgotPassword}
        />

        <Route
          exact
          path="/login/password/temporary"
          component={TempPassword}
        />

        <Route exact path="/login/password/change" component={ChangePassword} />
        <Route exact path="/login/email/sent" component={EmailSent} />
      </div>
    </div>
  );
}
