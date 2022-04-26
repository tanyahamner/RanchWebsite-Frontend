import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const userRolesAllowedByRole = {
  "super-admin": {
    roles: ["super-admin", "admin", "user"],
  },
  admin: {
    roles: ["admin", "user"],
  },
  user: {
    roles: ["user"],
  },
  userRoles: [
    {
      name: "Select Role",
      value: "",
    },
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
  ],
};

const UserRoleSelect = (props) => {
  const [role, setRole] = useState(props.role);
  const [roleName, setRoleName] = useState("Select Role");
  const [allowedUserRoles, setAllowedUserRoles] = useState([]);

  useEffect(() => {
    const loggedInUsersRole = Cookies.get("user_role");

    if (typeof userRolesAllowedByRole[loggedInUsersRole] === "undefined") {
      // No allowed roles by user role
      return;
    } else {
      const loggedInUserObj = userRolesAllowedByRole[loggedInUsersRole];
      const roleNamesAllowed = [...loggedInUserObj.roles];
      const userRoleList = userRolesAllowedByRole.userRoles;
      const allowRoles = [];

      return userRoleList.map((role) => {
        if (roleNamesAllowed.includes(role.value)) {
          allowRoles.push({
            name: role.name,
            value: role.value,
          });
        }
        setAllowedUserRoles([...allowRoles]);
      });
    }
  }, []);

  const handleChange = (e) => {
    const optionIdx = e.target.options.selectedIndex;
    const selectedUserRole = allowedUserRoles[optionIdx - 1];

    if (e.target.value === "Select Role") {
      setRoleName(e.target.value);
    } else {
      setRole(e.target.value);
      setRoleName(selectedUserRole.name);
    }
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
