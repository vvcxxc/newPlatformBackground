const Model = {
    namespace: 'panicCouponList',
    state: {
        panicStatus: undefined, // 抢购状态
        panicCouponType: undefined, //券类型
        panicCouponName: undefined, // 券名称
        storeName: undefined, // 门店名称
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                panicStatus: payload.panicStatus,
                panicCouponType: payload.panicCouponType,
                panicCouponName: payload.panicCouponName,
                storeName: payload.storeName,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                panicStatus: undefined,
                panicCouponType: undefined,
                panicCouponName: undefined,
                storeName: undefined,
            };
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