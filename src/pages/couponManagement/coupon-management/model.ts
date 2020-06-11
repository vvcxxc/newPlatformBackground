const Model = {
    namespace: 'couponList',
    state: {
        couponType: undefined, // 券类型
        couponName: undefined, // 券名称
        storeName: undefined,  // 门店名称
        bussinessName: undefined, // 商圈
        couponStatus: undefined, // 券状态
        publishPlatform: undefined, // 发布主体
        currentPage: 1, // 当前页
        currentPageSize: 10, // 每页数量
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                couponType: payload.couponType,
                couponName: payload.couponName,
                storeName: payload.storeName,
                bussinessName: payload.bussinessName,
                couponStatus: payload.couponStatus,
                publishPlatform: payload.publishPlatform,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                couponType: undefined,
                couponName: undefined,
                storeName: undefined,
                bussinessName: undefined,
                couponStatus: undefined,
                publishPlatform: undefined,
            };
        },
    }
}

export default Model;