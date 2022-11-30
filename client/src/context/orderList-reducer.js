export const OrderListReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_ORDER_LIST":
            return {
                ...state,
                loading: true
            }
        case "SUCCESS_ORDER_LIST":
            return {
                ...state,
                loading: false,
                ordersList: action.payload.ordersList,
                page: action.payload.page,
                pages: action.payload.pages
            }
        case "FAIL_ORDER_LIST":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case "REQUEST_DELETE_ORDER":
            return {
                ...state,
                loadingDelete: true,
                successDelete: false
            }
        case "SUCCESS_DELETE_ORDER":
            return {
                ...state,
                loadingDelete: false,
                successDelete: true
            }
        case "FAIL_DELETE_ORDER":
            return {
                ...state,
                loadingDelete: false
            }
        case "RESET_DELETE":
            return {
                ...state,
                loadingDelete: false,
                successDelete: false
            }
        default:
            return state;
    }
};