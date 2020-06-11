const Model = {
  namespace: 'prizesList',
  state: {
    prizeName: undefined, // 活动名称
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        prizeName: action.payload.prizeName,
        currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        prizeName: undefined,
      };
    },
    setPaginationCurrent(state: any, action: any) {
      return {
        ...state,
        currentPage: action.payload.currentPage,
        currentPageSize: action.payload.currentPageSize,
      };
    },
  },
};

export default Model;
