import React from "react";
import Paper from "@material-ui/core/Paper";
import Logo from "../img/logo.svg";

const ForgotPassword = () => {
  return (
    <div className="fp-page-wrapper">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="" height="32px"></img>
        </div>
        <Paper className="recovery-paper" elevation={3}>
          <div>
            <h2>Recover Password</h2>
          </div>
          <div>
            An email has been sent. Please click the link when you get it.
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ForgotPassword;
