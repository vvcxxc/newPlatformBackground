const Model = {
    namespace: 'bussinessList',
    state: {
        bussinessName: undefined, // 商圈名称
        cityName: undefined, // 城市
        currentPage: 1, // 当前页
        currentPageSize: 10, // 每页数量
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                bussinessName: payload.bussinessName,
                cityName: payload.cityName,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                bussinessName: undefined,
                cityName: undefined,
            };
        },
    }
}

export default Model;