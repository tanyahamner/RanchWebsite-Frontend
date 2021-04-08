import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Cookies from "js-cookie";
// import TextMaskCustom from "./components/maskedInput";
import Button from '@material-ui/core/Button';

import asyncAPICall from './util/apiWrapper';
import logout from './util/logout';

export default class ProfileEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            formData: {},
            user_id: '',
            org_id: '',
            org_name: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phone: '',
            role: '',
            active: 1,
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        let user_id = this.props.match.params.user_id
        // let user_id = Cookies.get('user_id')

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
                            active: data.active
                        })
                    }
                },
                null, this.props
            );
            if (!auth_ok) { logout(this.props); }
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        let auth_token = Cookies.get('auth_token');
        if (auth_token == null) {
            logout(this.props);
        }
        event.preventDefault();

        let form_body = new FormData(event.target)

        fetch(`http://127.0.0.1:5000/user/update`, {
            method: "POST",
            headers: { "content-type": "application/json", "auth_token": auth_token },
            body: JSON.stringify(Object.fromEntries(form_body))
        })
            .then(response => response.json())
            .then(data => {
                this.props.history.push(`/user/${this.state.user_id}`);
            })
            .catch(error => console.log(error));
    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    render() {
        let org_id = Cookies.get("org_id");
        return (
            <div className="wrapper">
                <div className="form-field-wrapper">
                    <Paper className="form-wrapper" elevation={3}>
                        <h2>Edit My Profile</h2>
                        <form className="form" onSubmit={this.handleSubmit} method="POST">
                            <input type="hidden" name="org_id" value={org_id} />
                            <input type="hidden" name="role" value={this.state.role} />
                            <label htmlFor="first_name">First Name *</label>
                            <TextField required id="first_name" name="first_name" type="text" value={this.state.first_name} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="last_name">Last Name *</label>
                            <TextField required id="last_name" name="last_name" type="text" value={this.state.last_name} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="email">Email *</label>
                            <TextField required id="email" name="email" type="email" value={this.state.email} onChange={this.handleChange} variant='outlined' size='small' autoComplete="email" />
                            <label htmlFor="phone">Phone</label>
                            <TextField id="phone" name="phone" type="phone" value={this.state.phone} onChange={this.handleChange} inputProps={{minLength: 10}} variant='outlined' size='small' phone={this.state.phone} />
                            <Button className="cancel-button" type="button" onClick={() => this.props.history.goBack()}>Cancel</Button>
                            <Button className="confirm-button" type="submit">Edit My Profile</Button>
                            {(this.state.user_id) ? <input type="hidden" name="user_id" value={this.state.user_id} /> : ""}
                        </form>
                    </Paper>
                </div>
            </div>
        )
    }
}