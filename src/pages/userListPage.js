import React from "react";
import UserList from './userList';
import Cookies from "js-cookie";
import SecurityWrapper from "../util/securityWrapper";
import logout from '../util/logout';

export default function UserListPage(props) {

   const authToken = Cookies.get('auth_token');
   if (!authToken) {
      //props.history.push('/login');
      logout(props);
   }

   return (
      <div className="list-wrapper" >
         <SecurityWrapper roles="super-admin,admin">
            <UserList {...props} authToken={authToken} />
         </SecurityWrapper>
         <SecurityWrapper roles="user">
            <UserList {...props} authToken={authToken} columns="first_name,last_name,email,phone,active" />
         </SecurityWrapper>
      </div>
   )
}
