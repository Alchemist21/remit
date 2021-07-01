import React, { Component } from "react";

class Modal extends Component {
    state = {
        modalTitle: '',
        modalBody: '',
        btnAction: 'Do Something'
    }
    render() {
        return (
            <div className="modal">
                <div className="modal-box">
                    <div className="modal-header">
                        <h3>{this.state.modalTitle}</h3>
                    </div>
                    <div className="modal-body">
                        {this.state.modalBody}
                    </div>
                    <div className="modal-footer">
                        <button className="blue">{this.state.btnAction}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;