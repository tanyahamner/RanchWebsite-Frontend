import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";

import asyncAPICall from "../util/apiWrapper";
import logout from "../util/logout";
import useAbortEffect from "../hooks/useAbortEffect";

const ProfileEdit = (props) => {
  const [user_id, setUserId] = useState("");
  const [org_id, setOrgId] = useState("");
  // const [org_name, setOrgName] = useState('')
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState('')
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  // const [active, setActive] = useState(1)

  useAbortEffect(
    (signal) => {
      let user_id = props.match.params.user_id;

      if (user_id) {
        let auth_ok = asyncAPICall(
          `/user/get/${user_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.user_id) {
              console.log("ERROR: user not found");
            } else {
              setUserId(data.user_id);
              setOrgId(data.org_id);
              // setOrgName(data.organization.name)
              setFirstName(data.first_name);
              setLastName(data.last_name);
              setEmail(data.email);
              // setPassword(data.password)
              setPhone(data.phone);
              setRole(data.role);
              // setActive(data.active)
            }
          },
          (err) => console.error("Error in Get User Effect: ", err),
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      }
    },
    [props]
  );

  const handleSubmit = (e) => {
    let auth_token = Cookies.get("auth_token");
    if (auth_token == null) {
      logout(props);
    }
    e.preventDefault();

    let form_body = new FormData(e.target);

    asyncAPICall(
      `/user/update`,
      "POST",
      Object.fromEntries(form_body),
      null,
      (data) => {
        props.history.push(`/user/${user_id}`);
      },
      (error) => console.log("Update User Error: ", error)
    );
  };

  useEffect(() => {
    let org_id = Cookies.get("org_id");

    setOrgId(org_id);
  }, []);

  return (
    <div className="wrapper">
      <div className="form-field-wrapper">
        <Paper className="form-wrapper" elevation={3}>
          <h2>Edit My Profile</h2>
          <form className="form" onSubmit={handleSubmit} method="POST">
            <input type="hidden" name="org_id" value={org_id} />
            <input type="hidden" name="role" value={role} />
            <label htmlFor="first_name">First Name *</label>
            <TextField
              required
              id="first_name"
              name="first_name"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              size="small"
            />

            <label htmlFor="last_name">Last Name *</label>
            <TextField
              required
              id="last_name"
              name="last_name"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              size="small"
            />

            <label htmlFor="email">Email *</label>
            <TextField
              required
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="small"
              autoComplete="email"
            />

            <label htmlFor="phone">Phone</label>
            <TextField
              id="phone"
              name="phone"
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputProps={{ minLength: 10 }}
              variant="outlined"
              size="small"
              phone={phone}
            />

            <Button
              className="cancel-button"
              type="button"
              onClick={() => props.history.goBack()}
            >
              Cancel
            </Button>
            <Button className="confirm-button" type="submit">
              Edit My Profile
            </Button>

            {user_id ? (
              <input type="hidden" name="user_id" value={user_id} />
            ) : (
              ""
            )}
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default ProfileEdit;
