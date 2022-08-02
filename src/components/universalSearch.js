import { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

import UserList from "../pages/userList";
import OrganizationList from "../pages/organizationList";
import Button from "@material-ui/core/Button";
import asyncAPICall from "../util/apiWrapper";
import useDebounce from "../hooks/useDebounce";
import Loading from "./loading";
// import logout from './util/logout';

export default function UniversalSearch(props) {
  const searchDebounce = useDebounce(props.searchTerm);
  const results = useRef(false);

  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadResults = useCallback(() => {
    const auth_token = Cookies.get("auth_token");
    if (auth_token) {
      asyncAPICall(
        `/search/${searchDebounce}`,
        "GET",
        null,
        null,
        (data) => {
          for (let result in data) {
            if (data[result].length) {
              results.current = true;
              break;
            }
          }

          setOrganizations(data.organizations);
          setUsers(data.users);
          setIsSearching(false);
        },
        (err) => console.error("loadResults Error: ", err)
      );
    }
  }, [searchDebounce]);

  const renderOrganizations = () => {
    if (organizations.length) {
      return (
        <OrganizationList
          showFilter="false"
          showAddButton="false"
          columns="name,city,state,phone,active"
          orgList={organizations}
        />
      );
    }
    return false;
  };

  const renderUsers = () => {
    if (users.length) {
      return (
        <UserList
          showFilter="false"
          showAddButton="false"
          columns="first_name,last_name,email,phone,active"
          userList={users}
        />
      );
    }
    return false;
  };

  useEffect(() => {
    if (props.searchTerm === "") setIsSearching(false);
    else setIsSearching(true);
  }, [props.searchTerm]);

  useEffect(() => {
    results.current = false;
    if (searchDebounce) {
      loadResults(searchDebounce);
    } else {
      setOrganizations([]);
      setUsers([]);
      setIsSearching(false);
    }
  }, [searchDebounce, loadResults]);

  return (
    <div className="search-data-wrapper">
      <Button
        className="confirm-button back-button search-title"
        onClick={() => props.history.goBack()}
      >
        <i className="fas fa-chevron-left button-icon"></i> Back
      </Button>
      <h1 className="search-title">Search Results</h1>

      {isSearching ? (
        <Loading
          content="Searching...."
          styles={{
            height: "50%",
            width: "80%",
            backgroundColor: "white",
          }}
        />
      ) : results.current ? (
        <>
          <div className="organizations">{renderOrganizations()}</div>
          <div className="users">{renderUsers()}</div>
        </>
      ) : (
        <h4 className="no-results">There are no records to display</h4>
      )}
      <div className="vertical-spacing">
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
