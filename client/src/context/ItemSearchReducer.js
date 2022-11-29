export const ItemSearchReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_SEARCH_ITEM":
            return {
                ...state,
                loading: true
            }
        case "SUCCESS_SEARCH_ITEM":
            return {
                ...state,
                items: action.payload.items,
                page: action.payload.page,
                pages: action.payload.pages,
                countItems: action.payload.countItems,
                loading: false,
            }
        case "FAIL_SEARCH_ITEM":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};