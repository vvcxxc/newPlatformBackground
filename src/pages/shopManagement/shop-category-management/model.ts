const Model = {
    namespace: 'shopCategoryList',
    state: {
        categoryName: undefined, // 分类名称
        currentPage: 1, // 当前页
        currentPageSize: 10, // 每页数量
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                categoryName: payload.categoryName,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                categoryName: undefined,
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