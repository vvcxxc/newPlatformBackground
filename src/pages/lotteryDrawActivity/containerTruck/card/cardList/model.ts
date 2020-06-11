const Model = {
  namespace: 'cardList',
  state: {
    cardName: undefined, // 卡片名称
    cardNumber: undefined, // 卡片编号
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        cardName: action.payload.cardName,
        cardNumber: action.payload.cardNumber,
        currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        cardName: undefined,
        cardNumber: undefined,
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
