const Model = {
    namespace: 'shopCategoryList',
    state: {
        categoryName: undefined, // 分类名称
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                categoryName: payload.categoryName
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                categoryName: undefined,
            }
        }
    }
}

export default Model;