import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import ActiveBadge from "../components/activeBadge.js";
import { formatPhone } from "../util/stringUtils";
import asyncAPICall from "../util/apiWrapper";
import logout from "../util/logout.js";

const columns = {
  name: {
    name: "Name",
    selector: "name",
    sortable: true,
    cell: (row) => (
      <Link
        className="table-link"
        to={{ pathname: `/organization/${row.org_id}` }}
      >
        {row.name}
      </Link>
    ),
  },
  city: {
    name: "City",
    selector: "city",
    sortable: true,
  },
  state: {
    name: "State",
    selector: "state",
    sortable: true,
  },
  phone: {
    name: "Phone",
    selector: "phone",
    sortable: true,
    cell: (row) => formatPhone(row.phone),
  },
  org_id: {
    name: "ID",
    selector: "org_id",
    sortable: false,
  },
  active: {
    name: "Active",
    selector: "active",
    sortable: true,
    cell: (row) => <ActiveBadge active={row.active} />,
    // center: true
    width: "150px",
  },
  edit_button: {
    name: "",
    sortable: false,
    cell: (row) => (
      <Link to={{ pathname: `/organization-form/${row.org_id}` }}>
        <Button className="confirm-button">Edit</Button>
      </Link>
    ),
    width: "150px",
  },
};


const OrganizationList = (props) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [list, setList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const loadResults = useCallback(() => {
    if (props.orgList) {
      setList(props.orgList);
      setFilterText("");
      setFilteredList(props.orgList);
    } else {
      let auth_ok = asyncAPICall(
        "/organization/get",
        "GET",
        null,
        null,
        (data) => {
          setList(data);
          setFilterText("");
          setFilteredList(data);
        },
        null,
        props
      );
      if (!auth_ok) {
        logout(props);
      }
    }
  }, [props])


  useEffect(() => {
    let selected;

    if (props.columns) {
      selected = [];
      props.columns.split(",").forEach((item) => {
        selected.push(columns[item]);
      });
    } else {
      selected = [
        columns.name,
        columns.city,
        columns.state,
        columns.org_id,
        columns.active,
        columns.edit_button,
      ];
    }
    setSelectedColumns(selected);
  }, [props.columns]);

  useEffect(() => {
    loadResults();
  }, [props.orgList, loadResults]);

  const handleFilter = (e) => {
    let newFilterText = e.target.value;
    let filteredList = [...list];

    if (newFilterText) {
      newFilterText = newFilterText.toLowerCase();
      filteredList = filteredList.filter((item) => {
        return (
          (item.name && item.name.toLowerCase().includes(newFilterText)) ||
          (item.city && item.city.toLowerCase().includes(newFilterText)) ||
          (item.state && item.state.toLowerCase().includes(newFilterText))
        );
      });
    }
    setFilterText(newFilterText);
    setFilteredList(filteredList);
  };

  return (
    <div className="list-wrapper list-page">
      <div className="button-and-search">
        {!props.showAddButton || props.showAddButton === false ? (
          <Link to="/organization-form">
            <Button className="confirm-button">
              <i className="fas fa-plus button-icon"></i> Add New Organization
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {!props.showFilter || props.showFilter === false ? (
          <TextField
            id="search"
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={handleFilter}
            variant="outlined"
            size="small"
          />
        ) : (
          <div />
        )}
      </div>
      <div className="seperator"></div>
      <DataTable
        title={
          <span>
            <i className="far fa-building"></i> Organizations
          </span>
        }
        columns={selectedColumns}
        data={filteredList}
      />
    </div>
  );
};

export default OrganizationList;
