import { useState, useContext } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Logo from "../../static/images/logo.svg";
import SecurityWrapper from "../auth/SecurityWrapper";
import ProfileMenu from "../navigation/ProfileMenu";
import { MeContext } from "../navigation/DefaultContainer";

export default function Header(props) {
  // refactoring route props
  const me = useContext(MeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();

  const redirectTo = (path) => {
    history.push(path);
    // props.history.push(path)
  };

  const getSearchResults = (e) => {
    e.preventDefault();

    redirectTo(`/universal-search/${props.searchTerm}`);
  };

  return (
    <div className="navbar-container">
      <div className="left-column">
        <Link className="logo-wrapper nav-item" to="/home">
          <img src={Logo} alt="Logo" height="18px" />
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
        <form onSubmit={getSearchResults}>
          <input
            type="search"
            value={props.searchTerm}
            onChange={(e) => props.setSearchTerm(e.target.value)}
            // onRequestSearch={getSearchResults}
            style={{ height: "30px", lineHeight: "normal" }}
          />
        </form>

        <div onClick={() => setMenuOpen(!menuOpen)} className="users_name">
          {me.first_name}&nbsp;&nbsp;
          <FontAwesomeIcon
            icon={`fas fa-chevron-${menuOpen ? "up" : "down"}`}
          />
        </div>

        {menuOpen ? (
          <ProfileMenu
            {...props}
            userFullName={me.first_name + " " + me.last_name}
            orgName={me.organization?.name}
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
