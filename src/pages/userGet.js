import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import ConfirmDelete from "../confirmDelete";
import { formatPhone } from "../util/stringUtils";
import SecurityWrapper from "../components/security.js";

import asyncAPICall from '../util/apiWrapper';
import logout from '../util/logout';
import { validateUUID } from '../util/stringUtils';

export default class GetUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            buttonLabel: "",
            cannotChangeActiveState: false
        }

        this.redirectTo = this.redirectTo.bind(this)
    }

    componentDidMount() {
        let user_id = this.props.match.params.user_id
        if (!validateUUID(user_id)) {
            this.props.history.push('/notfound');
        }

        let auth_ok = asyncAPICall(`/user/get/${user_id}`, "GET", null, null,
            data => {
                let cannotChangeActiveState = (data.user_id === user_id);
                this.setState({
                    user: data,
                    cannotChangeActiveState: cannotChangeActiveState
                })
            },
            null, this.props
        );
        if (!auth_ok) { logout(this.props); }

    }

    handleActivation() {
        let endpoint = (this.state.user.active) ? "deactivate" : "activate";
        let auth_ok = asyncAPICall(`/user/${endpoint}/${this.state.user.user_id}`, "PUT", null, null,
            data => {
                this.setState({
                    user: data
                })
            },
            null, this.props
        );
        if (!auth_ok) { logout(this.props); }
    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    render() {
        let org_name = (this.state.user.organization) ? this.state.user.organization.name : "unknown"
        return (
            <div className="get-wrapper">
                <div className="get-detail-wrapper">
                    <Button className="confirm-button back-button" onClick={() => this.props.history.goBack()}><i className="fas fa-chevron-left button-icon"></i> Back</Button>
                    <div className="detail-wrapper wrapper">
                        <Paper className="form-wrapper narrow-paper" elevation={3}>
                            <div className="details">
                                <div className="top-section">
                                    <h1>{this.state.user.first_name} {this.state.user.last_name}</h1>
                                    <SecurityWrapper restrict_roles="user">
                                        <div className="switch-wrapper">
                                            Active:
                                            <label className="switch">
                                                <input type="checkbox" disabled={this.state.cannotChangeActiveState} onClick={() => this.handleActivation()} defaultChecked={this.state.user.active} />
                                                <span className="slider round" >
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
                                </div>
                                <div className="middle-section">
                                    <div className="icon-and-details">
                                        <i className="fas fa-user"></i>
                                        <div>
                                            <Link className="no-decoration" to={`/organization/${this.state.user.org_id}`}><h3>{org_name}</h3></Link>
                                            <SecurityWrapper restrict_roles="user">
                                                <p className="role">
                                                    {this.state.user.role}
                                                </p>
                                            </SecurityWrapper>
                                            <p className="email">
                                                {this.state.user.email}
                                            </p>
                                            <p className="phone">
                                                {formatPhone(this.state.user.phone)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-row">
                                        <SecurityWrapper restrict_roles="user">
                                            <Button className="confirm-button" onClick={() => this.redirectTo(`/user/edit/${this.state.user.user_id}`)}>Edit</Button>
                                            <ConfirmDelete objectType="user" id={this.state.user.user_id} redirectTo={this.redirectTo} />
                                        </SecurityWrapper>
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        )
    }
}

