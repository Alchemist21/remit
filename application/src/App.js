import React from "react";
import sf from "./util/superfluid";
import getAddress from "./util/wallet";

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
    <div>
      <h1>Hello World</h1>
      <button onClick={initSF}>Log In with MetaMask</button>
      <form id="sendRemit" onSubmit={sendRemittance}>
        <h3>Send Money</h3>
        <p>To: <input type="text" name="receiver" className="receiver" /></p>
        <p>Amount: <input type="text" name="amount" className="amount" /> DAI/month</p>
        <button type="submit">Send Money</button>
      </form>
      {/* <button onClick={receiveRemittance}>Receive Money</button> */}
      <button onClick={cancelRemittance}>Cancel Flow</button>
      <div>
        <NetFlow />
        <FlowItem />   
      </div>
    </div>
  );
}

export default App;
