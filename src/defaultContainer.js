import React, { useState, useEffect, createContext } from "react";
import { Route } from "react-router-dom";
import Cookies from "js-cookie";

import Header from "./header";
import Home from "./home";
import Organization from "./pages/organizationGet";
import User from "./pages/userGet";
import OrganizationListPage from "./pages/organizationListPage";
import OrganizationForm from "./pages/organizationForm";
import UserListPage from "./pages/userListPage";
import UserForm from "./pages/userForm";
import Loading from "./components/loading";
import ProfileEdit from "./pages/profileEditPage";
import UniversalSearch from "./components/universalSearch";

import logout from "./util/logout";
import awaitAPICall from "./util/apiWrapper";
import useAbortEffect from "./hooks/useAbortEffect";
import useDeepEffect from "./hooks/useDeepEffect";

export const MeContext = createContext();

const DefaultContainer = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [me, setMe] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let auth_token_from_cookie = Cookies.get("auth_token");
    let expiration = Cookies.get("auth_expires");
    let is_expired = Date.parse(expiration) < Date.now();
    // console.log('UseEffect in default Container', auth_token_from_cookie, is_expired)
    if (!auth_token_from_cookie || is_expired) {
      logout(props);
    }
  });

  useAbortEffect(
    (signal) => {
      awaitAPICall(
        "/user/get/me",
        "GET",
        null,
        null,
        (data) => {
          if (data) {
            setMe(data);
          }
        },
        (err) => console.error("Error in Get Me Effect: ", err),
        signal
      );
    },
    [isLoading]
  );

  useDeepEffect(() => {
    if (me?.user_id) {
      setIsLoading(false);
    }
  }, [me]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <MeContext.Provider value={me}>
        <Route
          path="/"
          render={(props) => (
            <Header
              {...props}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
        />
        <div className="body-wrapper">
          <Route path="/home" component={Home}></Route>
          <Route exact path="/user/:user_id" component={User} />
          <Route path="/users" component={UserListPage} />
          <Route
            name="user-edit"
            path="/user/edit/:user_id"
            component={UserForm}
          />
          <Route
            name="user-add"
            exact
            path="/user-add/:org_id/:org_name"
            component={UserForm}
          />
          <Route name="user-add" exact path="/user-add/" component={UserForm} />

          <Route path="/organizations" component={OrganizationListPage} />
          <Route
            name="organization-detail"
            path="/organization/:org_id"
            component={Organization}
          />
          <Route
            name="organization-form"
            path="/organization-form/:org_id"
            component={OrganizationForm}
          />
          <Route
            name="organization-add"
            exact
            path="/organization-form/"
            component={OrganizationForm}
          />

          <Route
            name="profile-edit"
            path="/profile/edit/:user_id"
            component={ProfileEdit}
          />

          <Route
            name="universal-search"
            path="/universal-search"
            render={(props) => {
              return (
                <UniversalSearch
                  {...props}
                  searchTerm={searchTerm}
                  authToken={props.authToken}
                />
              );
            }}
          />
        </div>
      </MeContext.Provider>
    </div>
  );
};

export default DefaultContainer;
