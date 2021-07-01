import React from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastNotifications.scss";

toast.configure();

export default function ToastNotifications() {
  export const successfulToast = (message) => {
    toast.success(
      <div>
        <i className="fas fa-check-circle"></i>
        {message}
      </div>,
      { hideProgressBar: true, autoClose: 3000 }
    );
  };
}
