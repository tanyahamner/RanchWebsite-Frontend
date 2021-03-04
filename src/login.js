import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Cookies from "js-cookie";
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';

import Logo from "./img/logo.svg";
import logout from './util/logout';
import { awaitAPICall } from './util/asyncAPICall';

export default class LoginPage extends Component {
    constructor(props) {
        super(props)

        let from = props.from;
        if (from == null) {
            from = "/home"
        }

        this.state = {
            error_msg: "",
            from: from
        }
        logout();
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault();

        let form_body = new FormData(event.target)

        awaitAPICall("/user/auth", "POST", Object.fromEntries(form_body),
            response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    let error_msg = "Invalid Email/Password"
                    this.setState({
                        error_msg: error_msg
                    })
                    return null;
                } else if (response.status === 403) {
                    let error_msg = "Your account has been deactivated. Please contact your administrator."
                    this.setState({
                        error_msg: error_msg
                    })
                    return null;
                }

            },
            data => {
                if (data) {
                    let auth_token = data.auth_token
                    let user_role = data.user.role
                    let user_name = data.user.first_name
                    let org_id_cookie = data.user.org_id
                    Cookies.set("auth_token", auth_token)
                    Cookies.set("user_role", user_role)
                    Cookies.set("user_name", user_name)
                    Cookies.set("org_id", org_id_cookie)
                    Cookies.set("auth_expires", data.expiration)
                    this.props.setAuthToken(auth_token)
                    this.props.history.push(this.state.from)
                }
            },
            null, false
        );
    }

    render() {
        return (
            <div className="wrapper">
                <div className="login-wrapper">
                    <img src={Logo} alt="" height="32px"></img>
                    <Paper className="form-wrapper" elevation={3}>
                        <h2>Please log in</h2>
                        <div className="error-message">{this.state.error_msg}</div>
                        <form className="form" onSubmit={this.handleSubmit} method="POST">
                            <label htmlFor="email">Email</label>
                            <TextField id="email" name="email" type="email" variant='outlined' size='small' autoComplete='email' width='10px' />
                            <label htmlFor="password">Password</label>
                            <TextField id="password" name="password" type="password" variant='outlined' size='small' autoComplete='current-password' />
                            <div />
                            <Link className="no-decoration" to="/login/password/recovery">Forgot Password?</Link>
                            <div />
                            <Button className="confirm-button login-button" type="submit">Login</Button>
                        </form>
                    </Paper>
                </div>
            </div>
        )
    }
}