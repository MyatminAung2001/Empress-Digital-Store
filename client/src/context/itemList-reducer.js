export const ItemListReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_ITEM_LIST":
            return {
                ...state,
                loading: true
            }
        case "SUCCESS_ITEM_LIST":
            return {
                ...state,
                loading: false,
                itemList: action.payload.itemList,
                page: action.payload.page,
                pages: action.payload.pages
            }
        case "FAIL_ITEM_LIST":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case "REQUEST_CREATE_ITEM":
            return {
                ...state,
                loadingCreate: true,
            }
        case "SUCCESS_CREATE_ITEM":
            return {
                ...state,
                loadingCreate: false
            }
        case "FAIL_CREATE_ITEM":
            return {
                ...state,
                loadingCreate: false
            }
        case "REQUEST_DELETE_ITEM":
            return {
                ...state,
                loadingDelete: true,
                successDelete: false
            }
        case "SUCCESS_DELETE_ITEM":
            return {
                ...state,
                loadingDelete: false,
                successDelete: true
            }
        case "FAIL_DELETE_ITEM":
            return {
                ...state,
                loadingDelete: false,
                successDelete: false
            }
        case "RESET_DELETE_ITEM":
            return {
                ...state,
                loadingDelete: false,
                successDelete: false
            }
        default:
            return state;
    }
};