import { useState, useEffect, createContext } from "react";
import { Route } from "react-router-dom";
import Cookies from "js-cookie";

import Home from "../pages/Home";
import Header from "../pages/Header";
import Organization from "../pages/organization/OrganizationGet";
import User from "../pages/user/UserGet";
import OrganizationListPage from "../pages/organization/OrganizationListPage";
import OrganizationForm from "../pages/organization/OrganizationForm";
import UserListPage from "../pages/user/UserListPage";
import UserForm from "../pages/user/UserForm";
import Loading from "../../util/Loading";
import ProfileEditPage from "../pages/ProfileEditPage";
import UniversalSearch from "../pages/UniversalSearch";

import logout from "../../util/logout";
import awaitAPICall from "../../util/apiWrapper";
import useAbortEffect from "../../hooks/useAbortEffect";
import useDeepEffect from "../../hooks/useDeepEffect";

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
        <div className="body-container">
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
            component={ProfileEditPage}
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
