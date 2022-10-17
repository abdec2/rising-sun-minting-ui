export const AppReducer = (state, action) => {
    switch(action.type) {
        case 'DELETE_ACCOUNT':
            return {
                ...state,
                account: null
            }
        case 'ADD_ACCOUNT':
            return {
                ...state,
                account: action.payload
            }

        case 'UPDATE_PROVIDER':
            return {
                ...state,
                web3Provider: action.payload
            }

        case 'UPDATE_MAX_SUPPLY':
            return {
                ...state,
                maxSupply: action.payload
            }
        case 'UPDATE_TOTAL_SUPPLY':
            return {
                ...state,
                totalSupply: action.payload
            }
        
        default:
            return state;
    };
}