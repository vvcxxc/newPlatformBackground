import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import themePluginConfig from './themePluginConfig';

const { pwa } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      // component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          redirect: '/welcome',
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/couponManagement',
              name: 'couponManagement',
              routes: [
                {
                  path: '/couponManagement/add-coupon',
                  name: 'add-coupon',
                  component: './couponManagement/add-coupon'
                },
                {
                  path: '/couponManagement/coupon-detail',
                  name: 'coupon-detail',
                  component: './couponManagement/coupon-detail'
                },
                {
                  path: '/couponManagement/coupon-management',
                  name: 'coupon-management',
                  component: './couponManagement/coupon-management'
                },
                {
                  path: '/couponManagement/panic-coupon-management',
                  name: 'panic-coupon-management',
                  component: './couponManagement/panic-coupon-management'
                }
              ]
            },
            {
              path: '/cityManagement',
              name: 'cityManagement',
              routes: [
                {
                  path: '/cityManagement/city-management',
                  name: 'city-management',
                  component: './cityManagement/city-management'
                },
                {
                  path: '/cityManagement/add-city',
                  name: 'add-city',
                  component: './cityManagement/add-city'
                },
                {
                  path: '/cityManagement/edit-city',
                  name: 'edit-city',
                  component: './cityManagement/edit-city'
                },
                {
                  path: '/cityManagement/bussiness-management',
                  name: 'city-management',
                  component: './cityManagement/bussiness-management'
                },
                {
                  path: '/cityManagement/add-bussiness',
                  name: 'add-bussiness',
                  component: './cityManagement/add-bussiness'
                },
                {
                  path: '/cityManagement/edit-bussiness',
                  name: 'edit-bussiness',
                  component: './cityManagement/edit-bussiness'
                },
              ]
            },
            {
              path: '/shopManagement',
              name: 'shopManagement',
              routes: [
                {
                  path: '/shopManagement/shop-category-management',
                  name: 'shop-category-management',
                  component: './shopManagement/shop-category-management',
                },
                {
                  path: '/shopManagement/add-cate',
                  name: 'add-cate',
                  component: './shopManagement/add-cate',
                },
                {
                  path: '/shopManagement/shop-management',
                  name: 'shop-management',
                  component: './shopManagement/shop-management'
                },
                {
                  path: '/shopManagement/store-audit',
                  name: 'store-audit',
                  component: './shopManagement/store-audit'
                },
                {
                  path: '/shopManagement/store-audit-opearation',
                  name: 'store-audit-opearation',
                  component: './shopManagement/store-audit-opearation'
                },
                {
                  path: '/shopManagement/store-auditfail',
                  name: 'store-auditfail',
                  component: './shopManagement/store-auditfail'
                },
                {
                  path: '/shopManagement/store-auditfail-detail',
                  name: 'store-auditfail-detail',
                  component: './shopManagement/store-auditfail-detail'
                },
              ]
            },
            {
              path: '/giftManagement',
              name: 'giftManagement',
              routes: [
                {
                  path: '/giftManagement/add-gift',
                  name: 'add-gift',
                  component: './giftManagement/add-gift',
                },
                {
                  path: '/giftManagement/gift-details',
                  name: 'gift-details',
                  component: './giftManagement/gift-details',
                },
                {
                  path: '/giftManagement/gift-list',
                  name: 'gift-list',
                  component: './giftManagement/gift-list',
                },
                {
                  path: '/giftManagement/gift-post',
                  name: 'gift-post',
                  component: './giftManagement/gift-post',
                },
              ]
            },
            {
              path: '/systemSetting',
              name: 'systemSetting',
              routes: [
                {
                  path: '/systemSetting/use-know-management',
                  name: 'use-know-management',
                  component: './systemSetting/use-know-management'
                },
              ]
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },

    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    'process.env': {
      API_ENV: process.env.API_ENV, // 这里是重点吧，获取配置
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
} as IConfig;
