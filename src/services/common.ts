import request from '../utils/request';

export const getOssDate = () =>
  request.get('http://release.api.supplier.tdianyi.com/api/v2/up')
