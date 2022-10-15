import { useEffect, useState } from "react";
import CONFIG from './../abi/config.json'

const useFetchNFT = (account, fetchNFTs, setFetchNFTs) => {
    const [nft, setNFT] = useState(null)
    const fetchWalletNFTs = async (account) => {
        try {
            if(account) {
                const endpoint = process.env.REACT_APP_ALCHEMY_ENDPOINT
                const nfts = await fetch(`${endpoint}/getNFTs/?owner=${account}&contractAddresses[]=${CONFIG.NFT_CONTRACT}` ,{
                    method: 'GET', 
                    redirect: 'follow'
                })
                const response = await nfts.json();
                setNFT(response)
                setFetchNFTs(false)
            }
          
        } catch(e) {
            console.log(e)
            setFetchNFTs(false)
        }
    }

    useEffect(()=>{
        if (fetchNFTs) {
            fetchWalletNFTs(account)
        }
    }, [account, fetchNFTs])

    return nft

}

export default useFetchNFT