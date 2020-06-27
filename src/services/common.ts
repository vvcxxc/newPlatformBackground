import request from '../utils/request';

export const getOssDate = () =>
  request.get('/oss/setting')
