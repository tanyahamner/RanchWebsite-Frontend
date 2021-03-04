import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Logo from "../img/logo.svg";
import TextField from '@material-ui/core/TextField';


export default class ChangePassword extends Component {
    constructor(props) {
        super(props)

        this.state = {

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
                        <h2>Change Password</h2>
                        <form className="recovery-form">
                            <TextField required className="send-recovery" type="password" variant="outlined" size="small" placeholder="New Password" />
                            <TextField required className="send-recovery" type="password" variant="outlined" size="small" placeholder="Re-enter Your New Password" />
                            <Button className="confirm-button send-recovery" type="submit" onClick={() => this.redirectTo(`/home`)}>Change Password</Button>
                        </form>
                    </Paper>

                </div>
            </div>
        )
    }
}