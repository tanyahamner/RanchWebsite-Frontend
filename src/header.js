import React, { Component } from "react";
import { NavLink, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import SearchBar from "material-ui-search-bar";

import { awaitAPICall } from './util/asyncAPICall';

// import LoginLogoutButton from './components/loginLogoutButton';
import Logo from "./img/logo.svg";
import SecurityWrapper from "./components/security";
import ProfileMenu from "./profileMenu"


export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            orgIdCookie: "",
            searchTerm: "",
            userFullName: "",
            orgName: "",
            userID: "",
            menuOpen: false
        }

        this.justClosed = false;
        this.timer = null;

        this.getSearchResults = this.getSearchResults.bind(this)
        this.handleMenuOpenClose = this.handleMenuOpenClose.bind(this)
        this.handleMenuClick = this.handleMenuClick.bind(this)
    }

    componentDidMount() {
        let auth_token_from_cookie = Cookies.get('auth_token');
        if (auth_token_from_cookie) {
            this.props.setAuthToken(auth_token_from_cookie)
        } else {
            this.props.setAuthToken(null)
        }


        awaitAPICall("/user/get/me", "GET", null,
            null,
            data => {
                if (data) {
                    let userFullName = data.first_name + " " + data.last_name
                    let orgName = data.organization.name
                    let userID = data.user_id
                    let userName = data.first_name
                    let orgIdCookie = data.org_id

                    this.setState({
                        userName: userName,
                        orgIdCookie: orgIdCookie,
                        userFullName: userFullName,
                        orgName: orgName,
                        userID: userID
                    })
                }
            },
            null
        );


    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    getSearchResults() {
        this.props.setSearchTerm(this.props.searchTerm);
        this.redirectTo(`/universal-search/${this.props.searchTerm}`);
    }

    handleMenuOpenClose(fromWhere) {
        if (!this.justClosed) {
            this.setState({
                menuOpen: !this.state.menuOpen
            })
        }
        if (fromWhere === 'FromBlur') {
            this.justClosed = true;
            this.timer = setTimeout(
                () => {
                    this.justClosed = false;
                }
                , 500)
        }


    }

    handleMenuClick() {
        if (!this.state.menuOpen) {
            this.handleMenuOpenClose("MenuClick");
        }
    }

    render() {
        return (
            <div className="navbar-wrapper">
                <div className="left-column">
                    <Link className="logo-wrapper nav-item" to="/home"><img src={Logo} alt="" height="18px"></img></Link>
                    <SecurityWrapper roles="super-admin" >
                        <NavLink exact to="/organizations"><div className="page-link nav-item">Organizations</div></NavLink>
                    </SecurityWrapper>
                    <NavLink exact to="/users"><div className="page-link nav-item">Users</div></NavLink>
                    <NavLink exact to="/displays"><div className="page-link nav-item">Displays</div></NavLink>
                    <NavLink exact to="/dashboards"><div className="page-link nav-item">Dashboards</div></NavLink>
                </div>
                {/* <Link to ="/organization">Organization</Link> */}
                {/* <NavLink exact to="/organization"><div className="page-link">Org Detail</div></NavLink> */}
                <div className="right-column">
                    <SearchBar
                        value={this.state.searchTerm}
                        onChange={(newValue) => this.props.setSearchTerm(newValue)}
                        onRequestSearch={this.getSearchResults}
                        style={{ height: "30px", lineHeight: "normal" }}
                    />
                    {/* <div className="dropdown-menu"> */}
                    <div onClick={this.handleMenuClick} className="users_name">{this.state.userName}&nbsp;&nbsp;<i className={`fas fa-chevron-${(this.state.menuOpen) ? 'up' : 'down'}`}></i></div>
                    {this.state.menuOpen ? <ProfileMenu {...this.props} userFullName={this.state.userFullName} orgName={this.state.orgName} orgId={this.state.orgIdCookie} userID={this.state.userID} handleMenuOpenClose={this.handleMenuOpenClose} parent={this} /> : ""}
                    {/* </div> */}
                    {/* <LoginLogoutButton authToken={this.props.authToken} setAuthToken={this.props.setAuthToken} history={this.props.history} /> */}
                </div>
            </div>
        )
    }
}