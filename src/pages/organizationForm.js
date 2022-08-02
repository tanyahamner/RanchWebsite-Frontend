import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import asyncAPICall from "../util/apiWrapper";
import logout from "../util/logout";
import useAbortEffect from "../hooks/useAbortEffect";

const OrganizationForm = (props) => {
  const [org_id, setOrgId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip_code, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let fetch_url = "add";
    const form_body = new FormData(e.target);
    const body = Object.fromEntries(form_body);

    if (editing) {
      fetch_url = "update";
    }

    asyncAPICall(
      `/organization/${fetch_url}`,
      "POST",
      body,
      null,
      (data) => {
        props.history.push(`/organizations`);
      },
      null
    );
  };

  useAbortEffect(
    (signal) => {
      const org_id = props.match.params.org_id;

      if (org_id) {
        const auth_ok = asyncAPICall(
          `/organization/get/${org_id}`,
          "GET",
          null,
          null,
          (data) => {
            if (!data.org_id) {
              console.log("ERROR: organization not found");
            } else {
              setOrgId(data.org_id);
              setName(data.name);
              setAddress(data.address);
              setCity(data.city);
              setState(data.state);
              setZipCode(data.zip_code);
              setPhone(data.phone);
              setEditing(true);
            }
          },
          (err) => console.error("Error in Get Organization Effect: ", err),
          signal
        );

        if (!auth_ok) {
          logout(props);
        }
      }
    },
    [props]
  );

  useEffect(() => {
    const title = editing ? "Edit Organization" : "Add Organization";

    setTitle(title);
  }, [editing]);

  return (
    <div className="wrapper">
      <div className="form-field-wrapper">
        <Paper className="form-wrapper" elevation={3}>
          <h2>{title}</h2>
          <form className="form" onSubmit={handleSubmit} method="POST">
            <label htmlFor="name">Organization Name *</label>
            <TextField
              required
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              size="small"
            />

            <label htmlFor="address">Address</label>
            <TextField
              id="address"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              variant="outlined"
              size="small"
            />

            <label htmlFor="city">City</label>
            <TextField
              id="city"
              name="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="outlined"
              size="small"
            />

            <label htmlFor="state">State</label>
            <TextField
              id="state"
              name="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              variant="outlined"
              size="small"
            />

            <label htmlFor="zip_code">Zip Code</label>
            <TextField
              id="zip_code"
              name="zip_code"
              type="text"
              value={zip_code}
              onChange={(e) => setZipCode(e.target.value)}
              variant="outlined"
              size="small"
            />

            <label htmlFor="phone">Phone</label>
            <TextField
              id="phone"
              name="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              variant="outlined"
              size="small"
            />

            <Button
              className="cancel-button"
              type="button"
              onClick={() => props.history.goBack()}
            >
              Cancel
            </Button>
            <Button className="confirm-button" type="submit">
              {title}
            </Button>

            {org_id ? <input type="hidden" name="org_id" value={org_id} /> : ""}
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default OrganizationForm;
