import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Cookies from "js-cookie";

const userRoles = [
  {
    name: "Super Admin",
    value: "super-admin",
  },
  {
    name: "Admin",
    value: "admin",
  },
  {
    name: "User",
    value: "user",
  },
];

const userRolesAllowedByRole = {
  "super-admin": ["super-admin", "admin", "user"],
  admin: ["admin", "user"],
};

const UserRoleSelect = (props) => {
  const [role, setRole] = useState(props.role);
  const [roleName, setRoleName] = useState("Select Role");
  const [allowedUserRoles, setAllowedUserRoles] = useState([]);

  useEffect(() => {
    const loggedInUsersRole = Cookies.get("user_role");

    if (typeof userRolesAllowedByRole[loggedInUsersRole] === "undefined") {
      // No allowed roles by user role
    } else {
      const roleNamesAllowed = userRolesAllowedByRole[loggedInUsersRole];
      const allowRoles = [];

      userRoles.forEach((role) => {
        if (roleNamesAllowed.includes(role.value)) {
          allowRoles.push({
            name: role.name,
            value: role.value,
          });
        }
      });

      setAllowedUserRoles(allowRoles);
    }
  }, []);

  const handleChange = (e, value) => {
    if (value) {
      setRole(value.value);
      setRoleName(value.name);
    }
  };

  return (
    <div>
      <Autocomplete
        id="role"
        name="role"
        options={allowedUserRoles}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option) => {
          if (option.value) {
            return option.value === role;
          }
          return false;
        }}
        style={{ width: 200 }}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} label="" variant="outlined" />
        )}
        size="small"
        disableClearable
        value={{ name: roleName, value: role }}
      />
      <input type="hidden" name="role" value={role} />
    </div>
  );
};

export default UserRoleSelect;
