const Model = {
    namespace: 'giftPost',
    state: {
        receiverName: undefined,
        receiverPhone: undefined,
        storeName: undefined,
        sendGoodStatus: undefined,
        currentPage: 1,
        currentPageSize: 10
    },
    reducers: {
        setSearchState(state: any, { payload }: any) {
            return {
                ...state,
                receiverName: payload.receiverName,
                receiverPhone: payload.receiverPhone,
                storeName: payload.storeName,
                sendGoodStatus: payload.sendGoodStatus,
                currentPage: 1,
            }
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                receiverName: undefined,
                receiverPhone: undefined,
                storeName: undefined,
                sendGoodStatus: undefined,
            }
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