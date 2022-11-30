export const ItemReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_FETCHING":
            return {
                ...state,
                loading: true,
            }
        case 'SUCCESS_FETCHING':
            return {
                ...state,
                loading: false,
                items: action.payload
            }
        case 'FAIL_FETCHING':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};