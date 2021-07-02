import React, { Component } from "react";
import getAddress from "../util/wallet";
import sf from "../util/superfluid";

class RequestForm extends Component {
    state = {
        isProcessing: false,
        errorMessage: ''
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const user = getAddress();
        const daix = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';
        const sender = document.querySelector('#requestForm').querySelector('input[name="sender"]');
        const inputAmount = document.querySelector('#requestForm').querySelector('input[name="amount"]');
        const otherUser = sender.value;
        const amount = `${parseFloat(inputAmount.value) * 385802469135.802}`;
        this.setState({ isProcessing: true });
        try {
            await sf.cfa.createFlow({
                superToken: daix,
                sender: otherUser,
                receiver: user,
                flowRate: amount
            });
            // ERROR - Transaction does not go through at the moment
            // This function is not working - expected to re-render new flows but nothing
            await this.props.getDetails();
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ isProcessing: false });

        sender.value = '';
        inputAmount.value = '';
    }

    render() {
        return (
            <div>
                <div className="modal-body">
                    <form id="requestForm" onSubmit={this.onSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">From:</th>
                                    <td>
                                        <input type="text" name="sender" className="stretch" placeholder="Enter an address" required />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Amount:</th>
                                    <td>
                                        <input type="number" name="amount" placeholder="0.00" required />DAI
                                        <span> /month</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="notes">
                            Please note that submitting this request will notify the other party, 
                            who must approve the transaction before the remittance can be fulfilled. 
                            Once approved, you will start receiving the remittance.
                        </p>
                        <div className="spinner" hidden={!this.state.isProcessing} />
                        <p style={{color: 'red', fontWeight: 'bold'}}>{this.state.errorMessage}</p>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="submit" form="requestForm" className="yellow">Request</button>
                </div>
            </div>
        )
    }
}

export default RequestForm;