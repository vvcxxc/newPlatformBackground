const Model = {
  namespace: 'businessGiftList',
  state: {
    page: 1,
    gift_name: '',
    gift_type: '',
    is_terrace: 0,
    business_district_id: '',
    store_name: ''

  },
  reducers: {
    setDate (state: any, {payload}: any){
      console.log(payload)
      return {
        ...state,
        ...payload
      }
    },
    reset (){
      console.log(4343)
      return {
        page: 1,
        gift_name: '',
        gift_type: '',
        is_terrace: 0,
        business_district_id: '',
        store_name: ''
      }
    }
  },
}

export default Model;
