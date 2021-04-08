import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Cookies from "js-cookie";
import OrganizationSelect from "../components/organizationSelect";
import UserRoleSelect from "../components/userRoleSelect";
// import TextMaskCustom from "./components/maskedInput";
import Button from '@material-ui/core/Button';
import SecurityWrapper from "../components/security";

import asyncAPICall from '../util/apiWrapper';
import logout from '../util/logout';

export default class UserForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            formData: {},
            user_id: '',
            org_id: null,
            org_name: null,
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phone: '',
            role: null,
            active: 1,
            editing: false,
            newUser: false,
            error_msg: null
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        // console.log("component UserForm did mount")
        let user_id = this.props.match.params.user_id;
        let org_id = this.props.match.params.org_id
        let org_name = this.props.match.params.org_name
        // console.log("user_id: ", user_id)
        // console.log("org_id: ", org_id)
        // console.log("org_name: ", org_name)

        if (user_id) {
            let auth_ok = asyncAPICall(`/user/get/${user_id}`, "GET", null, null,
                data => {
                    if (!data.user_id) {
                        console.log("ERROR: user not found")
                    }
                    else {
                        this.setState({
                            user_id: data.user_id,
                            org_id: data.org_id,
                            org_name: data.organization.name,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
                            password: data.password,
                            phone: data.phone,
                            role: data.role,
                            active: data.active,
                            editing: true,
                            error_msg: false
                        })
                    }
                },
                null, this.props
            );
            if (!auth_ok) { logout(this.props); }
        } else {
            // This is a new user. If the logged in user is an 'admin', then we need to display the
            // logged in user's organization name and set the hidden value of org_id to the org_id
            // of the logged in user
            this.setState({
                newUser: true,
                org_id: org_id,
                org_name: org_name,
                role: 'user'
            })
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        let fetch_url = 'add'
        if (this.state.editing) {
            fetch_url = 'update'
        }

        let form_body = new FormData(event.target)
        let body = Object.fromEntries(form_body)

        let auth_ok = asyncAPICall(`/user/${fetch_url}`, "POST", body,
            response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 403) {
                    let error_msg = "Cannot add a User to this Organization. The Organization is disabled."
                    this.setState({
                        error_msg: error_msg
                    })
                    return null;
                }
            },
            data => {
                if (!this.state.error_msg) {
                    this.props.history.push(`/users`);
                }
            },
            null, this.props
        );

        if (!auth_ok) { logout(this.props); }

    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    render() {
        if (!this.state.org_id && !this.state.newUser) {
            return (
                <div />
            )
        }
        let title = (this.state.editing) ? "Edit User" : "Add User";
        let org_id = Cookies.get("org_id");
        return (

            <div className="wrapper">
                <div className="form-field-wrapper">
                    <Paper className="form-wrapper" elevation={3}>
                        <h2>{title}</h2>
                        <div className="error-message">{this.state.error_msg}</div>
                        <form className="form" onSubmit={this.handleSubmit} method="POST">
                            <SecurityWrapper roles="super-admin" >
                                <label htmlFor="org_name" className="drop-down-label">Organization</label>
                                <OrganizationSelect {...this.props} parent={this} org_id={this.state.org_id} org_name={this.state.org_name} />
                                <input type="hidden" name="org_id" value={this.state.org_id} />
                            </SecurityWrapper>
                            <SecurityWrapper restrict_roles="super-admin">
                                {(this.state.editing) ? <label htmlFor="org_name" className="drop-down-label">Organization</label> : ""}
                                {(this.state.editing) ? <h3>{this.state.org_name}</h3> : ""}
                                <input type="hidden" name="org_id" value={org_id} />
                            </SecurityWrapper>
                            <label htmlFor="role" className="drop-down-label">Role</label>
                            <UserRoleSelect role={this.state.role} />
                            <label htmlFor="first_name">First Name *</label>
                            <TextField required id="first_name" name="first_name" type="text" value={this.state.first_name} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="last_name">Last Name *</label>
                            <TextField required id="last_name" name="last_name" type="text" value={this.state.last_name} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="email">Email *</label>
                            <TextField required id="email" name="email" type="email" value={this.state.email} onChange={this.handleChange} variant='outlined' size='small' autoComplete="email" />
                            {(this.state.newUser) ? <label htmlFor="password">Password *</label> : null}
                            {(this.state.newUser) ? <TextField required id="password" name="password" type="password" value={this.state.password} onChange={this.handleChange} variant='outlined' size='small' autoComplete="current-password" /> : null}
                            <label htmlFor="phone">Phone</label>
                            {/* <TextMaskCustom id="phone" name="phone" type="phone" value={this.state.phone} onChange={this.handleChange} variant='outlined' size='small' phone={this.state.phone} /> */}
                            <TextField id="phone" name="phone" type="phone" value={this.state.phone} onChange={this.handleChange} inputProps={{ minLength: 10 }} variant='outlined' size='small' phone={this.state.phone} />
                            <Button className="cancel-button" type="button" onClick={() => this.props.history.goBack()}>Cancel</Button>
                            <Button className="confirm-button" type="submit">{title}</Button>
                            {(this.state.user_id) ? <input type="hidden" name="user_id" value={this.state.user_id} /> : ""}

                        </form>
                    </Paper>
                </div>
            </div>
        )
    }
}