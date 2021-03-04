import React, { Component } from 'react';
import Cookies from 'js-cookie';


export default class Home extends Component {
    componentDidMount() {
        let auth_token = Cookies.get("auth_token");
        if (!auth_token) {
            this.props.history.push('/login');
        }
    }

    render(){
        return(
            <div className='home-wrapper'>
                <div>Welcome to Sonar, by Midlera</div>
                
            </div>
        )
    }
}