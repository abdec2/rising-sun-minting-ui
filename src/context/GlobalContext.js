import { createContext, useReducer } from "react";
import { AppReducer } from './AppReducer'
import { ethers } from "ethers";
import CONFIG from "./../abi/config.json"
import contractAbi from './../abi/abi.json'


const initialState = {
    account: null, 
    web3Provider: null, 
    maxSupply: null, 
    totalSupply:null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)

    const delAccount = () => {
        dispatch({
            type: 'DELETE_ACCOUNT'
        })
    }

    const addAccount = (account) => {
        dispatch({
            type: 'ADD_ACCOUNT',
            payload: account.id
        })
    }

    const updateProvider = (provider) => {
        dispatch({
            type: 'UPDATE_PROVIDER',
            payload: provider
        })
    }

    const updateMaxSupply = (maxSupply) => {
        dispatch({
            type: 'UPDATE_MAX_SUPPLY',
            payload: maxSupply
        })
    }

    const updateTotalSupply = (totalSupply) => {
        dispatch({
            type: 'UPDATE_TOTAL_SUPPLY',
            payload: totalSupply
        })
    }

    const fetchBlockchainData = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_ENDPOINT)
            const contract = new ethers.Contract(CONFIG.NFT_CONTRACT, contractAbi, provider)
            const max_supply = await contract.maxSupply()
            const total_supply = await contract.totalSupply()
            updateMaxSupply(max_supply.toString())
            updateTotalSupply(total_supply.toString())

        } catch (e) {
            console.log(e)
        }
    }

   

    return (
        <GlobalContext.Provider value={
            {
                ...state,
                delAccount, 
                addAccount,
                updateProvider,
                updateMaxSupply,
                updateTotalSupply,
                fetchBlockchainData            
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}