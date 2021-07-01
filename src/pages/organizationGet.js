import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';

import ConfirmDelete from "../confirmDelete"
import UserList from './userList'
import Button from '@material-ui/core/Button';
import SecurityWrapper from "../util/securityWrapper";

import asyncAPICall from '../util/apiWrapper';
import logout from "../util/logout";
import Cookies from "js-cookie";
import { validateUUID } from '../util/stringUtils';

export default class GetOrganization extends Component {
    constructor(props) {
        super(props)

        this.state = {
            organization: null,
            buttonLabel: "",
            org_name: null,
            org_id: null,
            user_org_id: null
        }

        this.formatPhone = this.formatPhone.bind(this)
        this.redirectTo = this.redirectTo.bind(this)
    }


    componentDidMount() {
        let org_id = this.props.match.params.org_id
        if (!validateUUID(org_id)) {
            this.props.history.push('/notfound');
        }

        let user_org_id = Cookies.get('org_id')

        let auth_ok = asyncAPICall(`/organization/get/${org_id}`, "GET", null, null,
            data => {
                this.setState({
                    organization: data,
                    org_name: data.name,
                    org_id: org_id,
                    user_org_id: user_org_id
                })
            },
            null, this.props
        );
        if (!auth_ok) { logout(this.props); }
    }


    formatPhone(phoneNumber) {
        let cleaned = ('' + phoneNumber).replace(/\D/g, '');

        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
    }

    handleActivation() {
        let endpoint = (this.state.organization.active) ? "deactivate" : "activate";
        asyncAPICall(`/organization/${endpoint}/${this.state.organization.org_id}`, "PUT", null, null,
            data => {
                this.setState({
                    organization: data
                })
            }, null
        )

    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    render() {
        if (!this.state.organization) {
            return (<div />)
        }
        let disableButtons = (this.state.org_id === this.state.user_org_id) ? true : false
        let switchStyle = "slider round"
        if (disableButtons) {
            switchStyle = "slider round disable-switch"
        }

        let orgName = this.state.org_name
        return (
            <div className="get-wrapper">
                <div className="get-detail-wrapper">
                    <Button className="confirm-button back-button" onClick={() => this.props.history.goBack()}><i className="fas fa-chevron-left button-icon"></i> Back</Button>
                    <div className="detail-wrapper wrapper">
                        <Paper className="form-wrapper" elevation={3}>
                            <div className="details">

                                <div className="top-section">
                                    <h1>{this.state.organization.name}</h1>
                                    <SecurityWrapper roles="super-admin">
                                        <div className="switch-wrapper">
                                            Active:

                                            <label className="switch">
                                                <input type="checkbox" disabled={(disableButtons) ? true : false} onClick={() => this.handleActivation()} defaultChecked={this.state.organization.active} />
                                                <span className={switchStyle}>
                                                    <span>
                                                        On
                                                    </span>
                                                    <span>
                                                        Off
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </SecurityWrapper>
                                    <SecurityWrapper restrict_roles="super-admin">
                                        <h2>Active</h2>
                                    </SecurityWrapper>
                                </div>
                                <div className="middle-section">
                                    <div className="icon-and-details">
                                        <i className="far fa-building"></i>
                                        <div>
                                            <p className="address">
                                                {this.state.organization.address}<br />
                                                {this.state.organization.city}{this.state.organization.city && this.state.organization.state ? "," : ""} {this.state.organization.state} &nbsp;{this.state.organization.zip_code}
                                            </p>
                                            <p className="phone">
                                                {this.formatPhone(this.state.organization.phone)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-row">
                                        <SecurityWrapper restrict_roles="user">
                                            <Button className="confirm-button" onClick={() => this.redirectTo(`/organization-form/${this.state.organization.org_id}`)}>Edit</Button>
                                            <SecurityWrapper restrict_roles="admin">
                                                <ConfirmDelete disabled={(this.state.org_id === this.state.user_org_id) ? true : false} objectType="organization" id={this.state.organization.org_id} redirectTo={this.redirectTo} />
                                            </SecurityWrapper>
                                        </SecurityWrapper>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="user-list">
                                <UserList {...this.props} disableAddUser={!this.state.organization.active} showFilter="false" columns="first_name,last_name,email,phone,active" org_name={orgName} org_id={this.props.match.params.org_id} />
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        )
    }
}