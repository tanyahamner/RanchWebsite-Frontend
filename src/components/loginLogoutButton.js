import React from "react";
import Button from "@material-ui/core/Button";

import logout from "../util/logout";

export default function LoginLogoutButton(props) {
  return (
    <div className="nav-item login-logout-button">
      <Button className="confirm-button" onClick={() => logout(props)}>
        {props.authToken ? "Logout" : "Login"}
      </Button>
    </div>
  );
}
