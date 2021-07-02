import React, { Component } from 'react';
import sf from "../util/superfluid";

class Login extends Component {
    state = {
        isInitializing: false,
        errorMessage: ''
    }

    onClick = async () => {
        const modal = document.querySelector('#login')
        this.setState({ isInitializing: true });
        try {
            await sf.initialize();
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({ isInitializing: false });
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
                    </div>
                    <div className="modal-footer">
                        <button className="blue" onClick={this.onClick}>Connect to MetaMask</button>
                    </div>
                </div>
                <div className="spinner" hidden={!this.state.isInitializing}/>
            </div>
        )
    }
}

export default Login;