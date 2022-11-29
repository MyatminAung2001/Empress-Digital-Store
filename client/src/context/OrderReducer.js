export const OrderReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_ORDER":
            return {
                ...state,
                loading: true,
            }
        case 'SUCCESS_ORDER':
            return {
                ...state,
                loading: false,
            }
        case 'FAIL_ORDER':
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    };
};