import React, { useEffect, useState } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import SearchBar from "material-ui-search-bar";

import { awaitAPICall } from "./util/apiWrapper";
import Logo from "./img/logo.svg";
import SecurityWrapper from "./util/securityWrapper";
import ProfileMenu from "./components/profileMenu";

export default function Header(props) {
  const [userName, setUserName] = useState("");
  const [orgIdCookie, setOrgIdCookie] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [userID, setUserID] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const history = useHistory();
  let justClosed = false;
  let timer = null;

  useEffect(() => {
    let auth_token_from_cookie = Cookies.get("auth_token");
    if (auth_token_from_cookie) {
      props.setAuthToken(auth_token_from_cookie);
    } else {
      props.setAuthToken(null);
    }

    awaitAPICall(
      "/user/get/me",
      "GET",
      null,
      null,
      (data) => {
        if (data) {
          setUserFullName(data.first_name + " " + data.last_name);
          setOrgName(data.organization.name);
          setUserID(data.user_id);
          setUserName(data.first_name);
          setOrgIdCookie(data.org_id);
        }
      },
      null
    );
  }, [props]);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const redirectTo = (path) => {
    history.push(path);
  };

  const getSearchResults = () => {
    redirectTo(`/universal-search/${props.searchTerm}`);
  };

  const handleMenuOpenClose = (fromWhere) => {
    if (!justClosed) {
      setMenuOpen(!menuOpen);
    }

    if (fromWhere === "FromBlur") {
      justClosed = true;
      timer = setTimeout(() => {
        justClosed = false;
      }, 500);
    }
  };

  const handleMenuClick = () => {
    if (!menuOpen) {
      handleMenuOpenClose("MenuClick");
    }
  };

  return (
    <div className="navbar-wrapper">
      <div className="left-column">
        <Link className="logo-wrapper nav-item" to="/home">
          <img src={Logo} alt="" height="18px"></img>
        </Link>
        <SecurityWrapper roles="super-admin">
          <NavLink exact to="/organizations">
            <div className="page-link nav-item">Organizations</div>
          </NavLink>
        </SecurityWrapper>
        <NavLink exact to="/users">
          <div className="page-link nav-item">Users</div>
        </NavLink>
      </div>
      {/* <Link to ="/organization">Organization</Link> */}
      {/* <NavLink exact to="/organization"><div className="page-link">Org Detail</div></NavLink> */}
      <div className="right-column">
        <SearchBar
          value={props.searchTerm}
          onChange={(newValue) => props.setSearchTerm(newValue)}
          onRequestSearch={getSearchResults}
          style={{ height: "30px", lineHeight: "normal" }}
        />

        <div onClick={handleMenuClick} className="users_name">
          {userName}&nbsp;&nbsp;
          <i className={`fas fa-chevron-${menuOpen ? "up" : "down"}`}></i>
        </div>
        {menuOpen ? (
          <ProfileMenu
            {...props}
            userFullName={userFullName}
            orgName={orgName}
            orgId={orgIdCookie}
            userID={userID}
            handleMenuOpenClose={handleMenuOpenClose}
            menuOpen={menuOpen}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
