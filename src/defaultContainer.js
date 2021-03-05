import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import Header from "./header"
import Home from "./home"
import Organization from "./organizationGet"
import User from "./userGet"
import OrganizationListPage from "./pages/organizationListPage"
import OrganizationForm from "./organizationForm"
import UserListPage from "./pages/userListPage"
import UserForm from "./userForm"

import ProfileEdit from "./profilePageEdit"

import UniversalSearch from "./universalSearch"

import Cookies from 'js-cookie';
import logout from "./util/logout";

const DefaultContainer = (props) => {
  const [searchTerm, setSearchTerm] = useState(null);

  useEffect(() => {
    let auth_token_from_cookie = Cookies.get('auth_token');
    let expiration = Cookies.get('auth_expires');
    let is_expired = Date.parse(expiration) < Date.now()
    // console.log('UseEffect in default Container', auth_token_from_cookie, is_expired)
    if (!auth_token_from_cookie || is_expired) {
      logout(props)
    }
  })

  return (
    <div className="container">
      <Route path="/" render={(iprops) => <Header {...iprops} searchTerm={searchTerm} setSearchTerm={setSearchTerm} authToken={props.authToken} setAuthToken={props.setAuthToken} />} />
      <div className="body-wrapper">
        <Route path="/home" component={Home}></Route>
        <Route exact path="/user/:user_id" component={User} />
        <Route path="/users" component={UserListPage} />
        <Route name="user-edit" path="/user/edit/:user_id" component={UserForm} />
        <Route name="user-add" exact path="/user-add/:org_id/:org_name" component={UserForm} />
        <Route name="user-add" exact path="/user-add/" component={UserForm} />

        <Route path="/organizations" component={OrganizationListPage} />
        <Route name="organization-detail" path="/organization/:org_id" component={Organization} />
        <Route name="organization-form" path="/organization-form/:org_id" component={OrganizationForm} />
        <Route name="organization-add" exact path="/organization-form/" component={OrganizationForm} />

        <Route name="profile-edit" path="/profile/edit/:user_id" component={ProfileEdit} />

        <Route name="universal-search" path="/universal-search" render={(props) => {
          return (<UniversalSearch {...props} searchTerm={searchTerm} authToken={props.authToken} />);
        }} />
      </div>
    </div>
  )
}

export default DefaultContainer;