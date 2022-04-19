import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import ActiveBadge from "../components/activeBadge.js";
import { formatPhone } from "../util/stringUtils";
import SecurityWrapper from "../util/securityWrapper";
import asyncAPICall from "../util/apiWrapper";
import logout from "../util/logout.js";

const columns = {
  first_name: {
    name: "First Name",
    selector: "first_name",
    sortable: true,
    cell: (row) => (
      <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>
        {row.first_name}
      </Link>
    ),
  },
  last_name: {
    name: "Last Name",
    selector: "last_name",
    sortable: true,
    cell: (row) => (
      <Link className="table-link" to={{ pathname: `/user/${row.user_id}` }}>
        {row.last_name}
      </Link>
    ),
  },
  email: {
    name: "Email",
    selector: "email",
    sortable: true,
  },
  phone: {
    name: "Phone",
    selector: "phone",
    sortable: true,
    cell: (row) => formatPhone(row.phone),
  },
  org_name: {
    name: "Org",
    selector: "organization.name",
    sortable: true,
  },
  role: {
    name: "Role",
    selector: "role",
    sortable: true,
  },
  active: {
    name: "Active",
    selector: "active",
    sortable: true,
    cell: (row) => <ActiveBadge active={row.active} />,
    // center: true
    // style: {width: '1px'}
    width: "150px",
  },
  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <Link to={{ pathname: `/user/edit/${row.user_id}` }}>
        <button className="confirm-button">Edit</button>
      </Link>
    ),
    width: "150px",
  },
  user_id: {
    name: "ID",
    selector: "user_id",
    sortable: false,
  },
};

const UserList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [linkToAddUser, setLinkToAddUser] = useState("/user-add/");

  const loadResults = useCallback(() => {
    if (props.userList) {
      setFilterText("");
      setFilteredList(props.filteredList || props.userList);
    } else {
      let fetchUrl = "/user/get";
      if (props.org_id) {
        fetchUrl = `/user/get/organization/${props.org_id}`;
      }

      const auth_ok = asyncAPICall(
        fetchUrl,
        "GET",
        null,
        null,
        (data) => {
          setList(data);
          setFilterText("");
          // setFilteredList(data);
        },
        null,
        props
      );

      if (!auth_ok) {
        logout(props);
      }
    }
  }, [props]);

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          (item.first_name &&
            item.first_name.toLowerCase().includes(newFilterText)) ||
          (item.last_name &&
            item.last_name.toLowerCase().includes(newFilterText)) ||
          (item.phone && item.phone.toLowerCase().includes(newFilterText)) ||
          (item.email && item.email.toLowerCase().includes(newFilterText))
        );
      });
    }

    setFilterText(e.target.value);
    setFilteredList(filteredList);
  };

  useEffect(() => {
    const org_id = props.org_id || "";
    const org_name = props.org_name || "";
    let selectedColumns;

    if (props.columns) {
      selectedColumns = props.columns.split(",").map((item) => {
        return columns[item];
      });
    } else {
      selectedColumns = [
        columns.first_name,
        columns.last_name,
        columns.email,
        columns.phone,
        columns.org_name,
        columns.role,
        columns.active,
        columns.edit_button,
      ];
    }

    setSelectedColumns(selectedColumns);

    if (org_id) {
      setLinkToAddUser(`/user-add/${org_id}/${org_name}/`);
    }
  }, [props.columns, props.org_id, props.org_name]);

  useEffect(() => {
    loadResults();
  }, [props.userList, loadResults]);

  return (
    <div className="list-wrapper list-page">
      <div className="button-and-search">
        <SecurityWrapper restrict_roles="user">
          {!props.showAddButton || props.showAddButton === false ? (
            <button
              disabled={props.disableAddUser}
              onClick={() => props.history.push(linkToAddUser)}
              className="confirm-button"
            >
              <i className="fas fa-plus button-icon"></i>Add New User
            </button>
          ) : (
            <div />
          )}
        </SecurityWrapper>

        <SecurityWrapper roles="user">
          <div />
        </SecurityWrapper>

        {!props.showFilter || props.showFilter === false ? (
          <input
            id="search"
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={handleFilter}
          />
        ) : (
          <div />
        )}
      </div>

      <div className="seperator"></div>

      <DataTable
        columns={selectedColumns}
        data={filteredList}
        title={
          <span>
            <i className="fas fa-user"></i> Users
          </span>
        }
      />
    </div>
  );
};

export default UserList;
