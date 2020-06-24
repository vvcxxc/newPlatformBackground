import request from '@/utils/request'
interface StoreParams {
  store?: string;
  business_district?: number;
  page?: number;
}
/**
 *  获取使用须知列表
 */
export const getRuleList = () =>
  request.get('/admin/allCouponDescription',)

  /**
   * 获取商圈列表
   */
export const getBusinessList = () =>
  request.get('/admin/business/list/all')

  /**
   * 获取店铺列表
   */
export const getStoreList = (params: StoreParams) =>
  request.get('/admin/stores',{params})

  /**
   * 获取礼品列表
   */
export const getGiftList = (params: any) =>
  request.get('/admin/gift/getBindableGift',{params})
