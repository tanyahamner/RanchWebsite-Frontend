import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Logo from "../img/logo.svg";


export default class TempPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tempPassword: "dhalkfheluhalkjhdkjlfhiue",
            username: "Tim"
        }
    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <div className="fp-page-wrapper">
                <div className="forgot-password-wrapper">
                    <div className="logo">
                        <img src={Logo} alt="" height="32px"></img>
                    </div>
                    <Paper className="recovery-paper" elevation={3}>
                        <h2>Password Reset</h2>
                        <div>Your temporary password for {this.state.username} is:</div>
                        <h2>{this.state.tempPassword}</h2>
                        <div>Please push the button, after which you will be asked to create a new password</div>
                        <Button className="confirm-button" onClick={() => this.redirectTo(`/login`)}>Login</Button>
                    </Paper>

                </div>
            </div>
        )
    }
}