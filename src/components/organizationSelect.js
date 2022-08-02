import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Cookies from "js-cookie";

import asyncAPICall from "../util/apiWrapper";
import useAbortEffect from "../hooks/useAbortEffect";

const OrganizationSelect = (props) => {
  const [organizations, setOrganizations] = useState([
    { name: "Select an Organization", value: "" },
  ]);
  const [loaded, setLoaded] = useState(false);

  const handleChange = (e, value) => {
    if (value) {
      props.handleOrgValues(value);
    }
  };

  useAbortEffect((sig) => {
    let auth_token = Cookies.get("auth_token");

    if (auth_token) {
      asyncAPICall(
        `/organization/get`,
        "GET",
        null,
        null,
        (data) => {
          let options = [{ name: "Select an Organization", value: "" }];

          data.forEach((element) => {
            options.push({
              name: element.name,
              value: element.org_id,
              active: element.active,
            });
          });

          setOrganizations(options);
          setLoaded(true);
        },
        null,
        sig
      );
    }
  }, []);

  return (
    <div>
      <Autocomplete
        id="org_id"
        name="org_id"
        options={organizations}
        getOptionLabel={(option) => {
          if (option.name) {
            return option.name;
          } else {
            return "Select an Organization";
          }
        }}
        getOptionSelected={(option) => {
          if (!loaded) {
            return true;
          }
          if (option.value) {
            return option.value === props.org_id;
          } else {
            return false;
          }
        }}
        getOptionDisabled={(option) => {
          return !option.active;
        }}
        style={{ width: 300 }}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} label="" variant="outlined" />
        )}
        size="small"
        disableClearable
        loading={!loaded}
        value={{
          name: props.org_name,
          value: props.org_id,
        }}
      />
    </div>
  );
};

export default OrganizationSelect;
