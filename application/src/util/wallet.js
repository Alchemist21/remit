async function getAddress() {
    const walletAddress = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [
            {
                eth_accounts: {}
            }
        ]
    });
    const userAddress = walletAddress[0];
    console.log(userAddress);
    return userAddress;
}

export default getAddress;