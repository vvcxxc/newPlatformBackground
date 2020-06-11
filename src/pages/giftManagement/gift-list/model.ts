const Model = {
    namespace: 'giftList',
    state: {
        currentPage: 1,
        currentPageSize: 10
    },
    reducers: {
        setPaginationCurrent(state: any, action: any) {
            return {
                ...state,
                currentPage: action.payload.currentPage,
                currentPageSize: action.payload.currentPageSize,
            };
        },
    }
}

export default Model;