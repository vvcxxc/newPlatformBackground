const Model = {
  namespace: 'merchantCard',
  state: {
    cardID: '', // 卡券ID
    activityName: undefined, // 活动名称
    storeName: undefined, // 商家名称
    cardStatus: undefined, // 卡券状态
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
    expandForm: false, // 展开还是折叠
  },
  reducers: {
    resetFussySearch(state) {
      return {
        ...state,
        cardID: '',
        activityName: undefined,
        storeName: undefined,
        cardStatus: undefined,
        currentPage: 1,
      };
    },
    setFussyForm(state, action) {
      return {
        ...state,
        cardID: action.payload.cardID,
        activityName: action.payload.activityName,
        storeName: action.payload.storeName,
        cardStatus: action.payload.cardStatus,
        currentPage: 1,
      };
    },
    switchExpandForm(state, action) {
      return {
        ...state,
        expandForm: !state.expandForm,
      };
    },
    setPaginationCurrent(state, action) {
      return {
        ...state,
        currentPage: action.payload.currentPage,
        currentPageSize: action.payload.currentPageSize,
      };
    },
    resetPageModel(state: any, action: any) {
      return {
        cardID: '', // 卡券ID
        activityName: undefined, // 活动名称
        storeName: undefined, // 商家名称
        cardStatus: undefined, // 卡券状态
        currentPage: 1, // 当前页
        currentPageSize: 10, // 每页数量
        expandForm: false, // 展开还是折叠
      };
    },
  },
};

export default Model;
