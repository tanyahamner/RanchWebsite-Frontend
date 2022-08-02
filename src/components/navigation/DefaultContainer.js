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

  useEffect(() => {
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
      null
    );
  }, [isLoading]);

  useEffect(() => {
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
              // authToken={props.authToken}
              // setAuthToken={props.setAuthToken}
            />
          )}
        />

        <div className="body-container">
          <Route path="/home" component={Home} />

          <Route path="/users" component={UserListPage} />
          <Route path="/user-add/" component={UserForm} />
          <Route path="/user/:user_id" component={User} />
          <Route path="/user/edit/:user_id" component={UserForm} />
          <Route path="/user-add/:org_id/:org_name" component={UserForm} />

          <Route path="/organizations" component={OrganizationListPage} />
          <Route path="/organization/:org_id" component={Organization} />
          <Route exact path="/organization-form" component={OrganizationForm} />
          <Route
            path="/organization-form/:org_id"
            component={OrganizationForm}
          />

          <Route path="/profile/edit/:user_id" component={ProfileEditPage} />

          <Route
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
