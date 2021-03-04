import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Logo from "../img/sonar_logo.svg";
import LoginBg from '../components/particleBackground';

export default function ForgotPassword(props) {

    function redirectTo(path) {
        props.history.push(path);
    }

    return (
        <div className='fp-page-wrapper'>
            <LoginBg />
            <div className="forgot-password-wrapper">
                <div className="logo">
                    <img src={Logo} alt="" height="32px"></img>
                </div>
                <Paper className="recovery-paper" elevation={3}>
                    <div>
                        <h2>Recover Password</h2>
                    </div>
                    <hr color='#6C8CB5' />
                    <div>
                        Don't worry, it happens to the best of us.
                    </div>
                    <form className="recovery-form">
                        <TextField required type="email" variant="outlined" size="small" placeholder="Your email here..." />
                        <Button className="confirm-button send-recovery" type="submit" onClick={() => redirectTo(`/login/email/sent`)}>send me recovery link</Button>
                    </form>
                </Paper>
            </div>
        </div>
    )
}