import React, { Component } from "react";
import sf from "../util/superfluid";
import getAddress from "../util/wallet";


class NetFlow extends Component {
    state = {
        netFlow: ''
    }

    onClick = async () => {
        const daix = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';
        const userAddress = getAddress();
        
        const netFlow = await sf.cfa.getNetFlow({
            superToken: daix,
            account: userAddress
        });
        const monthlyNetFlow = parseFloat(netFlow) / 385802469135.802;

        return this.setState({ netFlow: monthlyNetFlow });
    }

    render() {
        return (
            <div className="summary">
                <h3>My Flows</h3>
                <button onClick={this.onClick}>Get Net CashFlow</button>
                <p>{this.state.netFlow}</p>
            </div>
        )
    }
}

export default NetFlow;