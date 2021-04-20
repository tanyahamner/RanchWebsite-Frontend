import React, { Component } from "react";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import ActiveBadge from '../components/activeBadge.js';
import { formatPhone } from "../util/stringUtils";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SecurityWrapper from "../util/securityWrapper";

import asyncAPICall from '../util/apiWrapper';
import logout from "../util/logout.js";

const columns = {
    "first_name": {
        name: 'First Name',
        selector: 'first_name',
        sortable: true,
        cell: row => <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>{row.first_name}</Link>
    },
    "last_name": {
        name: 'Last Name',
        selector: 'last_name',
        sortable: true,
        cell: row => <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>{row.last_name}</Link>
    },
    "email": {
        name: 'Email',
        selector: 'email',
        sortable: true
    },
    "phone": {
        name: 'Phone',
        selector: 'phone',
        sortable: true,
        cell: row => formatPhone(row.phone)
    },
    "org_name": {
        name: 'Org',
        selector: 'organization.name',
        sortable: true
    },
    "role": {
        name: 'Role',
        selector: 'role',
        sortable: true
    },
    "active": {
        name: 'Active',
        selector: 'active',
        sortable: true,
        cell: row => <ActiveBadge active={row.active} />,
        // center: true
        // style: {width: '1px'}
        width: "150px"
    },
    "edit_button": {
        name: '',
        sortable: false,
        cell: row => <Link to={{ pathname: `/user/edit/${row.user_id}` }}><Button className="confirm-button" >Edit</Button></Link>,
        width: "150px"
    },
    "user_id": {
        name: 'ID',
        selector: 'user_id',
        sortable: false
    }
};

export default class UserList extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        let selectedColumns = []

        if (props.columns) {
            selectedColumns = []
            props.columns.split(',').forEach((item) => {
                selectedColumns.push(columns[item])
            })
        } else {
            selectedColumns = [
                columns.first_name,
                columns.last_name,
                columns.email,
                columns.phone,
                columns.org_name,
                columns.role,
                columns.active,
                columns.edit_button
            ]
        }

        let org_id = null
        if (props.org_id) {
            org_id = props.org_id
        }

        let org_name = null
        // console.log("org_name: ", props.org_name)
        if (props.org_name) {
            org_name = props.org_name
        }

        this.state = {
            selectedColumns: selectedColumns,
            list: [],
            filterText: '',
            filteredList: [],
            org_id: org_id,
            org_name: org_name
        }


        this.handleFilter = this.handleFilter.bind(this);
        this.loadResults = this.loadResults.bind(this);
    }

    componentDidMount() {
        this.loadResults()
    }

    static getDerivedStateFromProps(props, state) {
        if (props.userList && props.userList !== state.list) {
            return {
                list: props.userList,
                filteredList: props.userList
            }
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userList && this.props.userList !== prevProps.userList) {
            this.loadResults()

        }
    }

    loadResults() {
        if (this.props.userList) {
            this.setState({
                list: this.props.userList,
                filterText: '',
                filteredList: this.props.userList
            })
        } else {
            let fetchUrl = "/user/get";
            if (this.props.org_id) {
                fetchUrl = `/user/get/organization/${this.props.org_id}`
            }

            const auth_ok = asyncAPICall(fetchUrl, "GET", null, null,
                data => {
                    this.setState({
                        list: data,
                        filterText: '',
                        filteredList: data
                    })
                }, null, this.props
            )

            if (!auth_ok) {
                logout(this.props);
            }
        }
    }

    handleFilter(event) {
        let newFilterText = event.target.value;
        let filteredList = this.state.list
        if (newFilterText) {
            newFilterText = newFilterText.toLowerCase();
            filteredList = this.state.list.filter(item => {
                return (
                    (item.first_name && item.first_name.toLowerCase().includes(newFilterText)) ||
                    (item.last_name && item.last_name.toLowerCase().includes(newFilterText)) ||
                    (item.phone && item.phone.toLowerCase().includes(newFilterText)) ||
                    (item.email && item.email.toLowerCase().includes(newFilterText))
                );
            })
        }

        this.setState({
            filterText: event.target.value,
            filteredList: filteredList
        })
    }

    render() {
        let link_to_add_user = "/user-add/"
        if (this.state.org_id) {
            link_to_add_user = `/user-add/${this.state.org_id}/${this.state.org_name}/`
        }
        return (
            <div className="list-wrapper list-page">
                <div className="button-and-search">
                    <SecurityWrapper restrict_roles="user">
                        {(!this.props.showAddButton || this.props.showAddButton === false) ?
                            <Button disabled={this.props.disableAddUser} onClick={() => this.props.history.push(link_to_add_user)} className="confirm-button"><i className="fas fa-plus button-icon"></i>Add New User</Button>
                            : <div />
                        }
                    </SecurityWrapper>
                    <SecurityWrapper roles="user">
                        <div />
                    </SecurityWrapper>
                    {(!this.props.showFilter || this.props.showFilter === false) ?
                        <TextField id="search" type="text" placeholder="Filter results..." value={this.state.filterText} onChange={this.handleFilter} variant='outlined' size="small" />
                        : <div />
                    }
                </div>
                <div className="seperator"></div>
                <DataTable
                    title={<span><i className="fas fa-user"></i> Users</span>}
                    columns={this.state.selectedColumns}
                    data={this.state.filteredList}
                />
            </div>
        )
    }
}