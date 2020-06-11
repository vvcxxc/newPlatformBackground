const Model = {
  namespace: 'jackPotList',
  state: {
    activityName: undefined, // 活动名称
    jackPotName: undefined,
    // activityStatus: undefined, // 活动状态
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        activityName: action.payload.activityName,
        jackPotName: action.payload.jackPotName,
        // activityStatus: action.payload.activityStatus,
        currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        activityName: undefined,
        jackPotName: undefined,
        // activityStatus: undefined,
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
