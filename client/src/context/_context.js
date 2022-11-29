import { createContext, useReducer } from "react";

import { reducer } from "./_reducer";

const INITIAL_STATE = {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    cart: {
        cartItems: JSON.parse(localStorage.getItem('cart')) || [],
        deliveryAddress: JSON.parse(localStorage.getItem('address')) || {},
        paymentMethod: localStorage.getItem('paymentMethod') || ''
    }
};

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    const value = {
        state,
        dispatch
    };

    return (
        <Context.Provider value={value}>
            { children }
        </Context.Provider>
    )
}