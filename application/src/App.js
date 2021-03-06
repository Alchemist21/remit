import React, { Component } from "react";
import sf from "./util/superfluid";
import Gun from "gun";

import "./Dashboard.css";
import NetFlow from "./components/Netflow";
import Modal from "./components/Modal";
import Login from "./components/Login";
import SendForm from "./components/SendForm";
import RequestForm from "./components/RequestForm";
import BalanceForm from "./components/BalanceForm";

class App extends Component {
  constructor(props) {
    super(props);
    this.gun = Gun();
    window.gun = this.gun;
    this.state = {
      errorMessage: '',
      isInitializing: false,
      isProcessing: false,
      user: '',
      daix: '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90',
      inFlows: [],
      outFlows: [],
      netFlow: 0,
      amount: '',
      formType: '',
      formId: '',
      username: '',
      currentBalance: 0
    }
  }

  cancelRemittance = async (receiver) => {
    const { user } = this.state;
    this.setState({ isProcessing: true });
    try {
      await user.flow({
        recipient: receiver,
        flowRate: '0'
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ isProcessing: false });
    this.getUserDetails();
  }

  updateRemittance = async (receiver) => {
    const { user, amount } = this.state;
    this.setState({ isProcessing: true });
    try {
      await user.flow({
        recipient: receiver,
        flowRate: amount // update flowRate with custom amount
      });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ isProcessing: false });
    this.getUserDetails();
  }

  getUserDetails = async () => {
    const { user } = this.state;
    const details = await user.details();
    console.log(details);
    const outFlows = details.cfa.flows.outFlows;
    const sentStreams = outFlows.length ? outFlows.map(flow => {
      return (
        <div>
          <div className="flowItem">
            <p className="balance">-{parseFloat(flow.flowRate)/385802469135.802} <span className="currency">DAI /month</span></p>
            <p className="flowItem-address">To: {`${flow.receiver.substr(0, 12)}...`}</p>
            <div className="spinner" hidden={!this.state.isProcessing} />
            <div className="flowItem-form">
              <form onSubmit={async (e) => {
                e.preventDefault();
                await this.updateRemittance(flow.receiver);
                const amount = e.target.querySelector('input[name="amount"]');
                amount.value = '';
              }} method="post">
                <input type="number" name="amount" onChange={e => this.setState({ amount: `${parseFloat(e.target.value) * 385802469135.802}` })} required/>
                <button type="submit" className="flowItem-change-btn">Change</button>
              </form>
              <button type="button" onClick={e => this.cancelRemittance(flow.receiver)} className="flowItem-terminate-btn">End</button>
            </div>
            <p style={{color: 'red', fontWeight: 'bold', fontSize: '1ch'}}>{this.state.errorMessage}</p>
          </div>
          <hr/>
        </div>
      )
    }) : 'None ongoing at the moment';

    const inFlows = details.cfa.flows.inFlows;
    const receiveStreams = inFlows.length ? inFlows.map(flow => {
      return (
        <div>
          <div className="flowItem inFlow">
            <div>
              <p className="balance">+{parseFloat(flow.flowRate)/385802469135.802} <span className="currency">DAI /month</span></p>
              <p className="flowItem-address">From: {`${flow.sender.substr(0, 12)}...`}</p>
            </div>
            <button onClick={e => this.cancelRemittance(flow.sender)} className="flowItem-terminate-btn">End</button>
          </div>
          <hr/>
        </div>
      )
    }) : 'None ongoing at the moment';

    this.setState({
      inFlows: receiveStreams,
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

    if (this.state.username === 'Paul') return this.setState({ currentBalance: 995.63 });
    if (this.state.username === 'Bob') return this.setState({ currentBalance: 103.82 });
    if (this.state.username === 'Alice') return this.setState({ currentBalance: 700.08 });
  }

  showUserName = (name) => {
    this.setState({ username: name });
  }

  getUserConnections = async (address) => {
    const user = this.gun.get(`user/${address}`);
    const results = [];

    await user.get('connections').map((data, key) => {
      results.push({alias: data.alias, address: data.address});
    });

    console.log(results);
    return results;
  }

  showModal = (e) => {
    const { id } = e.target;
    const modal = document.querySelector('#modal');
    const modalTitle = modal.querySelector('.modal-header').querySelector('h3');
    modalTitle.innerText = id.charAt(0).toLocaleUpperCase() + id.slice(1) + ' Money';
    modal.style.display = 'block';
    const form = () => {
      if (id === 'send') return (<SendForm getDetails={this.getUserDetails} getConnections={this.getUserConnections} />);
      if (id === 'request') return (<RequestForm getConnections={this.getUserConnections} />);
      if (id === 'deposit') return (<BalanceForm address={this.state.user.address} formId={'depositForm'} transferType={'From:'} btnColor={'blue'} btnName={'Deposit'} 
      note={'Please note that tokens must be deposited in order to be wrapped with the functionality that allows your remittances to be streamed continuously to your other desired parties.'} />);
      if (id === 'withdraw') return (<BalanceForm address={this.state.user.address} formId={'withdrawForm'} transferType={'To:'} btnColor={'yellow'} btnName={'Withdraw'} 
      note={'Please make sure your balance will still have enough tokens after withdrawal to sufficiently cover any remittances being sent. Payments do not stop until you manually stop them.'} />);
    }
    const type = form();
    this.setState({ formType: type, formId: id });
  }

  render() {
    return (
      <div>
        <Login setUser={this.createUser} showUserName={this.showUserName} />
        <Modal formType={this.state.formType} formId={this.state.formId} />
        <div id="dashboard">
          <div>
            <h1>{this.state.username}'s Dashboard</h1>
            <div className="column-box">
              <div className="summary">
                <h3 className="summary-title">Account Summary</h3>
                <hr />
                <NetFlow flowRate={this.state.netFlow}/>
                <h3>Current Balance</h3>
                <p className="balance">{this.state.currentBalance} <span className="currency">DAI</span></p>
                <div className="summary-action-btngroup">
                  <button 
                    type="button" 
                    className="blue" 
                    onClick={this.showModal}
                    id="deposit">
                      Deposit
                  </button>
                  <button 
                    type="button" 
                    className="yellow"
                    onClick={this.showModal}
                    id="withdraw">
                      Withdraw
                  </button>
              </div>
              </div>
            </div>
          </div>
          <div className="column-box">
            <div className="summary">
              <div className="flow-header">
                <h3 className="summary-title">Money Sent</h3>
                <button 
                  type="button"
                  className="blue"
                  onClick={this.showModal}
                  id="send">
                    + Create
                </button>
              </div>
              <hr/>
              {this.state.outFlows}
            </div>
          </div>
          <div className="column-box">
            <div className="summary">
              <div className="flow-header">
                <h3 className="summary-title">Money Received</h3>
                <button 
                  type="button"
                  className="yellow"
                  onClick={this.showModal}
                  id="request">
                    + Request
                </button>
              </div>
              <hr/>
              {this.state.inFlows}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
