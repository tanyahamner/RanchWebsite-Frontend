import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import asyncAPICall from "../../../util/apiWrapper";
import logout from "../../../util/logout";

const OrganizationSelect = (props) => {
  const [organizations, setOrganizations] = useState([]);
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

          setOrganizations(options);
          setLoaded(true);
        },
        null,
        props
      );

      if (!auth_ok) {
        logout();
      }
    }
  }, [props]);

  return (
    <div className="org-select-container">
      <select onChange={handleChange}>
        <option value="">Select Organization</option>
        {loaded && mapOrganizations()}
      </select>
    </div>
  );
};

export default OrganizationSelect;
