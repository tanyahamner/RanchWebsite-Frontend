import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import ConfirmDelete from "../components/confirmDelete";
import { formatPhone, validateUUID } from "../util/stringUtils";
import SecurityWrapper from "../util/securityWrapper";
import asyncAPICall from "../util/apiWrapper";
import logout from "../util/logout";

const GetUser = (props) => {
  const [user, setUser] = useState({});
  const [cannotChangeActiveState, setCannotChangeActiveState] = useState(false);

  const handleActivation = () => {
    const endpoint = user.active ? "deactivate" : "activate";

    asyncAPICall(
      `/user/${endpoint}/${user.user_id}`,
      "PUT",
      null,
      null,
      (data) => {
        setUser(data);
      },
      (error) => {
        console.log("Unable to deactivate your own user", error);
      },
      props
    );
  };

  const redirectTo = (path) => {
    props.history.push(path);
  };

  useEffect(() => {
    const user_id = props.match.params.user_id;

    if (!validateUUID(user_id)) {
      props.history.push("/notfound");
    }

    let auth_ok = asyncAPICall(
      `/user/get/${user_id}`,
      "GET",
      null,
      null,
      (data) => {
        setUser(data);
        setCannotChangeActiveState(false);
      },
      null,
      props
    );
    if (!auth_ok) {
      logout(props);
    }
  }, [props]);

  return (
    <div className="get-wrapper">
      <div className="get-detail-wrapper">
        <Button
          className="confirm-button back-button"
          onClick={() => props.history.goBack()}
        >
          <i className="fas fa-chevron-left button-icon"></i> Back
        </Button>
        <div className="detail-wrapper wrapper">
          <Paper className="form-wrapper narrow-paper" elevation={3}>
            <div className="details">
              <div className="top-section">
                <h1>
                  {user.first_name} {user.last_name}
                </h1>
                <SecurityWrapper restrict_roles="user">
                  <div className="switch-wrapper">
                    Active:
                    <label className="switch">
                      <input
                        type="checkbox"
                        disabled={cannotChangeActiveState}
                        onClick={handleActivation}
                        defaultChecked={user.active}
                      />
                      <span className="slider round">
                        <span>On</span>
                        <span>Off</span>
                      </span>
                    </label>
                  </div>
                </SecurityWrapper>
              </div>

              <div className="middle-section">
                <div className="icon-and-details">
                  <i className="fas fa-user"></i>
                  <div>
                    <Link
                      className="no-decoration"
                      to={`/organization/${user.org_id}`}
                    >
                      <h3>
                        {user.organization ? user.organization.name : "unknown"}
                      </h3>
                    </Link>
                    <SecurityWrapper restrict_roles="user">
                      <p className="role">{user.role}</p>
                    </SecurityWrapper>
                    <p className="email">{user.email}</p>
                    <p className="phone">{formatPhone(user.phone)}</p>
                  </div>
                </div>

                <div className="flex-row">
                  <SecurityWrapper restrict_roles="user">
                    <Button
                      className="confirm-button"
                      onClick={() => redirectTo(`/user/edit/${user.user_id}`)}
                    >
                      Edit
                    </Button>
                    <ConfirmDelete
                      objectType="user"
                      id={user.user_id}
                      redirectTo={redirectTo}
                    />
                  </SecurityWrapper>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default GetUser;
