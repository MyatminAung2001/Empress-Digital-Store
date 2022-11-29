export const ItemDetailReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_FETCHING":
            return {
                ...state,
                loading: true,
            }
        case "SUCCESS_FETCHING":
            return {
                ...state,
                loading: false,
                item: action.payload
            }
        case "FAIL_FETCHING":
            return {
                ...state, 
                loading: false, 
                error: action.payload 
            } 
        case "REFRESH_ITEM":
            return {
                ...state,
                item: action.payload
            }
        case "REQUEST_REVIEW": 
            return {
                ...state,
                loadingReview: true
            }
        case "SUCCESS_REVIEW":
            return {
                ...state,
                loadingReview: false
            }
        case "FAIL_REVIEW":
            return {
                ...state,
                loadingReview: false
            }
        default: 
            return state; 
    };
};