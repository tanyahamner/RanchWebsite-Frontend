import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Cookies from 'js-cookie';

import asyncAPICall from './util/apiWrapper';
import logout from "./util/logout";

export default class OrganizationSelect extends Component {
    constructor(props) {
        super(props)

        this.state = {
            organizations: [{ "name": "Select an Organization", value: "" }],
            org_name: "Select an Organization",
            org_id: "",
            loaded: false
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, value) {
        if (value) {
            this.props.parent.setState({
                org_id: value.value,
                org_name: value.name
            })
        }
    }

    componentDidMount() {
        let auth_token = Cookies.get('auth_token');
        if (auth_token) {
            let auth_ok = asyncAPICall(`/organization/get`, "GET", null, null,
                data => {
                    let options = [{ "name": "Select an Organization", value: "" }]
                    data.forEach(element => {
                        options.push(
                            {
                                name: element.name,
                                value: element.org_id,
                                active: element.active
                            }
                        )
                    });
                    let org_id = this.props.org_id
                    let org_name = this.props.org_name
                    if (!this.props.org_id || this.props.org_id === '') {
                        org_id = ""
                    }
                    if (!org_name || org_name === '') {
                        org_name = "Select an Organization";
                    }

                    this.setState({
                        organizations: options,
                        org_id: org_id,
                        org_name: org_name,
                        loaded: true
                    })
                },
                null, this.props
            );
            if (!auth_ok) { logout(this.props); }
        }
    }


    render() {
        if (!this.state.organizations) {
            console.log("Loading...")
            return (
                <div />
            )
        }

        return (
            <div>
                <Autocomplete
                    id="org_id"
                    name="org_id"
                    options={this.state.organizations}
                    getOptionLabel={(option) => {
                        if (option && option.name) {
                            return option.name
                        } else {
                            return "Select an Organization"
                        }
                    }}
                    getOptionSelected={(option) => {
                        if (!this.state.loaded) {
                            return true;
                        }
                        if (option && option !== "") {
                            return option.value === this.props.parent.state.org_id
                        } else {
                            return false;
                        }
                    }}
                    getOptionDisabled={(option) => {
                        return !option.active
                    }}
                    style={{ width: 300 }}
                    onChange={this.handleChange}
                    renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
                    size="small"
                    disableClearable
                    loading={!this.state.organizations[0]}
                    value={{ "name": this.props.parent.state.org_name, "value": this.props.parent.state.org_id }}
                />
            </div>
        )
    }
}
