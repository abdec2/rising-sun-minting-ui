import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { GlobalContext } from '../../context/GlobalContext';
import CONFIG from './../../abi/config.json';
import contractAbi from './../../abi/abi.json';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useContext, useEffect } from 'react';


const providerOptions = {
  cacheProvider: false,
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        5: process.env.REACT_APP_ALCHEMY_ENDPOINT,
      },
    }
  }
};

const styleobj = {
  WebkitTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
  msTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
  transform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
  opacity: 0
}

const Main = ({ setError, setErrMsg }) => {
  const { account, addAccount, updateProvider } = useContext(GlobalContext);

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
      if (network.chainId !== CONFIG.NETWORK_ID) {
        setError(true)
        setErrMsg(`Contract is not deployed on current network. please choose ${CONFIG.NETWORK}`)
      } else {
        setError(false)
        setErrMsg('')
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
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
    <section className="stake-and-earn wf-section">
      <h2 data-w-id="dd94e943-0d2f-0166-be77-07d29f9437fd" style={styleobj} className="main-title stake-title main-h2-customStyle">STAKE and earn</h2>
      <div className="stake-content">
        <p data-w-id="f70c0a51-08da-0411-b870-daee4d757f7e" style={{ opacity: 0 }} className="typo-mint-content">You can buy ETH directly through Metamask or you can transfer some from another wallet or crypto exchange.</p>
        <a data-w-id="50077320-d150-c3b1-99d4-af4e6fb8fa39" style={{ opacity: 0 }} href="#" className="primary-button w-button" onClick={connectWallet}>CONNECT WALLET</a>
      </div>

    </section>
  )
}

export default Main