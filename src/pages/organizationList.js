import React, { Component } from "react";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import ActiveBadge from '../components/activeBadge.js';
import { formatPhone } from "../util/stringUtils";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import asyncAPICall from '../util/apiWrapper';
import logout from "../util/logout.js";

const columns = {
    "name": {
        name: 'Name',
        selector: 'name',
        sortable: true,
        cell: row => <Link className="table-link" to={{ pathname: `/organization/${row.org_id}` }}>{row.name}</Link>
    },
    "city": {
        name: 'City',
        selector: 'city',
        sortable: true
    },
    "state": {
        name: 'State',
        selector: 'state',
        sortable: true,
    },
    "phone": {
        name: 'Phone',
        selector: 'phone',
        sortable: true,
        cell: row => formatPhone(row.phone)
    },
    "org_id": {
        name: 'ID',
        selector: 'org_id',
        sortable: false
    },
    "active": {
        name: 'Active',
        selector: 'active',
        sortable: true,
        cell: row => <ActiveBadge active={row.active} />,
        // center: true
        width: "150px"
    },
    "edit_button": {
        name: '',
        sortable: false,
        cell: row => <Link to={{ pathname: `/organization-form/${row.org_id}` }}><Button className="confirm-button" >Edit</Button></Link>,
        width: "150px"
    }
};

export default class OrganizationList extends Component {
    constructor(props) {
        super(props)

        let selectedColumns = []

        if (props.columns) {
            selectedColumns = []
            props.columns.split(',').forEach((item) => {
                selectedColumns.push(columns[item])
            })
        } else {
            selectedColumns = [
                columns.name,
                columns.city,
                columns.state,
                columns.org_id,
                columns.active,
                columns.edit_button
            ]
        }

        this.state = {
            selectedColumns: selectedColumns,
            list: [],
            filterText: '',
            filteredList: []
        }

        this.handleFilter = this.handleFilter.bind(this);
        this.loadResults = this.loadResults.bind(this);
    }

    componentDidMount() {
        this.loadResults();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.orgList && props.orgList !== state.list) {
            return {
                list: props.orgList,
                filteredList: props.orgList
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.orgList && this.props.orgList !== prevProps.orgList) {
            this.loadResults()

        }
    }

    loadResults() {
        if (this.props.orgList) {
            this.setState({
                list: this.props.orgList,
                filterText: '',
                filteredList: this.props.orgList
            })
        } else {
            let auth_ok = asyncAPICall("/organization/get", "GET", null, null,
                data => {
                    this.setState({
                        list: data,
                        filterText: '',
                        filteredList: data
                    })
                },
                null, this.props
            );
            if (!auth_ok) { logout(this.props); }
        }
    }


    handleFilter(event) {
        let newFilterText = event.target.value;
        let filteredList = this.state.list
        if (newFilterText) {
            newFilterText = newFilterText.toLowerCase();
            filteredList = this.state.list.filter(item => {
                return (
                    (item.name && item.name.toLowerCase().includes(newFilterText)) ||
                    (item.city && item.city.toLowerCase().includes(newFilterText)) ||
                    (item.state && item.state.toLowerCase().includes(newFilterText))
                );
            })
        }

        this.setState({
            filterText: event.target.value,
            filteredList: filteredList
        })
    }

    redirectTo(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <div className="list-wrapper list-page" >
                <div className="button-and-search">
                    {(!this.props.showAddButton || this.props.showAddButton === false) ?
                        <Link to="/organization-form"><Button className="confirm-button"><i className="fas fa-plus button-icon"></i> Add New Organization</Button></Link>
                        : <div />
                    }
                    {(!this.props.showFilter || this.props.showFilter === false) ?
                        <TextField id="search" type="text" placeholder="Filter results..." value={this.state.filterText} onChange={this.handleFilter} variant='outlined' size="small" />
                        : <div />
                    }
                </div>
                <div className="seperator"></div>
                <DataTable
                    title={<span><i className='far fa-building'></i> Organizations</span>}
                    columns={this.state.selectedColumns}
                    data={this.state.filteredList}
                />
            </div>
        )
    }
}
