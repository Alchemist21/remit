import React, { Component } from "react";
import getAddress from "../util/wallet";
import sf from "../util/superfluid";

class SendForm extends Component {
    state = {
        isProcessing: false,
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const user = getAddress();
        const daix = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';
        const receiver = document.querySelector('#sendForm').querySelector('input[name="receiver"]');
        const inputAmount = document.querySelector('#sendForm').querySelector('input[name="amount"]');
        const otherUser = receiver.value;
        const amount = `${parseFloat(inputAmount.value) * 385802469135.802}`;

        this.setState({ isProcessing: true });
        try {
            await sf.cfa.createFlow({
                superToken: daix,
                sender: user,
                receiver: otherUser,
                flowRate: amount
            });
            // This function is not working - expected to re-render new flows but nothing
            await this.props.getDetails();
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ isProcessing: false });

        receiver.value = '';
        inputAmount.value = '';
    }

    render() {
        return (
            <form id="sendForm" onSubmit={this.onSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">To:</th>
                            <td>
                                <input type="text" name="receiver" className="stretch" placeholder="Enter an address" required />
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
                <div className="spinner" hidden={!this.state.isProcessing} />
                <p style={{color: 'red', fontWeight: 'bold'}}>{this.state.errorMessage}</p>
            </form>
        )
    }
}

export default SendForm;