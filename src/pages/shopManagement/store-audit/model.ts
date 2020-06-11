const Model = {
    namespace: 'storeAuditList',
    state: {
        storeName: undefined, //门店名称
        telephone: undefined, // 手机号
        categoryName: undefined, // 分类名称
        currentPage: 1,
        currentPageSize: 10
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                storeName: payload.storeName,
                telephone: payload.telephone,
                categoryName: payload.categoryName,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                storeName: undefined,
                telephone: undefined,
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