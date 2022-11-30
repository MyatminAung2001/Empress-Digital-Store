export const InvoiceReducer = (state, action) => {
    switch (action.type) {
        // Invoice
        case "REQUEST_INVOICE":
            return {
                ...state,
                loading: true,
                error: ''
            }
        case "SUCCESS_INVOICE":
            return {
                ...state,
                loading: false,
                order: action.payload,
                error: ''
            }
        case "FAIL_INVOICE":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        // Payment
        case "REQUEST_PAYMENT": 
            return {
                ...state,
                loadingPayment: true
            }
        case "SUCCESS_PAYMENT": 
            return {
                ...state,
                loadingPayment: false,
                successPayment: true
            }
        case "FAIL_PAYMENT": 
            return {
                ...state,
                loadingPayment: false,
            }
        case "RESET_PAYMENT":
            return {
                ...state,
                loadingPayment: false,
                successPayment: false
            }
        // Delivery
        case "REQUEST_DELIVERY": 
            return {
                ...state,
                loadingDelivery: true
            }
        case "SUCCESS_DELIVERY": 
            return {
                ...state,
                loadingDelivery: false,
                successDelivery: true
            }
        case "FAIL_DELIVERY": 
            return {
                ...state,
                loadingDelivery: false,
            }
        case "RESET_DELIVERY":
            return {
                ...state,
                loadingDelivery: false,
                successDelivery: false
            }
        default:
            return state;
    }
};