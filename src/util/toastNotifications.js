import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/util/toastNotifications.scss";

toast.configure();

export const errorToast = () => {
  toast.error("Photo not added!");
};

export const updateSuccessfulToast = () => {
  toast.success("User Account Updated!");
};

export const accountDeletedToast = () => {
  toast.success(
    <div>
      <i className="fas fa-check-circle"></i>User Account Deleted
    </div>,
    { hideProgressBar: true, autoClose: 2987 }
  );
};

export const messageSentToast = () => {
  toast.success("Message Sent");
};

export const successfulToast = (message) => {
  toast.success(
    <div>
      <i className="fas fa-check-circle"></i>
      {message}
    </div>,
    { hideProgressBar: true, autoClose: 2987 }
  );
};
