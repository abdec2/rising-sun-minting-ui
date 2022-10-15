import { ethers } from 'ethers';
import { useContext, useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal';
import { GlobalContext } from '../context/GlobalContext';
import CONFIG from './../abi/config.json';
import CROWDSALE_ABI from './../abi/abi.json';
import tokenAbi from './../abi/token.json';
import WalletConnectProvider from "@walletconnect/web3-provider";
const crowdsaleAddress = CONFIG.ICO_CONTRACT_ADDRESS;

const providerOptions = {
    cacheProvider: false,
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            rpc: {
                137: "https://polygon-rpc.com",
            },
        }
    }
};

function Presale({setError, setErrMsg}) {
    const { account, tokenBalance, bnbBalance, web3Provider, fetchAccountData, delAccount,addAccount, updateProvider } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [recQty, setRecQty] = useState(0);

    const ethPrice = useRef(null);

    const addToken = async () => {
        const tokenAddress = CONFIG.TOKEN_CONTRACT;
        const tokenSymbol = CONFIG.TOKEN_SYMBOL;
        const tokenDecimals = CONFIG.TOKEN_DECIMAL;
        const tokenImage = '';

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const validatePrice = () => {
        if (parseInt(ethPrice.current.value) >= 500 && parseInt(ethPrice.current.value) <= 10000) {
            return true;
        }
        return false;
    }

    const approveUSDT = async (e) => {
        e.preventDefault();
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask');
                return
            }
            if (!account) {
                alert('Please connnect wallet');
                return;
            }
            if (!validatePrice()) {
                alert('Invalid Amount');
                return;
            }

            setLoading(true);
            const provider = web3Provider;
            const signer = provider.getSigner();
            const usdtContract = new ethers.Contract(CONFIG.USDT_ADDRESS, tokenAbi, signer);
            const price = ethers.utils.parseUnits(ethPrice.current.value, CONFIG.USDT_DECIMAL);
            const transaction = await usdtContract.approve(CONFIG.ICO_CONTRACT_ADDRESS, price, { from: account });
            await transaction.wait();
            buyToken(price, signer);
        } catch (e) {
            setLoading(false);
        }

    }

    const buyToken = async (price, signer) => {
        try {
            const contract = new ethers.Contract(crowdsaleAddress, CROWDSALE_ABI, signer);
            console.log(bnbBalance)
            console.log(ethPrice.current.value)
            if (parseFloat(bnbBalance) < parseFloat(ethPrice.current.value)) {
                setLoading(false);
                alert('Insufficient Balance');
                return;
            }

            const transaction = await contract.buyTokens(account, price.toString());
            await transaction.wait();
            fetchAccountData();

            setLoading(false);
            alert('purchase done');
        } catch (e) {
            setLoading(false);
        }
    }

    const calReceivedToken = () => {
        setRecQty(parseFloat(ethPrice.current.value) * 200000)
    }

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
        <div className="tw-my-28 tw-flex tw-items-center tw-flex-col md:tw-flex-row tw-justify-between tw-border tw-border-white tw-border-opacity-20  tw-shadow-xl tw-box-border">
            <div className="tw-text-center tw-w-full md:tw-w-1/2 tw-mb-4 md:tw-mb-0">
                <div className='tw-flex tw-flex-col tw-items-center'>
                    <div className='tw-w-full'>
                        <h1 className="tw-text-base sm:tw-text-xl tw-font-bold tw-uppercase tw-text-[#142b86]" >Initial Coin Offering</h1>
                        <h1 className="tw-text-2xl sm:tw-text-4xl tw-font-bold tw-uppercase tw-text-black" >DYOPS TOKEN</h1>
                        <div className='tw-w-4/5 md:tw-w-3/5 tw-mt-3 tw-px-12 tw-py-2 tw-bg-[#142b86] tw-text-white tw-rounded-2xl tw-font-bold tw-mx-auto'>1 USDT = 200,000 DYOPS</div>
                        {account && (
                            <p className='tw-text-sm tw-text-black tw-mt-4'>Your have purchased: {(tokenBalance) ? tokenBalance : 0} DYOPS</p>
                        )}
                        {/* <button className='mt-5 px-6 py-2 bg-[#142b86] text-white rounded font-bold hover:bg-[#007bff]' onClick={() => addToken()}>Add Token to your MetaMask</button> */}
                    </div>

                    <div className='tw-mt-10 tw-text-left '>
                        <h3 className=' tw-uppercase tw-text-sm tw-font-semibold tw-mb-2 tw-text-black'>Instructions:</h3>
                        <ul className='tw-text-sm tw-list-outside tw-list-disc tw-mb-3'>
                            <li className='tw-ml-4'>Connect your Polygon wallet</li>
                            <li className='tw-ml-4'>Minimum purchase allowed: 500 USDT</li>
                            <li className='tw-ml-4'>Maximum purchase allowed: 10000 USDT</li>
                        </ul>
                        <h3 className=' tw-uppercase tw-text-sm tw-font-semibold tw-mb-2 tw-text-black'>Token Lock</h3>
                        <ul className='tw-text-sm tw-list-outside tw-list-disc'>
                            <li className='tw-ml-4'>25% lock 90 days from the distribution date</li>
                            <li className='tw-ml-4'>25% lock 180 days from the distribution date</li>
                            <li className='tw-ml-4'>50% lock 90 days from the distribution date</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="tw-border tw-p-10  tw-border-white tw-border-opacity-30 tw-bg-[#142b86] tw-text-white tw-w-full md:tw-w-1/2">
                <div className='tw-mb-10'>
                    <div className='tw-flex tw-items-center tw-justify-around tw-space-x-2'>
                        <div className="polygon">
                            <div className='tw-bg-white tw-rounded-xl tw-flex tw-items-center tw-min-w-[160px] tw-justify-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" viewBox="0 0 1024 1024">
                                    <path fill="#8247E5" d="M681.469 402.456C669.189 395.312 653.224 395.312 639.716 402.456L543.928 457.228L478.842 492.949L383.055 547.721C370.774 554.865 354.81 554.865 341.301 547.721L265.162 504.856C252.882 497.712 244.286 484.614 244.286 470.326V385.786C244.286 371.498 251.654 358.4 265.162 351.256L340.073 309.581C352.353 302.437 368.318 302.437 381.827 309.581L456.737 351.256C469.018 358.4 477.614 371.498 477.614 385.786V440.558L542.7 403.647V348.874C542.7 334.586 535.332 321.488 521.824 314.344L383.055 235.758C370.774 228.614 354.81 228.614 341.301 235.758L200.076 314.344C186.567 321.488 179.199 334.586 179.199 348.874V507.237C179.199 521.526 186.567 534.623 200.076 541.767L341.301 620.354C353.582 627.498 369.546 627.498 383.055 620.354L478.842 566.772L543.928 529.86L639.716 476.279C651.996 469.135 667.961 469.135 681.469 476.279L756.38 517.954C768.66 525.098 777.257 538.195 777.257 552.484V637.023C777.257 651.312 769.888 664.409 756.38 671.554L681.469 714.419C669.189 721.563 653.224 721.563 639.716 714.419L564.805 672.744C552.525 665.6 543.928 652.502 543.928 638.214V583.442L478.842 620.354V675.126C478.842 689.414 486.21 702.512 499.719 709.656L640.944 788.242C653.224 795.386 669.189 795.386 682.697 788.242L823.922 709.656C836.203 702.512 844.799 689.414 844.799 675.126V516.763C844.799 502.474 837.431 489.377 823.922 482.233L681.469 402.456Z" />
                                </svg>
                                <p className='tw-text-base tw-font-medium tw-ml-1'>Polygon</p>
                            </div>
                        </div>
                        <div className="connectBtn">
                            {account ? (
                                <div className="tw-flex tw-items-center tw-flex-col">
                                    <button className="tw-px-6 tw-py-1 tw-w-40 tw-h-[35px] tw-rounded-xl tw-text-base tw-bg-white tw-text-black tw-font-medium tw-truncate hover:tw-bg-[#142b86] hover:tw-border hover:tw-border-white hover:tw-text-white focus:tw-outline-none" onClick={() => delAccount()}>Disconnect</button>
                                </div>
                            ) : (
                                <button className="tw-px-6 tw-py-1 tw-w-40 tw-h-[35px] tw-rounded-xl tw-text-base tw-bg-white tw-text-black tw-font-medium tw-truncate hover:tw-bg-[#142b86] hover:tw-border hover:tw-border-white hover:tw-text-white focus:tw-outline-none" onClick={() => connectWallet()}>Connect Wallet</button>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <form onSubmit={approveUSDT}>
                        <div className="tw-my-3">
                            <label className="tw-text-base tw-font-bold tw-text-white">Amount USDT</label>
                            <input ref={ethPrice} type="text" className="tw-w-full tw-h-12 tw-p-2 tw-text-black tw-text-xl focus:tw-outline-none tw-mt-1 tw-bg-white tw-border" required onChange={calReceivedToken} />
                            <div className='tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-2'>
                                <small>You will receive: {((recQty) ? recQty : 0) + ' ' + CONFIG.TOKEN_SYMBOL}</small>
                                <small>USDT: {(bnbBalance) ? bnbBalance : 0.00}</small>
                            </div>

                        </div>
                        <div className="tw-my-3">
                            <label className="tw-text-base tw-font-bold tw-text-white">Rate</label>
                            <input className="tw-w-full tw-h-12 tw-p-2 tw-text-xl focus:tw-outline-none tw-mt-1 tw-border tw-bg-white tw-text-black" type="text" value={CONFIG.RATE + " USDT"} disabled />
                        </div>

                        <div className="tw-mt-10">
                            <button disabled={loading} className="tw-w-full tw-py-2 tw-px-6 tw-uppercase tw-bg-white tw-font-bold tw-text-black tw-rounded-2xl hover:tw-bg-[#142b86] tw-border hover:tw-border-white hover:tw-text-white focus:tw-outline-none">{loading ? 'Transaction in process' : 'Buy'}</button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Presale;
