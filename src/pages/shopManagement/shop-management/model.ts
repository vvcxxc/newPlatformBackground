const Model = {
    namespace: 'shopManagementList',
    state: {
        storeName: undefined, //门店名称
        categoryName: undefined, // 分类名称
        bussinessName: undefined, // 商圈名称
        currentPage: 1,
        currentPageSize: 10
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                storeName: payload.storeName,
                categoryName: payload.categoryName,
                bussinessName: payload.bussinessName,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                storeName: undefined,
                categoryName: undefined,
                bussinessName: undefined
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