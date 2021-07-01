import React, { Component } from "react";
import SendForm from "./SendForm";

class Modal extends Component {
    state = {
        errorMessage: ''
    }

    onClick = (e) => {
        const modal = document.querySelector('.modal');
        if (e.target.classList.contains('modal') && !e.target.classList.contains('sticky')) {
            this.setState({ errorMessage: '' });
            return modal.style.display = 'none';
        }
        // Send money

        // deposit money

        // withdraw money
    }

    render() {
        return (
            <div className="modal" onClick={this.onClick}>
                <div className="modal-box">
                    <div className="modal-header">
                        <h3>Modal</h3>
                    </div>
                    <div className="modal-body">
                        <SendForm />
                    </div>
                    <div className="modal-footer">
                        <button type="submit" form="sendForm" className="blue">Do Something</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;