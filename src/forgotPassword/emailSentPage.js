import React from "react";

import Logo from "../img/logo.svg";

const ForgotPassword = () => {
  return (
    <div className="fp-page-wrapper">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="" height="32px"></img>
        </div>

        <div className="recovery-paper" elevation={3}>
          <div>
            <h2>Recover Password</h2>
          </div>

          <div>
            An email has been sent. Please click the link when you get it.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
