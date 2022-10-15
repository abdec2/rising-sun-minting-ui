import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import CONFIG from './../abi/config.json'
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: process.env.REACT_APP_INFURA_PROJECT_ID // required
        }
    }
};



const HeaderComponent = ({ setError, setErrMsg }) => {

    const { account, addAccount, delAccount, updateProvider, fetchAccountData } = useContext(GlobalContext);

    const connectWallet = async () => {
        try {
            const web3modal = new Web3Modal({
                providerOptions
            });
            const instance = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            updateProvider(provider)
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            addAccount({ id: address });
            const network = await provider.getNetwork();
            console.log(network)
            if (network.chainId !== CONFIG.NETWORK_ID) {
                setError(true)
                setErrMsg(`Contract is not deployed on current network. please choose ${CONFIG.NETWORK}`)
            } else {
                setError(false)
                setErrMsg('')
                fetchAccountData();
            }
        } catch (e) {
            console.log(e)
        }
        
    }
    useEffect(() => {
        fetchAccountData()
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                // addAccount({ id: accounts[0] })
                connectWallet()
            })
            window.ethereum.on('chainChanged', chainId => {
                window.location.reload();
            })
        }
    }, [account]);
    return (
        <div className="w-full flex items-center flex-col">
            {/* <div className="max-w-[300px] p-2">
                <img src={logo} alt="logo" />
            </div> */}
            <div className="mt-4 sm:mt-0">
                {account ? (
                    <div className="flex items-center flex-col">
                        <a
                            href={`${CONFIG.BLOCKCHAIN_EXPLORER}address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-[#142b86] hover:bg-yellow-300 rounded text-white">
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                        </a>
                        <button className="text-xs text-right hover:text-[#007bff]" onClick={() => delAccount()}>Disconnect</button>
                    </div>
                ) : (
                    <button className="px-6 py-2 bg-[#142b86] hover:bg-[#007bff] rounded text-white" onClick={() => connectWallet()}>Connect Wallet</button>
                )}
            </div>

        </div>
    );
};

export default HeaderComponent;
