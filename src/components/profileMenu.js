import React, { Component } from 'react';


export default class ProfileMenu extends Component {
    constructor(props) {
        super(props)


        this.state = {
        }

        this.handleLinkClick = this.handleLinkClick.bind(this)
    }

    componentDidMount() {
        let menuOpen = this.props.parent.state.menuOpen
        if (menuOpen) {
            document.getElementById('dropdown-menu-wrapper').focus();
        }
    }

    handleLinkClick(link) {
        this.props.handleMenuOpenClose()
        this.props.history.push(link)
    }

    render() {
        return (
            <div onBlur={() => this.props.handleMenuOpenClose("FromBlur")} id="dropdown-menu-wrapper" className="dropdown-menu-wrapper" tabIndex="0">
                <h3>{this.props.userFullName}</h3>
                <div onClick={() => this.handleLinkClick(`/organization/${this.props.orgId}`)} className="org">{this.props.orgName}</div>
                <div onClick={() => this.handleLinkClick(`/profile/edit/${this.props.userID}`)} className="link">My Profile</div>
                <div onClick={() => this.handleLinkClick(`/organization/${this.props.orgId}`)} className="link">My Account</div>
                <hr></hr>
                <div onClick={() => this.handleLinkClick(`/login`)} className="link">Sign Out</div>
            </div>
        );
    }
}