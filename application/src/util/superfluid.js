import SuperfluidSDK from "@superfluid-finance/js-sdk";
import Web3 from 'web3';

const sf = new SuperfluidSDK.Framework({
    web3: new Web3(window.ethereum),
    tokens: ["fDAI"]
});

export default sf;