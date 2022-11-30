export const DashBoardReducer = (state, action) => {
    switch (action.type) {
        case "REQUEST_DASHBOARD_DATA":
            return {
                ...state,
                loading: true
            }
        case "SUCCESS_DASHBOARD_DATA":
            return {
                ...state,
                loading: false,
                summary: action.payload
            }
        case "FAIL_DASHBOARD_DATA":
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};