export const reducer = (state, action) => {
    switch (action.type) {
        // Auth
        case "REQUEST_LOGIN": {
            return {
                ...state,
                userInfo: action.payload
            }
        }
        case "LOGOUT": {
            return {
                ...state,
                userInfo: null,
                cart: {
                    cartItems: [],
                    deliveryAddress: {},
                    paymentMethod: '',
                }
            }
        }
        // Cart
        case "ADD_TO_CART": {
            const newItem = action.payload;

            const existingItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            );

            const cartItems = existingItem
                ? state.cart.cartItems.map((item) => item._id === existingItem._id ? newItem : item)
                : [...state.cart.cartItems, newItem]
            
            localStorage.setItem('cart', JSON.stringify(cartItems));

            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItems
                }
            }
        }
        case "REMOVE_FROM_CART": {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
            
            localStorage.setItem('cart', JSON.stringify(cartItems));
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItems
                }
            }
        }
        case "CLEAR_CART": {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItems: []
                }
            }
        }
        // Delivery Address
        case "SAVE_DELIVERY_ADDRESS": {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    deliveryAddress: action.payload
                }
            }
        }
        // Payment Method
        case "SAVE_PAYMENT_METHOD": {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    paymentMethod: action.payload
                }
            }
        }
        default:
            return state;
    }
};