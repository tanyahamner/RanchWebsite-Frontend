import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const userRolesAllowedByRole = {
  "super-admin": {
    roles: ["super-admin", "admin", "user"],
    name: "Super Admin",
    value: "super-admin",
  },
  admin: {
    roles: ["admin", "user"],
    name: "Admin",
    value: "admin",
  },
  user: {
    roles: ["user"],
    name: "User",
    value: "user",
  },
};

const UserRoleSelect = (props) => {
  const [role, setRole] = useState(props.role);
  // const [roleName, setRoleName] = useState("Select Role");
  const [allowedUserRoles, setAllowedUserRoles] = useState([]);

  useEffect(() => {
    const loggedInUsersRole = Cookies.get("user_role");

    if (typeof userRolesAllowedByRole[loggedInUsersRole] === "undefined") {
      // No allowed roles by user role
      return;
    } else {
      const loggedInUserObj = userRolesAllowedByRole[loggedInUsersRole];
      const roleNamesAllowed = [...loggedInUserObj.roles];
      // const userRoleList = userRolesAllowedByRole.userRoles;
      const allowRoles = [];

      roleNamesAllowed.forEach((role) => {
        if (userRolesAllowedByRole[role].value === role) {
          allowRoles.push({
            name: userRolesAllowedByRole[role].name,
            value: userRolesAllowedByRole[role].value,
          });
        }
      });

      // debugger;

      setAllowedUserRoles([...allowRoles]);
    }
  }, []);

  const handleChange = (e) => {
    console.log(e.target.options);
    const selectedRole = e.target.options[e.target.options.selectedIndex].value;
    console.log(selectedRole);

    // if (e.target.value === "Select Role") {
    //   setRoleName(e.target.value);
    // } else {
    //   setRole(e.target.value);
    //   // setRoleName(selectedUserRole.name);
    // }
  };

  return (
    <div>
      <select onChange={handleChange}>
        <option value="Select Role">Select Role</option>

        {allowedUserRoles.map((role) => {
          return (
            <option key={role.name} value={role.value}>
              {role.name}
            </option>
          );
        })}
      </select>
      <input type="hidden" name="role" value={role} />
    </div>
  );
};

export default UserRoleSelect;
