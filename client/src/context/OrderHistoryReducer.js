export const OrderHistoryReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_ORDER_HISTORY":
            return {
                ...state,
                loading: true,
            }
        case 'SUCCESS_ORDER_HISTORY':
            return {
                ...state,
                loading: false,
                orders: action.payload,
            }
        case 'FAIL_ORDER_HISTORY':
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    };
};