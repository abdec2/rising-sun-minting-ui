import { useEffect, useState, useContext } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import classNames from "classnames"
import useFetchNFT from "../../hooks/useFetchNFT"
import { ethers } from "ethers"
import CONFIG from './../../abi/config.json'
import contractABI from './../../abi/abi.json'
import nftAbi from './../../abi/nft.json'
import useStakedNFT from "../../hooks/useStakedNFT"
import LoadingComponent from "../../components/LoadingComponent"

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const style1 = {
    WebkitTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    MozTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    msTransform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    transform: "translate3d(0, 100px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(3deg) skew(0, 0)",
    opacity: 0
}

const style2 = {
    WebkitTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    MozTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    msTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    transform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    transformStyle: "preserve-3d",
    opacity: 1
}

const style3 = {
    WebkitTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    MozTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    msTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    transform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0deg) rotateZ(0) skew(0, 0)",
    transformStyle: "preserve-3d",
    opacity: 0
}

const Stake = () => {
    const { account, web3Provider } = useContext(GlobalContext)
    const [fetchNFTs, setFetchNfts] = useState(true)
    const nfts = useFetchNFT(account, fetchNFTs, setFetchNfts)
    const stNfts = useStakedNFT(web3Provider, account, fetchNFTs, setFetchNfts)
    const [selectedPeriod, setSelectedPeriod] = useState(0);
    const [loading, setLoading] = useState(false)
    const [selectedNFTs, setSelectedNFTs] = useState([])
    const [selectedStNFTs, setSelectedStNFTs] = useState([])


    console.log(stNfts)
    const checkBoxClick = (e, tokenId) => {
        const token_id = tokenId.toString();
        console.log(parseInt(token_id))
        const imageDisplay = e.target.querySelector('img').style.display;
        if (imageDisplay !== "none") {
            e.target.querySelector('img').style.display = "none"
            setSelectedNFTs([...selectedNFTs.filter(nft => nft !== parseInt(token_id))])
        } else {
            e.target.querySelector('img').style.display = "block"
            setSelectedNFTs([...selectedNFTs, parseInt(token_id)])
        }
    }


    const checkBoxClickStaked = (e, tokenId) => {
        const token_id = tokenId.toString();
        console.log(parseInt(token_id))
        const imageDisplay = e.target.querySelector('img').style.display;
        if (imageDisplay !== "none") {
            e.target.querySelector('img').style.display = "none"
            setSelectedStNFTs([...selectedStNFTs.filter(nft => nft !== parseInt(token_id))])
        } else {
            e.target.querySelector('img').style.display = "block"
            setSelectedStNFTs([...selectedStNFTs, parseInt(token_id)])
        }
    }

    const clearCheckboxes = () => {
        Array.from(document.querySelector('.stake-nfts').querySelectorAll('img.image-tick')).map(item => {
            item.style.display = "none"
        })
        Array.from(document.querySelector('.staked').querySelectorAll('img.image-tick')).map(item => {
            item.style.display = "none"
        })
    }

    const checkApproval = async () => {
        try {
            setLoading(true)
            const signer = web3Provider.getSigner()
            const nftContract = new ethers.Contract(CONFIG.NFT_CONTRACT, nftAbi, signer)
            const isApproval = await nftContract.isApprovedForAll(account, CONFIG.STAKING_CONTRACT_ADDRESS)
            if (isApproval) {
                stakeNfts()
            } else {
                approveNFT()
            }
        } catch (e) {
            setLoading(false)
            console.log(e)
        }
    }

    const approveNFT = async () => {
        try {
            setLoading(true)
            if (selectedNFTs.length === 0) {
                MySwal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: 'No nft selected to stake',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                })
                // alert('no nft selected to stake')
                setLoading(false)
                return;
            }
            const signer = web3Provider.getSigner()
            const nftContract = new ethers.Contract(CONFIG.NFT_CONTRACT, nftAbi, signer)
            const estimateGas = await nftContract.estimateGas.setApprovalForAll(CONFIG.STAKING_CONTRACT_ADDRESS, true)
            console.log(estimateGas.toString())
            const tx = {
                gasLimit: estimateGas.toString()
            }

            const approveTx = await nftContract.setApprovalForAll(CONFIG.STAKING_CONTRACT_ADDRESS, true, tx)
            await approveTx.wait()
            stakeNfts()

        } catch (e) {
            setLoading(false)
            console.log(e)
        }
    }

    const stakeNfts = async () => {
        try {
            setLoading(true)
            console.log(selectedNFTs)
            if (selectedNFTs.length === 0) {
                MySwal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: 'No nft selected to stake',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                })
                // alert('no nft selected to stake')
                setLoading(false)
                return;
            }
            const signer = web3Provider.getSigner()
            const stakingContract = new ethers.Contract(CONFIG.STAKING_CONTRACT_ADDRESS, contractABI, signer)
            const estimateGas = await stakingContract.estimateGas.stake(selectedNFTs, selectedPeriod)
            console.log(estimateGas.toString())
            const tx = {
                gasLimit: estimateGas.toString()
            }
            const stakingTx = await stakingContract.stake(selectedNFTs, selectedPeriod, tx)
            await stakingTx.wait()
            setFetchNfts(true)
            setLoading(false)
            MySwal.fire({
                position: 'top-end',
                title: 'success',
                text: 'Staking done',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            // alert('staking done')
            setSelectedNFTs([])
            clearCheckboxes()

        } catch (e) {
            setLoading(false)
            setSelectedNFTs([])
            clearCheckboxes()
            console.log(e)
        }

    }

    const unStake = async() => {
        try {
            setLoading(true)
            console.log(selectedStNFTs)
            if (selectedStNFTs.length === 0) {
                MySwal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: 'No nft selected to unstake',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                })
                // alert('no nft selected to unstake')
                setLoading(false)
                return;
            }
            const signer = web3Provider.getSigner()
            const stakingContract = new ethers.Contract(CONFIG.STAKING_CONTRACT_ADDRESS, contractABI, signer)
            const estimateGas = await stakingContract.estimateGas._unstakeMany(selectedStNFTs)
            console.log(estimateGas.toString())
            const tx = {
                gasLimit: estimateGas.toString()
            }
            const stakingTx = await stakingContract._unstakeMany(selectedStNFTs, tx)
            await stakingTx.wait()
            setFetchNfts(true)
            setLoading(false)
            MySwal.fire({
                position: 'top-end',
                title: 'success',
                text: 'Unstaking done',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            // alert('staking done')
            setSelectedStNFTs([])
            clearCheckboxes()

        } catch (e) {
            setLoading(false)
            setSelectedStNFTs([])
            clearCheckboxes()
            console.log(e)
        }
    }


    return (
        <>
            {loading && (<LoadingComponent />)}
            <section className="stake-and-earn-connected wf-section">
                <h2 data-w-id="638e3a75-1253-8367-0636-0a1cb9fe5d04" style={style1} className="main-title connected">STAKE and earn</h2>
                <div data-w-id="584c57f4-5178-0bf2-1a84-17853597b257" style={{ opacity: 0 }} className="tabs-holder">
                    <div data-w-id="002cffd5-e811-2ac9-941c-bdffec8f43b8" className="stake-tabs mynfts">my nfts</div>
                    <div data-w-id="d91d0851-0831-1435-1930-c2284add1765" className="stake-tabs stakes-tab">staked</div>
                </div>
                <div className="stake-nfts">
                    {nfts && nfts.ownedNfts.map((nft, i) => {
                        if (i < nfts.ownedNfts.length - 1) {
                            return (
                                <div key={i} className="nft-row">
                                    <div className="check-box-holder" onClick={e => checkBoxClick(e, nft.id.tokenId)}>
                                        <img src="images/tick.svg" style={{ pointerEvents: "none", display: "none" }} loading="lazy" alt="" className="image-tick" />
                                    </div>
                                    <div className="nft-image">
                                        <img src={nft.media[0].gateway} loading="lazy" style={style2} alt="" className="image-nft-stake" />
                                    </div>
                                    <div className="nft-id">{nft.title}</div>
                                    <div className="white-detail-line"></div>
                                </div>
                            )
                        } else {
                            return (
                                <div key={i} className="nft-row last">
                                    <div className="check-box-holder" onClick={e => checkBoxClick(e, nft.id.tokenId)}>
                                        <img src="images/tick.svg" style={{ pointerEvents: "none", display: "none" }} loading="lazy" alt="" className="image-tick" />
                                    </div>
                                    <div className="nft-image">
                                        <img src={nft.media[0].gateway} loading="lazy" width="76" alt="" />
                                    </div>
                                    <div className="nft-id">{nft.title}</div>
                                    <div className="white-detail-line"></div>
                                    <div className="white-detail-line bottom"></div>
                                </div>
                            )
                        }
                    })}
                    {
                        !nfts && (
                            <div className="nft-row last">
                                <p className="tw-text-white tw-mt-4">No Nfts in the wallet</p>
                            </div>
                        )
                    }
                </div>
                <div className="staked">
                    {stNfts && (
                        stNfts.map((nft, i) => {
                            if (i < stNfts.length - 1) {
                                return (
                                    <div key={i} className="nft-row">
                                        <div className="check-box-holder" onClick={e => checkBoxClickStaked(e, nft)}><img src="images/tick.svg" style={{ pointerEvents: "none", display: "none" }} loading="lazy" alt="" className="image-tick" /></div>
                                        <div className="nft-image"><img src="images/coffen.png" loading="lazy" width="55" alt="" className="image-16" /></div>
                                        <div className="nft-id">#{nft.toString()}</div>
                                        {/* <div className="staked-info">
                                            <div className="staked-for">STAKED FOR 30 days</div>
                                            <div className="earning">earning 5%</div>
                                        </div> */}
                                        <div className="white-detail-line"></div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={i} className="nft-row last">
                                        <div className="check-box-holder" onClick={e => checkBoxClickStaked(e, nft)}><img src="images/tick.svg" style={{ pointerEvents: "none", display: "none" }} loading="lazy" alt="" className="image-tick" /></div>
                                        <div className="nft-image"><img src="images/coffen.png" loading="lazy" width="55" alt="" /></div>
                                        <div className="nft-id">#{nft.toString()}</div>
                                        {/* <div className="staked-info">
                                            <div className="staked-for">STAKED FOR 30 days</div>
                                            <div className="earning">earning 5%</div>
                                        </div> */}
                                        <div className="white-detail-line"></div>
                                        <div className="white-detail-line bottom"></div>
                                    </div>
                                )
                            }
                        })
                    )}
                    {
                        stNfts.length === 0 && (
                            <div className="nft-row">
                                <p className="tw-text-white tw-mt-4">No Nfts staked</p>
                            </div>
                        )
                    }


                </div>
            </section>
            <footer data-w-id="1c6363c1-60a3-5681-8671-51603099bdca" style={{ opacity: 0 }} className="footer stake wf-section">
                <div className="stake-period-holder">
                    <div className="hero-line left"></div>
                    <div className="typo-stake-period">choose staking period in days</div>
                    <div className="button-days-holder">
                        <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 0 })} onClick={e => setSelectedPeriod(0)}>
                            <div className="typo-days">30</div>
                        </div>
                        <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 1 })} onClick={e => setSelectedPeriod(1)}>
                            <div className="typo-days">60</div>
                        </div>
                        <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 2 })} onClick={e => setSelectedPeriod(2)}>
                            <div className="typo-days">90</div>
                        </div>
                        <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 3 })} onClick={e => setSelectedPeriod(3)}>
                            <div className="typo-days">120</div>
                        </div>
                    </div>
                    <a data-w-id="e2b7a820-35a6-06f6-ec66-f0b4a902d6fc" style={{ opacity: 0 }} href="#" className="button-stake w-button" onClick={checkApproval}>STAKE MY NFTs</a>
                    <a data-w-id="a320d48d-3cfa-a880-0e58-e1b68e7768dc" style={{ opacity: 0 }} href="#" className="button-unstake w-button" onClick={unStake}>unstake</a>
                    <div className="hero-line"></div>
                </div>
                <div className="container footer-mobile w-container">
                    <div className="footer-madeby mobile">
                        <p className="typo-footer dark">Website by</p>
                        <a href="http://www.brdigitech.com/" className="typo-footer footer-link">brdigitech</a>
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
                        <a href="http://www.brdigitech.com/" target="_blank" className="footer-link typo-footer">brdigitech</a>
                    </div>
                </div>
            </footer>
            <div className="stake-period-holder mobile">
                <div className="hero-line left"></div>
                <div className="typo-stake-period">choose staking period in days</div>
                <div className="button-days-holder">
                    <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 0 })} onClick={e => setSelectedPeriod(0)}>
                        <div className="typo-days">30</div>
                    </div>
                    <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 1 })} onClick={e => setSelectedPeriod(1)}>
                        <div className="typo-days">60</div>
                    </div>
                    <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 2 })} onClick={e => setSelectedPeriod(2)}>
                        <div className="typo-days">90</div>
                    </div>
                    <div className={classNames('button-nav-small days', { 'active': selectedPeriod == 3 })} onClick={e => setSelectedPeriod(3)}>
                        <div className="typo-days">120</div>
                    </div>
                </div>
                <a data-w-id="e7892a29-86dd-8960-fe68-2193ff2d4865" style={{ opacity: 0 }} href="#" className="button-stake w-button" onClick={checkApproval}>STAKE MY NFTs</a>
                <a data-w-id="d1f62f78-ab19-2899-d55d-9a0983a461a4" style={{ opacity: 0 }} href="#" className="button-unstake w-button" onClick={unStake}>unstake</a>
                <div className="hero-line"></div>
            </div>
            <div className="footer-madeby mobile">
                <p className="typo-footer dark">Website by</p>
                <a href="http://www.brdigitech.com/" className="typo-footer footer-link">brdigitech</a>
            </div>
        </>
    )
}

export default Stake