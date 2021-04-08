import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// import TextMaskCustom from "./components/maskedInput";

import asyncAPICall from './util/apiWrapper';
import logout from "./util/logout";

export default class OrganizationForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            formData: {},
            org_id: '',
            name: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            phone: '',
            active: 1,
            editing: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        let org_id = this.props.match.params.org_id

        if (org_id) {
            let auth_ok = asyncAPICall(`/organization/get/${org_id}`, "GET", null, null,
                data => {
                    if (!data.org_id) {
                        console.log("ERROR: organization not found")
                    }
                    else {
                        this.setState({
                            org_id: data.org_id,
                            name: data.name,
                            address: data.address,
                            city: data.city,
                            state: data.state,
                            zip_code: data.zip_code,
                            phone: data.phone,
                            active: data.active,
                            editing: true
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
        event.preventDefault();

        let fetch_url = 'add'
        let form_body = new FormData(event.target)

        if (this.state.editing) {
            fetch_url = 'update'
        }

        let body = Object.fromEntries(form_body)
        asyncAPICall(`/organization/${fetch_url}`, "POST", body, null,
            data => {
                this.props.history.push(`/organizations`);
            },
            null
        )

        // fetch(`http://127.0.0.1:5000/organization/${fetch_url}`, {
        //     method: "POST",
        //     headers: { "content-type": "application/json" },
        //     body: JSON.stringify(Object.fromEntries(form_body))
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         this.props.history.push(`/organizations`);
        //     })
        //     .catch(error => console.log(error));
    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    render() {
        let title = (this.state.editing) ? "Edit Organization" : "Add Organization";
        return (

            <div className="wrapper">
                <div className="form-field-wrapper">
                    <Paper className="form-wrapper" elevation={3}>
                        <h2>{title}</h2>
                        <form className="form" onSubmit={this.handleSubmit} method="POST">
                            <label htmlFor="name">Organization Name *</label>
                            <TextField required id="name" name="name" type="text" value={this.state.name} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="address">Address</label>
                            <TextField id="address" name="address" type="text" value={this.state.address} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="city">City</label>
                            <TextField id="city" name="city" type="text" value={this.state.city} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="state">State</label>
                            <TextField id="state" name="state" type="text" value={this.state.state} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="zip_code">Zip Code</label>
                            <TextField id="zip_code" name="zip_code" type="text" value={this.state.zip_code} onChange={this.handleChange} variant='outlined' size='small' />
                            <label htmlFor="phone">Phone</label>
                            <TextField id="phone" name="phone" type="text" value={this.state.phone} onChange={this.handleChange} variant='outlined' size='small' />
                            <Button className="cancel-button" type="button" onClick={() => this.props.history.goBack()}>Cancel</Button>
                            <Button className="confirm-button" type="submit">{title}</Button>
                            {(this.state.org_id) ? <input type="hidden" name="org_id" value={this.state.org_id} /> : ""}
                        </form>
                    </Paper>
                </div>
            </div>
        )
    }
}

