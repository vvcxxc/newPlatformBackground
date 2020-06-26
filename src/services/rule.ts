import request from '../utils/request';

/**
 * 获取全部须知
 */
export const getRuleList = (params: any) => {
  return request.get('/admin/allCouponDescription', {params})
}
