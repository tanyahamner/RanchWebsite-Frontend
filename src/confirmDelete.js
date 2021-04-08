import React, { Component } from "react";
import ReactModal from "react-modal"
import Button from '@material-ui/core/Button';

import { awaitAPICall } from './util/apiWrapper';
import logout from './util/logout';

ReactModal.setAppElement('#root');

export default class ConfirmDelete extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ModalOpen: false
        }
    }

    openModal() {
        this.setState({
            ModalOpen: true
        })
    }

    cancel() {
        this.setState({
            ModalOpen: false
        })
    }
    // <ConfirmDelete objectType="user" id="user_id", redirectTo="/users" />

    confirmDelete() {
        let auth_ok = awaitAPICall(`/${this.props.objectType}/delete/${this.props.id}`, "DELETE", null, null,
            data => {
                console.log(`${this.props.objectType} deleted`)
                this.setState({
                    ModalOpen: false
                })
                this.props.redirectTo(`/${this.props.objectType}s`)
            },
            null
        );
        if (!auth_ok) { logout(this.props) }
    }


    // 0===[==============>
    // 0=={===>

    render() {
        const styles = {
            outline: 'none'
        }
        return (
            <div>
                <Button disabled={this.props.disabled} className="delete-button" onClick={() => this.openModal()}>Delete</Button>
                <ReactModal isOpen={this.state.ModalOpen} className="delete-modal" style={styles}>
                    <div className="icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="are-you-sure">Are you sure you want to delete this {this.props.objectType}?</div>
                    <Button className="cancel-button" onClick={() => this.cancel()}>Cancel</Button>
                    <Button className="delete-button" onClick={() => this.confirmDelete()}>Yes</Button>
                </ReactModal>
            </div>
        )
    }
}