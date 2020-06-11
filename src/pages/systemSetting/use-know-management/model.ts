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
    }
}

export default Model;