export const UserListReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_USER_LIST":
            return {
                ...state,
                loading: true,
            }
        case "SUCCESS_USER_LIST":
            return {
                ...state,
                loading: false,
                usersList: action.payload.usersList,
                page: action.payload.page,
                pages: action.payload.pages
            }
        case "FAIL_USER_LIST":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case "REQUEST_DELETE_USER":
            return {
                ...state,
                loadingDelete: true,
                successDelete: false
            }
        case "SUCCESS_DELETE_USER":
            return {
                ...state,
                loadingDelete: false,
                successDelete: true
            }
        case "FAIL_DELETE_USER":
            return {
                ...state,
                loadingDelete: false,
            }
        case "RESET_DELETE_USER":
            return {
                ...state,
                loadingDelete: false,
                successDelete: false
            }
        default:
            return state;
    }
};