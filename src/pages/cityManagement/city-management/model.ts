const Model = {
    namespace: 'cityList',
    state: {
        provinceName: undefined, // 省份
        cityName: undefined, // 城市
        status: undefined, // 状态
        currentPage: 1, // 当前页
        currentPageSize: 10, // 每页数量
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                provinceName: payload.provinceName,
                cityName: payload.cityName,
                status: payload.status,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                provinceName: undefined,
                cityName: undefined,
                status: undefined,
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