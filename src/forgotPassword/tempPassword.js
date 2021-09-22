import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import Logo from "../img/logo.svg";

const tempPassword = "dhalkfheluhalkjhdkjlfhiue";
const username = "Tim";

const TempPassword = (props) => {
  const redirectTo = (path) => {
    props.history.push(path);
  };

  return (
    <div className="fp-page-wrapper">
      <div className="forgot-password-wrapper">
        <div className="logo">
          <img src={Logo} alt="" height="32px"></img>
        </div>
        <Paper className="recovery-paper" elevation={3}>
          <h2>Password Reset</h2>
          <div>Your temporary password for {username} is:</div>
          <h2>{tempPassword}</h2>
          <div>
            Please push the button, after which you will be asked to create a
            new password
          </div>
          <Button
            className="confirm-button"
            onClick={() => redirectTo(`/login`)}
          >
            Login
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default TempPassword;
