import React from "react";
import sf from "./util/superfluid";
import getAddress from "./util/wallet";

import "./Dashboard.css";
import NetFlow from "./components/Netflow";
import FlowItem from "./components/FlowItem";

function App() {
  let amount;
  let daix;
  let user;
  let otherUser;
  
  daix = '0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90';
  otherUser = ''; // Insert a MetaMask account address

  async function initSF() {
    await sf.initialize();
    user = getAddress();
  }

  async function sendRemittance(e) {
    e.preventDefault();
    const receiver = document.querySelector('#sendRemit').querySelector('.receiver');
    const inputAmount = document.querySelector('#sendRemit').querySelector('.amount');
    otherUser = receiver.value;
    amount = `${parseFloat(inputAmount.value) * 385802469135.802}`;
    await sf.cfa.createFlow({
      superToken: daix,
      sender: user,
      receiver: otherUser,
      flowRate: amount
    });
    receiver.value = '';
    inputAmount.value = '';
  }

  async function cancelRemittance() {
    await sf.cfa.deleteFlow({
      superToken: daix,
      sender: user,
      receiver: otherUser,
      by: user
    });
  }

  return (
    <div id="dashboard">
      <div>
        <h1>Welcome!</h1>
        <button onClick={initSF}>Log In with MetaMask</button>
        <div className="summary">
          <h3>Account Summary</h3>
          <p>Current Balance</p>
          <p className="balance">[Insert Amount] <span className="currency">DAI</span></p>
        </div>
        <NetFlow />
      </div>
      <div>
        <h3>Money Sent</h3>
        <form id="sendRemit" onSubmit={sendRemittance}>
          <p>Send Money</p>
          <p>To: <input type="text" name="receiver" className="receiver" /></p>
          <p>Amount: <input type="text" name="amount" className="amount" /> DAI/month</p>
          <button type="submit">Send Money</button>
        </form>
        {/* <button onClick={receiveRemittance}>Receive Money</button> */}
        <button onClick={cancelRemittance}>Cancel Flow</button>
      </div>
      <div>
        <h3>Money Received</h3>
        <FlowItem />   
      </div>
    </div>
  );
}

export default App;
