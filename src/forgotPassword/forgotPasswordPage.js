import { useState } from "react";

import asyncAPICall from "../util/apiWrapper";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Logo from "../img/logo.svg";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");

  const routeChange = (route = "/login") => {
    props.history.push(route);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    asyncAPICall(
      "/user/pw_change_request",
      "POST",
      {
        email: email,
      },
      null,
      routeChange("/login/email/sent"),
      null,
      false
    );
  };

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
          <hr color="#6C8CB5" />
          <div>Don't worry, it happens to the best of us.</div>
            <TextField
              required
              type="email"
              variant="outlined"
              size="small"
              placeholder="Your email here..."
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="confirm-button send-recovery"
              type="submit"
              onClick={handleSubmit}
            >
              send me recovery link
            </Button>
        </Paper>
      </div>
    </div>
  );
};

export default ForgotPassword;
