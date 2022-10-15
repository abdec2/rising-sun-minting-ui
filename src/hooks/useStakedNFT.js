import { ethers } from "ethers"
import { useEffect } from "react"
import CONFIG from './../abi/config.json'
import contractABI from './../abi/abi.json'
import { useState } from "react"

const useStakedNFT = (provider, account, fetchNFTs, setFetchNfts) => {
    const [stakedTokens, setStakedTokens] = useState([])
    const loadStakedNFT = async() => {
            const signer = provider.getSigner()
            const stakingContract = new ethers.Contract(CONFIG.STAKING_CONTRACT_ADDRESS, contractABI, signer)
            const staked_Tokens = await stakingContract.getUserStakedTokens(account)
            setStakedTokens(staked_Tokens)
            setFetchNfts(false)
    }
 
    useEffect(()=>{
        if(fetchNFTs) {
            loadStakedNFT()
        }
        
    }, [account, fetchNFTs])

    return stakedTokens

}

export default useStakedNFT