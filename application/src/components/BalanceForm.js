import React, { Component } from "react";

class BalanceForm extends Component {
    state = {
        isProcessing: false,
        errorMessage: ''
    }

    render() {
        return (
            <div>
                <div className="modal-body">
                    <form id={this.props.formId} onSubmit={this.onSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">{this.props.transferType}</th>
                                    <td>
                                        <input type="text" name="address" className="stretch" value={this.props.address} required />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Amount:</th>
                                    <td>
                                        <input type="number" name="amount" placeholder="0.00" required style={{marginRight: '5px'}} />DAI
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="notes">
                            {this.props.note}
                        </p>
                        <div className="spinner" hidden={!this.state.isProcessing} />
                        <p style={{color: 'red', fontWeight: 'bold'}}>{this.state.errorMessage}</p>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="submit" form={this.props.formId} className={this.props.btnColor}>{this.props.btnName}</button>
                </div>
            </div>
        )
    }
}

export default BalanceForm;