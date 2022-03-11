import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";

import ConfirmDelete from "../components/confirmDelete";
import EditTitle from "../components/editTitle";
import UserList from "./userList";
import { validateUUID, formatPhone } from "../util/stringUtils";
import { successfulToast } from "../util/toastNotifications";
import SecurityWrapper from "../util/securityWrapper";
import asyncAPICall from "../util/apiWrapper";
import logout from "../util/logout";

export default function GetOrganization(props) {
  const [organization, setOrganization] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [userOrgId, setUserOrgId] = useState(null);
  const [title, setTitle] = useState(null);
  const [oldTitle, setOldTitle] = useState("");
  const [switchStyle, setSwitchStyle] = useState("slider round");
  const [disableButtons, setDisableButtons] = useState(false);
  const [users, setUsers] = useState([])
  useEffect(() => {
    let org_id = props.match.params.org_id;
    if (!validateUUID(org_id)) {
      props.history.push("/notfound");
    }

    let user_org_id = Cookies.get("org_id");
    // /user/get/organization/<org_id>
    let auth_ok = asyncAPICall(
      `/organization/get/${org_id}`,
      "GET",
      null,
      null,
      (data) => {
        setOrganization(data);
        setOrgName(data.name);
        setOrgId(org_id);
        setUserOrgId(user_org_id);
        setTitle(data.name);
        setOldTitle(data.name);

        let disableButtons = data.org_id === data.user_org_id ? true : false;

        if (disableButtons) {
          setSwitchStyle("slider round disable-switch");
        }
        setDisableButtons(disableButtons);
      },
      null,
      props
    );

    asyncAPICall(`/user/get/organization/${org_id}`, "GET", null, null, 
      data => setUsers(data),
      err => console.error("Get Org Users Error: ", err),
      true
    )

    if (!auth_ok) {
      logout(props);
    }
  }, [props]);

  const organizationActivateToast = () => {
    if (organization.active) {
      successfulToast("Organization Successfully Deactivated!");
    } else {
      successfulToast("Organization Successfully Activated!");
    }
  };

  function handleActivation() {
    let endpoint = organization.active ? "deactivate" : "activate";
    asyncAPICall(
      `/organization/${endpoint}/${organization.org_id}`,
      "PUT",
      null,
      null,
      (data) => {
        organizationActivateToast();
        setOrganization(data);
      },
      null
    );
  }

  function redirectTo(path) {
    props.history.push(path);
  }

  if (!organization) {
    return <div />;
  }

  return (
    <div className="get-wrapper">
      <div className="get-detail-wrapper">
        <Button
          className="confirm-button back-button"
          onClick={() => props.history.goBack()}
        >
          <i className="fas fa-chevron-left button-icon"></i> Back
        </Button>
        <div className="detail-wrapper wrapper">
          <Paper className="form-wrapper" elevation={3}>
            <div className="details">
              <div className="top-section">
                <EditTitle
                  title_name={title}
                  set_title={setTitle}
                  set_old_title={setOldTitle}
                  old_title={oldTitle}
                  type="organization"
                  id={organization.org_id}
                  data={organization}
                />
                <SecurityWrapper roles="super-admin">
                  <div className="switch-wrapper">
                    Active:
                    <label className="switch">
                      <input
                        type="checkbox"
                        disabled={disableButtons ? true : false}
                        onClick={() => handleActivation()}
                        defaultChecked={organization.active}
                      />
                      <span className={switchStyle}>
                        <span>On</span>
                        <span>Off</span>
                      </span>
                    </label>
                  </div>
                </SecurityWrapper>
                <SecurityWrapper restrict_roles="super-admin">
                  <h2>Active</h2>
                </SecurityWrapper>
              </div>
              <div className="middle-section">
                <div className="icon-and-details">
                  <i className="far fa-building"></i>
                  <div>
                    <p className="address">
                      {organization.address}
                      <br />
                      {organization.city} {organization.state} &nbsp;
                      {organization.zip_code}
                    </p>
                    <p className="phone">{formatPhone(organization.phone)}</p>
                  </div>
                </div>
                <div className="flex-row">
                  <SecurityWrapper restrict_roles="user">
                    <Button
                      className="confirm-button"
                      onClick={() =>
                        redirectTo(`/organization-form/${organization.org_id}`)
                      }
                    >
                      Edit
                    </Button>
                    <SecurityWrapper restrict_roles="admin">
                      <ConfirmDelete
                        disabled={orgId === userOrgId ? true : false}
                        objectType="organization"
                        id={organization.org_id}
                        redirectTo={redirectTo}
                      />
                    </SecurityWrapper>
                  </SecurityWrapper>
                </div>
              </div>
            </div>
            <br />
            <div className="user-list">
              <UserList
                {...props}
                disableAddUser={!organization.active}
                showFilter="false"
                columns="first_name,last_name,email,phone,active"
                org_name={orgName}
                org_id={props.match.params.org_id}
                userList ={users}
              />
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}
