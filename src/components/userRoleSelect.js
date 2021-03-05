import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Cookies from 'js-cookie';

const userRoles = [
   {
      "name": "Super Admin",
      "value": "super-admin"
   },
   {
      "name": "Admin",
      "value": "admin"
   },
   {
      "name": "User",
      "value": "user"
   }
]

const userRolesAllowedByRole = {
   "super-admin": ["super-admin", "admin", "user"],
   "admin": ["admin", "user"]
}

export default class UserRoleSelect extends Component {
   constructor(props) {
      super()
      
      let loggedInUsersRole = Cookies.get('user_role');
      this.allowedUserRoles = []
      if (typeof userRolesAllowedByRole[loggedInUsersRole] === 'undefined') {
         // No allowed roles by user role
      } else {
         let roleNamesAllowed = userRolesAllowedByRole[loggedInUsersRole]
         userRoles.forEach((role) => {
            if (roleNamesAllowed.includes(role.value)) {
               this.allowedUserRoles.push({
                  "name": role.name,
                  "value": role.value
               })
            }
         })

      }

      let roleName = ''
      userRoles.forEach((role) => {
         if (role.value === props.role) {
            roleName = role.name
         }
      })
      this.state = {
         role: props.role,
         roleName: roleName
      }

      userRoles.forEach((role) => {

      })

      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event, value) {
      // console.log(value);
      if (value) {
         this.setState({
            roleName: value.name,
            role: value.value
         })
      }
   }

   render() {
      return (
         <div>
            <Autocomplete
               id="role"
               name="role"
               options={this.allowedUserRoles}
               getOptionLabel={(option) => option.name}
               getOptionSelected={(option) => {
                  // console.log("getOptionSelect: ", userRoles)
                  if (option) {
                     return option.value === this.state.role
                  }
                  return false;
               }}
               style={{ width: 200 }}
               onChange={this.handleChange}
               renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
               size="small"
               disableClearable
               value={{ "name": this.state.roleName, "value": this.state.role }}
            />
            <input type="hidden" name="role" value={this.state.role} />
         </div>
      )
   }
}
