import { createContext, useReducer } from "react";
import { AppReducer } from './AppReducer'
import { ethers } from "ethers";
import CONFIG from "./../abi/config.json"
import contractAbi from './../abi/abi.json'


const initialState = {
    account: null, 
    web3Provider: null
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

   

    return (
        <GlobalContext.Provider value={
            {
                ...state,
                delAccount, 
                addAccount,
                updateProvider            
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}