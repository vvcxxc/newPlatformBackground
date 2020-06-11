const Model = {
  namespace: 'cardManage',
  state: {
    ID: '', // 卡券ID
    activityName: undefined, // 活动名称
    storeName: undefined, // 商家名称
    status: undefined, // 卡券状态
    expandForm: false, // 展开还是折叠
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        ID: action.payload.ID,
        activityName: action.payload.activityName,
        storeName: action.payload.storeName,
        status: action.payload.status,
        currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        ID: '',
        activityName: undefined,
        storeName: undefined,
        status: undefined,
      };
    },
    switchExpandForm(state: any, action: any) {
      return {
        ...state,
        expandForm: !state.expandForm,
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
