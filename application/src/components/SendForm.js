import React, { Component } from "react";
import getAddress from "../util/wallet";
import sf from "../util/superfluid";
import Gun from 'gun';

class SendForm extends Component {
    constructor() {
        super();
        this.gun = Gun();
        window.gun = this.gun;
    }

    state = {
        isProcessing: false,
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const user = getAddress();
        const daix = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';
        const contactList = document.querySelector('#contactList-receiver');
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
            await this.props.getDetails();
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ isProcessing: false });

        receiver.value = '';
        inputAmount.value = '';
        contactList.innerHTML = '<option className="placeholder-opt" value="">Select an existing contact</option>';
    }

    onAppear = async () => {
        const user = await getAddress();
        const connections = await this.props.getConnections(user);
        const contactList = document.querySelector('#contactList-receiver');
        const contactOptHtml = connections.map(person => {
            if (person.alias && person.address) {
                return `<option value="${person.address}">${person.alias}<span> - ${person.address.substr(0, 8)}...</span></option>`;
            }
        }).join('');
        const ogContactOpt = '<option className="placeholder-opt" value="">Select an existing contact</option>';
        contactList.innerHTML = ogContactOpt + contactOptHtml;
    }

    onChange = async () => {
        const user = await getAddress();
        const selector = document.querySelector('#contactList-receiver');
        this.gun.get(`user/${user}`).get('connections').map((data, key) => {
            console.log(key, data);
            console.log(selector.value);
            if (data.address && data.address === selector.value) {
                const receiver = document.querySelector('#sendForm').querySelector('input[name="receiver"]');
                receiver.value = data.address;
            }
        });
    }

    render() {
        return (
            <div>
                <div className="modal-body">
                    <form id="sendForm" onSubmit={this.onSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">To:</th>
                                    <td>
                                        <select onChange={this.onChange} id="contactList-receiver" placeholder="Select an existing contact" onClick={this.onAppear}>
                                            <option className="placeholder-opt" value="">Select an existing contact</option>
                                        </select>     --OR--     
                                        <input type="text" name="receiver" className="stretch" placeholder="Enter an address" required style={{marginTop: '5px'}} />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" style={{paddingTop: '20px'}} >Amount:</th>
                                    <td style={{paddingTop: '20px'}}>
                                        <input type="number" name="amount" placeholder="0.00" required style={{marginRight: '5px', textAlign: 'right'}} />DAI
                                        <span> /month</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="notes">
                            Please keep a sufficient balance in your account so your remittance
                            can maintain a continuous stream to your recipient. All remittances 
                            will continue sending tokens every second until you manually stop them.
                        </p>
                        <div className="spinner" hidden={!this.state.isProcessing} />
                        <p style={{color: 'red', fontWeight: 'bold'}}>{this.state.errorMessage}</p>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="submit" form="sendForm" className="blue">Send</button>
                </div>
            </div>
        )
    }
}

export default SendForm;