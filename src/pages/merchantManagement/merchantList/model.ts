import moment from 'moment';
const Model = {
  namespace: 'merchantList',
  state: {
    accountname: undefined,
    name: undefined,
    created: undefined,
    start_date: undefined,
    end_date: undefined,
    mobile: undefined,
    status: undefined,
    paystatus: undefined,
    page: 1, // 当前页
    currentPageSize: 10, // 每页数量
  },
  reducers: {
    setSearchItem(state: any, { payload }: any) {
      let created = undefined
      if (payload.start_date && payload.end_date) {
        created = moment(payload.start_date).format('YYYY-MM-DD') + '/' + moment(payload.end_date).format('YYYY-MM-DD')
      }
      return {
        ...state,
        accountname: payload.accountname,
        name: payload.name,
        created,
        mobile: payload.mobile,
        status: payload.status,
        paystatus: payload.paystatus,
        start_date: payload.start_date,
        end_date: payload.end_date
      }
    },
    setPage(state: any, action: any) {
      return {
        ...state,
        page: action.payload.page
      }
    },
    reset(state: any) {
      console.log(23423)
      return {
        ...state,
        accountname: undefined,
        name: undefined,
        created: undefined,
        start_date: undefined,
        end_date: undefined,
        mobile: undefined,
        status: undefined,
        paystatus: undefined,
        currentPage: 1, // 当前页
      }
    }
  }
}
export default Model;
