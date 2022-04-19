import React, { useState, useContext } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";

import Logo from "./img/logo.svg";
import SecurityWrapper from "./util/securityWrapper";
import ProfileMenu from "./components/profileMenu";
import { MeContext } from "./defaultContainer";

export default function Header(props) {
  const me = useContext(MeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();

  const redirectTo = (path) => {
    history.push(path);
  };

  const getSearchResults = () => {
    redirectTo(`/universal-search/${props.searchTerm}`);
  };

  return (
    <div className="navbar-wrapper">
      <div className="left-column">
        <Link className="logo-wrapper nav-item" to="/home">
          <img src={Logo} alt="" height="18px"></img>
        </Link>

        <SecurityWrapper roles="super-admin">
          <NavLink to="/organizations">
            <div className="page-link nav-item">Organizations</div>
          </NavLink>
        </SecurityWrapper>

        <NavLink to="/users">
          <div className="page-link nav-item">Users</div>
        </NavLink>
      </div>

      {/* <Link to ="/organization">Organization</Link> */}
      {/* <NavLink to ="/organization"><div className="page-link">Org Detail</div></NavLink> */}

      <div className="right-column">
        {/* TODO Look into Search bar */}
        <input
          type="search"
          value={props.searchTerm}
          onChange={(newValue) => props.setSearchTerm(newValue)}
          onRequestSearch={getSearchResults}
          style={{ height: "30px", lineHeight: "normal" }}
        />

        <div onClick={() => setMenuOpen(!menuOpen)} className="users_name">
          {me.first_name}&nbsp;&nbsp;
          <i className={`fas fa-chevron-${menuOpen ? "up" : "down"}`}></i>
        </div>

        {menuOpen ? (
          <ProfileMenu
            {...props}
            userFullName={me.first_name + " " + me.last_name}
            // orgName={me.organization.name}
            orgId={me.org_id}
            userID={me.user_id}
            setMenuOpen={setMenuOpen}
            menuOpen={menuOpen}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
