const Model = {
    namespace: 'useKnowList',
    state: {
        useKnow: undefined, // 使用须知
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                useKnow: payload.useKnow,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                useKnow: undefined,
            }
        },
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