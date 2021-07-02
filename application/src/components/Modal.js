import React, { Component } from "react";

class Modal extends Component {
    state = {
        errorMessage: '',
        form: ''
    }

    onClick = (e) => {
        const modal = document.querySelector('#modal');
        if (e.target.classList.contains('modal') && !e.target.classList.contains('sticky')) {
            this.setState({ errorMessage: '' });
            return modal.style.display = 'none';
        }
    }

    render() {
        return (
            <div id="modal" className="modal" onClick={this.onClick}>
                <div className="modal-box">
                    <div className="modal-header">
                        <h3>Modal</h3>
                    </div>
                    {/* <SendForm getDetails={this.props.getDetails}/> */}
                    {this.props.formType}
                </div>
            </div>
        )
    }
}

export default Modal;