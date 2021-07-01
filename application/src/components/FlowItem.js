import React, { Component } from "react";
import sf from "../util/superfluid";
import getAddress from "../util/wallet";


class FlowItem extends Component {
    state = {
        flow: '',
        timestamp: '',
        deposit: ''
    }

    onClick = async () => {
        const daix = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';
        const userAddress = getAddress();
        
        const flow = await sf.cfa.getFlow({
            superToken: daix,
            sender: userAddress,
            receiver: '' // Insert a MetaMask account address
        })
        const monthlyFlow = parseFloat(flow.flowRate) / 385802469135.802;

        return this.setState({ flow: monthlyFlow, deposit: flow.deposit });
    }

    render() {
        return (
            <div>
                <button onClick={this.onClick} className="yellow">Get CashFlow</button>
                <p>{this.state.flow} DAI/month</p>
                <p>{this.state.deposit} DAI/month</p>
            </div>
        )
    }
}

export default FlowItem;