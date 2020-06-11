import request from '@/utils/request'

/**
 * 添加礼品
 * @param data
 */
export const addRealGift = (data: any) => {
  return request.post('/api/v1/gift/matterGift', { data })
}

/**
 * 获取礼品详情
 * @param id 礼品id
 */
export const getGiftDetails = (id: string | number) => {
  return request.get('/api/v1/gift/' + id)
}

/**
 * 获取礼品领取详情
 * @data id 礼品id
 * @data page 页数
 * @data count 每页条数
 */
export const getGiftUseList = (id: string | number, page: string | number, count: string | number) => {
  return request.get('/api/v1/gift/' + id + '/bindingLog', { params: { page, count } })
}

/**
 * 增加礼品库存
 * @data id 礼品id
 * @data add_repertory_num 添加库存数
 */
export const changeGiftNum = (gift_id: string | number, add_repertory_num: string | number) => {
  return request.put('/api/v1/gift/updateGiftRepertoryNum', { data: { gift_id, add_repertory_num } })
}


