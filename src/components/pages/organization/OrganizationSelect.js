import { useEffect, useState } from "react";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import Cookies from "js-cookie";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";

const OrganizationSelect = (props) => {
  const [organizations, setOrganizations] = useState([]);
  // const [orgSelect, setOrgSelect] = useState("Select an Organization");
  const [loaded, setLoaded] = useState(false);

  const handleChange = (e) => {
    if (e.target.value && typeof e.target.value !== "string") {
      props.handleOrgValues(e.target.value);
    }
  };

  const mapOrganizations = () => {
    return organizations.map((org, idx) => {
      return (
        <option key={idx} value={org}>
          {org.name}
        </option>
      );
    });
  };

  useEffect(() => {
    const auth_token = Cookies.get("auth_token");

    if (auth_token) {
      console.log("req");
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
          setOrganizations(options);
          console.log(organizations);
          setLoaded(true);
        },
        null,
        props
      );

      if (!auth_ok) {
        logout();
      }
    }
  }, []);

  // console.log(organizations);

  return (
    <select onChange={handleChange}>
      {/* {loaded && mapOrganizations()} */}
      <option value="Select Organization">Select Organization</option>
      {/* <option value="DevPipeline">DevPipeline</option> */}
      {mapOrganizations()}
      {/* {allowedUserRoles} */}
    </select>
  );
};

export default OrganizationSelect;
