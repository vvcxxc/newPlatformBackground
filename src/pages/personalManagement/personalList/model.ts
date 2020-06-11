import moment from 'moment';
const Model = {
  namespace: 'personalList',
  state: {
    name: undefined,
    mobile: undefined,
    start_date: undefined,
    end_date: undefined,
    status: undefined,
    type: undefined,
    currentPage: 1,
    currentPageSize: 10
  },
  reducers: {
    setSearchState(state: any, { payload }: any) {
      let created = undefined
      if (payload.start_date && payload.end_date) {
        created = moment(payload.start_date).format('YYYY-MM-DD') + '/' + moment(payload.end_date).format('YYYY-MM-DD')
      }
      return {
        ...state,
        name: payload.name,
        mobile: payload.mobile,
        start_date: payload.start_date,
        end_date: payload.end_date,
        status: payload.status,
        type: payload.type,
        currentPage: 1,
      }
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        name: undefined,
        mobile: undefined,
        start_date: undefined,
        end_date: undefined,
        status: undefined,
        type: undefined,
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

export default Model
