export const UpdateProfileReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_UPDATE_PROFILE":
            return {
                ...state,
                loading: true
            }
        case "SUCCESS_UPDATE_PROFILE":
            return {
                ...state,
                loading: false,
            }
        case "FAIL_UPDATE_PROFILE":
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
};