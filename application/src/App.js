import React, { Component } from "react";
import sf from "./util/superfluid";

import "./Dashboard.css";
import NetFlow from "./components/Netflow";
import FlowItem from "./components/FlowItem";
import Modal from "./components/Modal";
import Login from "./components/Login";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      isInitializing: false,
      isProcessing: false,
      user: '',
      daix: '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90',
      inFlows: [],
      outFlows: [],
      netFlow: ''
    }
  }

  cancelRemittance = async (receiver) => {
    const { user } = this.state;
    await user.flow({
      recipient: receiver,
      flowRate: '0'
    });
    this.getUserDetails();
  }

  updateRemittance = async (receiver, amount) => {
    const { user } = this.state;
    await user.flow({
      recipient: receiver,
      flowRate: amount // update flowRate with custom amount
    });
    this.getUserDetails();
  }

  // This function is not working onClick
  showAmountInput = (receiver) => {
    let amount;

    return (
      <form onSubmit={e => this.updateRemittance(receiver, amount)}>
        <input type="number" name="amount" onChange={e => {
          amount = e.target.value;
        }} />
        <button type="submit" className="yellow">Update</button>
      </form>
    )
  }

  getUserDetails = async () => {
    const { user } = this.state;
    const details = await user.details();
    console.log(details);
    const outFlows = details.cfa.flows.outFlows;
    const sentStreams = outFlows.length ? outFlows.map(flow => {
      return (
        <div>
          <p className="balance">-{parseFloat(flow.flowRate)/385802469135.802} <span className="currency">DAI /month</span></p>
          <p>To: {flow.receiver}</p>
          <button onClick={e => this.cancelRemittance(flow.receiver)} className="red">Terminate</button>
          <button onClick={this.showAmountInput(flow.receiver)} className="yellow">Change Amount</button>
        </div>
      )
    }) : [];

    // const inFlows = details.cfa.flows.inFlows;
    // const receiveStreams = inFlows.length ? inFlows.map(flow => {
    //   return (
    //     <div>
    //       <p className="balance">-{parseFloat(flow.flowRate)/385802469135.802} <span className="currency">DAI /month</span></p>
    //       <p>To: {flow.receiver}</p>
    //       <button onClick={e => this.cancelRemittance(flow.receiver)} className="red">End</button>
    //     </div>
    //   )
    // }) : [];

    this.setState({
      inFlows: details.cfa.flows.inFlows,
      outFlows: sentStreams,
      netFlow: `${parseFloat(details.cfa.netFlow) / 385802469135.802}`
    });
  }

  createUser = async (address) => {
    const user = await sf.user({
      token: this.state.daix,
      address: address
    });
    this.setState({ user });
    this.getUserDetails();
  }

  render() {
    function showModal(e) {
      const purpose = e.target.id;
      const modal = document.querySelector('#modal');
      const modalTitle = modal.querySelector('.modal-header').querySelector('h3');
      const footerBtn = modal.querySelector('.modal-footer').querySelector('button');
      modalTitle.innerText = purpose.charAt(0).toLocaleUpperCase() + purpose.slice(1) + ' Money';
      footerBtn.innerText = purpose.charAt(0).toLocaleUpperCase() + purpose.slice(1);
      modal.style.display = 'block';
      return <Modal name={purpose} />
    }
  
    return (
      <div>
        <Login setUser={this.createUser}/>
        <Modal getDetails={this.getUserDetails}/>
        <div id="dashboard">
          <div>
            <h1>Dashboard</h1>
            <div className="summary">
              <h3>Account Summary</h3>
              <p>Current Balance</p>
              <p className="balance">[Insert Amount] <span className="currency">DAI</span></p>
              <div className="summary-action-btngroup">
                <button 
                  type="button" 
                  className="blue" 
                  onClick={showModal}
                  id="deposit">
                    Deposit
                </button>
                <button 
                  type="button" 
                  className="yellow"
                  onClick={showModal}
                  id="withdraw">
                    Withdraw
                </button>
              </div>
            </div>
            <NetFlow flowRate={this.state.netFlow}/>
          </div>
          <div>
            <h3>Money Sent</h3>
            <button 
              type="button"
              className="blue"
              onClick={showModal}
              id="send">
                Create
            </button>
            {this.state.outFlows}
            {/* <button onClick={receiveRemittance}>Receive Money</button> */}
            {/* <button onClick={cancelRemittance} className="red">Cancel Flow</button> */}
          </div>
          <div>
            <h3>Money Received</h3>
            <button 
              type="button"
              className="yellow"
              onClick={showModal}
              id="request">
                Request
            </button>
            {this.state.inFlows}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
