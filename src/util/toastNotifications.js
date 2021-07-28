import React from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../styles/toastNotifications.scss';


toast.configure();

export default function GrowlNotifications() {
  // const app = props.app;
  // let fileIds = app.getFileIdsFromState();


  const errorToast = () => {
    toast.error("Photo not added!");
  };


const updateSuccessfulToast = () => {
    toast.success("User Account Updated!");
  };

const accountDeletedToast = () => {
  toast.success(<div><i className="fas fa-check-circle"></i>User Account Deleted</div>, {hideProgressBar: true, autoClose:2987});
  };

const messageSentToast = () => {
    toast.success("Message Sent");
  };
};


export const successfulToast = (message) => {
  toast.success(<div><i className="fas fa-check-circle"></i>{message}</div>, {hideProgressBar: true, autoClose:2987});
};