import { useState } from "react";
import ReactModal from "react-modal";
import Button from "@material-ui/core/Button";

import { awaitAPICall } from "../util/apiWrapper";
import logout from "../util/logout";

ReactModal.setAppElement("#root");

const styles = {
  outline: "none",
};

const ConfirmDelete = (props) => {
  const [modalOpen, setModalOpen] = useState(false);

  function handleDelete() {
    let auth_ok = awaitAPICall(
      `/${props.objectType}/delete/${props.id}`,
      "DELETE",
      null,
      null,
      (data) => {
        console.log(`${props.objectType} deleted`);
        setModalOpen(false);
        props.redirectTo(`/${props.objectType}s`);
      },
      null
    );
    if (!auth_ok) {
      logout(props);
    }
  }

  return (
    <div>
      <Button
        disabled={props.disabled}
        className="delete-button"
        onClick={() => setModalOpen(true)}
      >
        Delete
      </Button>
      <ReactModal isOpen={modalOpen} className="delete-modal" style={styles}>
        <div className="icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="are-you-sure">
          Are you sure you want to delete this {props.objectType}?
        </div>
        <Button className="cancel-button" onClick={() => setModalOpen(false)}>
          Cancel
        </Button>
        <Button className="delete-button" onClick={() => handleDelete()}>
          Yes
        </Button>
      </ReactModal>
    </div>
  );
};

export default ConfirmDelete;
