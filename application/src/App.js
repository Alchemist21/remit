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
      daix: '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90'
    }
  }

  createUser = async (address) => {
    // const walletAddress = await getAddress();
    const user = await sf.user({
      token: this.state.daix,
      address: address
    });
    this.setState({ user });
    const details = await user.details();
    console.log(details);
  }

  render() {
    let amount;
    let daix;
    let user;
    let otherUser;
    
    daix = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';
    otherUser = ''; // Insert a MetaMask account address
  
    async function cancelRemittance() {
      await sf.cfa.deleteFlow({
        superToken: daix,
        sender: user,
        receiver: otherUser,
        by: user
      });
    }
  
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
        <Modal />
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
            <NetFlow />
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
            {/* <button onClick={receiveRemittance}>Receive Money</button> */}
            <button onClick={cancelRemittance} className="red">Cancel Flow</button>
          </div>
          <div>
            <h3>Money Received</h3>
            <FlowItem />   
          </div>
        </div>
      </div>
    );
  }
}

export default App;
