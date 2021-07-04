import React, { Component } from "react";

class NetFlow extends Component {
    render() {
        return (
            <div>
                <h3>Net Flow</h3>
                <p className="balance">{this.props.flowRate} <span className="currency">DAI /month</span></p>
            </div>
        )
    }
}

export default NetFlow;