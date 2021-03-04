import React from 'react';
import Button from '@material-ui/core/Button';

import logout from '../util/logout';

export default function LoginLogoutButton(props) {
    function handleClick() {
        logout(props);
    }

    return (
        <div className="nav-item login-logout-button">
            <Button className="confirm-button" onClick={() => handleClick()}>{props.authToken ? "Logout" : "Login"}</Button>
        </div>
    );
}