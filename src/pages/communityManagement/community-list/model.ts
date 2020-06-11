import { getCommunityList } from '../service'

const Model = {
  namespace: 'communityList',
  state: {
    dataList: [],
    name: '',
    created_at: '',
    mobile: '',
    examine_status: '',
    user_add_at: '',
    page: 1,
    total: null
  },
  reducers: {
    setState (state: any, { payload }: any){
      return {
        ...state,
        ...payload
      }
    },
    resetFussySearch (){
      return {
        dataList: [],
        name: '',
        created_at: '',
        mobile: '',
        examine_status: '',
        user_add_at: '',
        page: 1,
        total: null
      }
    }
  },
  effects: {
    *getList({ payload }: any, { call, put }: any) {
      const res = yield call(getCommunityList,payload)
      yield put({
        type: 'setState',
        payload: {
          dataList: res.data,
          total: res.pagination.total
        }
      })
    }
  }
}

export default Model
