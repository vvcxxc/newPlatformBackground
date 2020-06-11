const configs = {
  // 测试环境
  test: {
    API: 'http://test.platform_admin_api.tdianyi.com',
  },

  // 开发环境
  development: {
    API: 'http://test.platform_admin_api.tdianyi.com',

  },

  // 本地
  local: {
    API: 'http://test.platform_admin_api.tdianyi.com',
    // API: 'http://192.168.2.107:80',
  },

  // 线上环境
  master: {
    API: 'http://platform-admin.api.tdianyi.com',
  },
};

export default configs;
