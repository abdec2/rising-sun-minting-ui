import { useEffect, useState, useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import classNames from "classnames"
import { ethers } from "ethers"
import CONFIG from '../../abi/config.json'
import contractABI from '../../abi/abi.json'
import LoadingComponent from "../../components/LoadingComponent"

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useCallback } from "react"

const MySwal = withReactContent(Swal)

const style1 = {
    WebkitTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    MozTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    msTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    transform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    opacity: 0
}

const Mint = () => {
    const { account, web3Provider, fetchBlockchainData, totalSupply, maxSupply } = useContext(GlobalContext)
    const [mintAmount, setMintAmount] = useState(1);
    const [loading, setLoading] = useState(false)
    const [cost, setCost] = useState(0);
    const [pCost, setPCost] = useState(0);
    const [isPresale, setIsPresale] = useState(true)

    const decrement = () => {
        if (mintAmount > 1) {
            setMintAmount(mintAmount - 1)
        }
    }

    const increment = () => {
        if (mintAmount < 15) {
            setMintAmount(mintAmount + 1)
        }
    }

    const loadBlockChainData = async () => {
        const contract = new ethers.Contract(CONFIG.NFT_CONTRACT, contractABI, web3Provider)
        const costt = await contract.cost()
        const preCost = await contract.presale_price()
        const presale = await contract.presale();
        setCost(ethers.utils.formatEther(costt))
        setPCost(ethers.utils.formatEther(preCost))
        setIsPresale(presale)

        console.log(ethers.utils.formatEther(costt))
        console.log(ethers.utils.formatEther(preCost))
        console.log(presale)

    }

    const handleMint = async () => {
        try {
            setLoading(true)
            const nftPrice = isPresale ? pCost : cost
            const netPrice = parseFloat(nftPrice) * mintAmount
            const totCost = ethers.utils.parseEther(netPrice.toString())
            const signer = web3Provider.getSigner()
            const contract = new ethers.Contract(CONFIG.NFT_CONTRACT, contractABI, signer)
            console.log(netPrice.toString())
            console.log(totCost.toString())
            const estimateGas = await contract.estimateGas.mint(mintAmount, {value: totCost.toString(), from: account})
            const txObj = {
                gasLimit: estimateGas.toString(), 
                from: account, 
                value: totCost.toString()
            }
            const tx = await contract.mint(mintAmount, txObj)
            await tx.wait()
            setLoading(false)
            fetchBlockchainData()
            Swal.fire({
                icon: 'success',
                title: 'Congratulations!',
                text: 'NFTs have been minted successfully'
            })
            console.log(tx)
        } catch (e) {
            setLoading(false)
            console.log(e)
            Swal.fire({
                icon: 'error',
                title: 'Oops..',
                text: 'Something went wrong'
            })
        }
    }

    useEffect(()=>{
        loadBlockChainData()
    }, [account]);

    return (
        <>
            {loading && (<LoadingComponent />)}
            <section className="mint-shadow-descendants wf-section">
                <h1 data-w-id="305b0432-788c-4bf6-4b65-0cab51909f88" style={style1} className="main-title mint">MINT Shadow Descendants</h1>
                <div className="mint-content-holder">
                    <div data-w-id="1e9f008d-3b16-26ec-972f-28ec3f78cf8b" style={{ opacity: '0' }} className="typo-number-button tw-cursor-default tw-text-[#f6e7c9]">
                        {totalSupply ? totalSupply : 0} NFTs Minted Out of {maxSupply ? maxSupply : 0}
                    </div>
                    <div data-w-id="1e9f008d-3b16-26ec-972f-28ec3f78cf8b" style={{ opacity: '0' }} className="typo-howmany">How many NFTS you want to mint?</div>
                    <div className="button-holder numbers">
                        <div data-w-id="19c5a547-2677-698c-be60-eea6a54e999a" style={{ opacity: '0' }} className={classNames('button-nav-small numbers-mint', {})} onClick={decrement}>
                            <div className="typo-number-button">
                                <svg width={20} fill="#f6e7c9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                            </div>
                        </div>
                        <div data-w-id="d9e09c1f-e5b1-b0d7-b960-03d7f0605b55" style={{ opacity: '0' }} className={classNames('tw-text-[#f6e7c9] tw-mx-4 ', {})} >
                            <div className="typo-number-button tw-cursor-default">{mintAmount}</div>
                        </div>
                        <div data-w-id="0517ba78-cebe-58f2-11c0-289f84f512a6" style={{ opacity: '0' }} className={classNames('button-nav-small numbers-mint', { })} onClick={increment}>
                            <div className="typo-number-button">
                                <svg width={20} fill="#f6e7c9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                            </div>
                        </div>
                        {/* <div data-w-id="822ee4ad-6a63-ffc7-c459-0e8df7696441" style={{ opacity: '0' }} className={classNames('button-nav-small numbers-mint', { 'active': active == 4 })} onClick={e => setActive(4)}>
                            <div className="typo-number-button">4</div>
                        </div> */}
                    </div>
                    <a data-w-id="f418f5d1-e7c5-d16d-eefd-a115a7d70050" style={{ opacity: '0' }} href="#" className="primary-button mint w-button" onClick={handleMint}>mint</a>
                    <div data-w-id="0add2313-30fb-4bdb-9f4c-6787d2fe5dae" style={{ opacity: '0' }} className="typo-cost">Cost: {isPresale ? pCost : cost} ETH + gas fee</div>
                </div>
                <div className="section-background mint"></div>
                <div data-w-id="cc1df44a-b13f-48e3-f942-4ee0428f5674" style={{ opacity: '0' }} className="footer-madeby mobile mint">
                    <p className="typo-footer dark">Website by</p>
                    <a href="http://www.brdigitech.com/" className="typo-footer footer-link">BRDigitech</a>
                </div>
            </section>
            <div data-w-id="8692c7b8-d50e-ed60-cdab-38fe5726791a" style={{ opacity: '0' }} className="footer wf-section">
                <footer className="container footer-mobile w-container">
                    <div className="footer-madeby mobile">
                        <p className="typo-footer dark">Website by</p>
                        <a href="http://www.brdigitech.com/" className="typo-footer footer-link">BRDigitech</a>
                    </div>
                    <div className="footer-copyright">
                        <p className="typo-footer hidden">PRIVACY POLICY — TERMS OF USE</p>
                        <p className="typo-footer dark">©2022 - Rising Sun.<br />All rights reserved.</p>
                    </div>
                    <div className="footer-links">
                        <p className="typo-footer dark">FOLLOW US AND JOIN THE CLUB</p>
                        <div className="footer-link-holder">
                            <a href="https://twitter.com/RisingSunCoin" className="footer-link typo-footer">TWITTER</a>
                            <div className="text-block">-</div>
                            <a href="https://instagram.com/RisingSunCoin" className="footer-link typo-footer">INSTAGRAM</a>
                            <div className="text-block">-</div>
                            <a href="https://Facebook.com/RisingSunCoin" className="footer-link typo-footer">FACEBOOK</a>
                            <div className="text-block">-</div>
                            <a href="https://opensea.io/David907" className="footer-link typo-footer">OPENSEA</a>
                            <div className="text-block">-</div>
                            <a href="https://t.me/RISINGSUNCOIN" className="footer-link typo-footer">TELEGRAM</a>
                            <div className="text-block">-</div>
                            <a href="https://docs.google.com/forms/d/1wDtI0fs7tfZjWGVoO790_Xk7FiFhDMEGXvW-GqSMhhw/viewform?edit_requested=true" className="footer-link typo-footer">Refer a friend</a>
                        </div>
                    </div>
                    <div className="footer-madeby">
                        <p className="typo-footer dark">Website by</p>
                        <a href="http://www.brdigitech.com/" target="_blank" className="footer-link typo-footer">BRDigitech</a>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Mint