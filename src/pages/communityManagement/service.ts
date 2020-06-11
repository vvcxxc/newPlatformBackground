import request from '@/utils/request';
interface ListParams {
  created_at?: string;
  name?: string;
  mobile?: string;
  examine_status?: string;
}
// 获取审核列表数据
export const getCommunityList = (params?: ListParams) => {
  return request.get('/api/v1/community/examine',{
    params
  })
}

// 获取审核详情
export const getAuditDetails = (id: string) => {
  return request.get('/api/v1/community/examine/'+id)
}

// 提交审核
export const putAuditDetails = (id: string,data: any) => {
  return request.put('/api/v1/community/examine/'+id, {data})
}
