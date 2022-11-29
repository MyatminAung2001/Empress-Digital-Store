export const ItemEditReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_ITEM_EDIT":
            return {
                ...state,
                loading: true
            }
        case "SUCCESS_ITEM_EDIT":
            return {
                ...state,
                loading: false
            }
        case "FAIL_ITEM_EDIT":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case "REQUEST_ITEM_UPDATE":
            return {
                ...state,
                loadingUpdate: true
            }
        case "SUCCESS_ITEM_UPDATE":
            return {
                ...state,
                loadingUpdate: false
            }
        case "FAIL_UPDATE_ITEM":
            return {
                ...state,
                loadingUpdate: false
            }
        case "REQUEST_UPLOAD":
            return {
                ...state,
                loadingUpload: true,
                errorUpload:''
            }
        case "SUCCESS_UPLOAD":
            return {
                ...state,
                loadingUpload: false,
                errorUpload: ''
            }
        case "FAIL_UPLOAD":
            return {
                ...state,
                loadingUpload: false,
                errorUpload: action.payload
            }
        default: 
            return state;
    }
};