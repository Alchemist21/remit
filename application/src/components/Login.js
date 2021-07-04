import React, { Component } from 'react';
import sf from "../util/superfluid";
import getAddress from "../util/wallet";
import Gun from 'gun';

class Login extends Component {
    constructor() {
        super();
        this.gun = Gun();
        window.gun = this.gun;
    }
    
    state = {
        isInitializing: false,
        errorMessage: ''
    }

    onClick = async () => {
        const modal = document.querySelector('#login');
        this.setState({ isInitializing: true });
        const address = await getAddress();
        try {
            await sf.initialize();
            this.props.setUser(address);
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({ isInitializing: false });
        let userName;
        this.gun.get('user/' + address).get('alias').once((data, key) => {
            userName = data;
        });
        console.log(userName);
        if (!userName) {
            const connectBtn = modal.querySelector('#connectWallet');
            const nameInput = modal.querySelector('input');
            const createBtn = modal.querySelector('#submitName');
            const description = modal.querySelector('p');
            description.innerText = 'Please provide an alias for your wallet address.';
            connectBtn.hidden = true;
            nameInput.hidden = false;
            createBtn.hidden = false;
        } else {
            this.props.showUserName(userName);
            return modal.style.display = 'none';
        }
    }

    onChange = () => {
        const modal = document.querySelector('#login');
        const nameInput = modal.querySelector('input');
        const createBtn = modal.querySelector('#submitName');
        if (nameInput.value) {
            return createBtn.disabled = false;
        }
        return createBtn.disabled = true;
    }

    submitName = async () => {
        const modal = document.querySelector('#login');
        const nameInput = modal.querySelector('input');
        const address = await getAddress();
        this.gun.get('user/' + address).put({
            alias: nameInput.value
        });
        this.props.showUserName(nameInput.value);
        return modal.style.display = 'none';
    }

    render() {
        return (
            <div id="login" className="modal sticky" style={{display: 'block'}}>
                <div className="modal-box">
                    <div className="modal-header">
                        <h1>Welcome!</h1>
                    </div>
                    <div className="modal-body">
                        <p>Please connect to your MetaMask wallet to continue.</p>
                        <input type="text" onChange={this.onChange} placeholder="e.g. Adam" hidden />
                    </div>
                    <div className="modal-footer">
                        <button className="blue" id="connectWallet" onClick={this.onClick}>Connect to MetaMask</button>
                        <button className="blue" id="submitName" onClick={this.submitName} hidden>Continue</button>
                    </div>
                </div>
                <div className="spinner" hidden={!this.state.isInitializing}/>
            </div>
        )
    }
}

export default Login;