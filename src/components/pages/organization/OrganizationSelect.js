import { useEffect, useState } from "react";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import Cookies from "js-cookie";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";

const OrganizationSelect = (props) => {
  const [organizations, setOrganizations] = useState([
    { name: "Select an Organization", value: "" },
  ]);
  const [loaded, setLoaded] = useState(false);

  // const handleChange = (e, value) => {
  //   if (value) {
  //     props.handleOrgValues(value);
  //   }
  // };

  useEffect(() => {
    let auth_token = Cookies.get("auth_token");

    if (auth_token) {
      let auth_ok = asyncAPICall(
        `/organization/get`,
        "GET",
        null,
        null,
        (data) => {
          const options = data.map((option) => {
            return {
              name: option.name,
              value: option.value,
              active: option.active,
            };
          });
          // let options = [{ name: "Select an Organization", value: "" }];

          // data.forEach((element) => {
          //   options.push({
          //     name: element.name,
          //     value: element.org_id,
          //     active: element.active,
          //   });
          // });

          // setOrganizations(options);
          setOrganizations((o) => [...o, ...options]);
          setLoaded(true);
        },
        null,
        props
      );
      if (!auth_ok) {
        logout(props);
      }
    }
  }, [props]);

  return (
    <select
      onChange={(e) => props.handleOrgValues(e.target.value)}
      value={{ name: props.org_name, value: props.org_id }}
    >
      {/* {isLoaded} */}
      <option>Select Organization</option>

      {/* {allowedUserRoles} */}
    </select>
  );
};

export default OrganizationSelect;
