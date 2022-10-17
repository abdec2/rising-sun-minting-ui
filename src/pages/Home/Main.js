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
    <section className="mint-shadow-descendants wf-section">
      <h2 data-w-id="931fd848-333c-25ef-5654-578b6d0e046e" style={styleobj} className="main-title mint1">MINT Shadow Descendants</h2>
      <div className="mint-content-holder-wallet">
        <p data-w-id="4c251f4d-2764-9940-583e-fafc3a2006ef" style={{ opacity: 0 }} className="typo-mint-content">Click at the button below to connect your wallet. At the next step click MINT and the amount you want to mint. The minting dialog allows you to mint up to 15 Shadow Descendants at a time.</p>
        <a data-w-id="ecf6149e-7bcd-dc8c-c08f-f30f2dcfd42e" style={{ opacity: 0 }} href="#" className="primary-button w-button" onClick={connectWallet}>CONNECT WALLET</a>
      </div>

      <div className="section-background mint"></div>
    </section>
    
  )
}

export default Main