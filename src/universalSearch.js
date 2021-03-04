import React, { Component } from 'react';
import Cookies from 'js-cookie';
import UserList from './userList';
import OrganizationList from './organizationList';
import Button from '@material-ui/core/Button';

import asyncAPICall from './util/asyncAPICall';
// import logout from './util/logout';

export default class UniversalSearch extends Component {


    constructor(props) {
        super(props)

        this.state = {
            organizations: [],
            users: [],
            displays: [],
            dashboards: [],
            widgets: [],
            searchTerm: props.searchTerm,
        }

        this.results = false;

        this.renderOrganizations = this.renderOrganizations.bind(this)
        this.renderUsers = this.renderUsers.bind(this)
    }

    //0========[====================================>

    componentDidMount() {
        this.loadResults(this.props.searchTerm)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.searchTerm !== state.searchTerm) {
            return {
                searchTerm: props.searchTerm
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.searchTerm !== prevProps.searchTerm) {
            this.results = false
            this.loadResults(this.props.searchTerm)
        }
    }

    loadResults(searchTerm) {
        let auth_token = Cookies.get('auth_token');
        // console.log(`auth_token: ${auth_token}`)
        if (auth_token) {
            // console.log(`search_term: ${searchTerm}`)
            if (searchTerm && searchTerm !== '') {
                asyncAPICall(`/search/${searchTerm}`, "GET", null, null,
                    data => {
                        this.setState({
                            organizations: data.organizations,
                            users: data.users,
                            displays: data.displays,
                            dashboards: data.dashboards,
                            widgets: data.widgets,
                            searchTerm: searchTerm
                        })
                    },
                    null, this.props
                );
                //if (!auth_ok) { logout(this.props); }
            }
        }
    }

    renderOrganizations() {
        if (this.state.organizations && this.state.organizations.length > 0) {
            this.results = true;
            return (<OrganizationList showFilter="false" showAddButton="false" columns="name,city,state,phone,active" orgList={this.state.organizations} />)
        }
        return ''
    }

    renderUsers() {
        if (this.state.users && this.state.users.length > 0) {
            this.results = true;
            return (<UserList showFilter="false" showAddButton="false" columns="first_name,last_name,email,phone,active" userList={this.state.users} />)
        }
        return ''
    }

    render() {
        return (
            <div className="search-data-wrapper">
                <Button className="confirm-button back-button search-title" onClick={() => this.props.history.goBack()}><i className="fas fa-chevron-left button-icon"></i> Back</Button>
                <h1 className="search-title">Search Results</h1>
                <div className="organizations">
                    {this.renderOrganizations()}
                </div>
                <div className="users">
                    {this.renderUsers()}
                </div>
                {(this.results) ? "" : <h4 className="no-results">There are no records to display</h4>}
                <div className="vertical-spacing">
                    <br /><br /><br />
                </div>
            </div>
        )
    };
}