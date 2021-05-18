import { useState } from "react";
import { useHistory } from "react-router-dom";
import asyncAPICall from "../util/apiWrapper";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Logo from "../img/logo.svg";

const ForgotPassword = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const routeChange = (e, route = "/login") => {
    e.preventDefault();
    history.push(route);
  };

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
      console.log(email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    asyncAPICall(
      "/user/pwchangerequest",
      "POST",
      {
        email: email,
      },
      null,
      routeChange(e, "/login/email/sent"),
      null,
      false
    );
  };

  function redirectTo(path) {
    props.history.push(path);
  }

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
          <form className="recovery-form" onSubmit={handleSubmit}>
            <TextField
              required
              type="email"
              variant="outlined"
              size="small"
              placeholder="Your email here..."
              onChange={handleChange}
            />
            <Button
              className="confirm-button send-recovery"
              type="submit"
              onClick={() => redirectTo(`/login/email/sent`)}
            >
              send me recovery link
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default ForgotPassword;
