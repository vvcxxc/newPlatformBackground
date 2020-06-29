/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  // DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Icon, Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const [menuData, setMenuData] = useState([]);
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */
  let data = [
    {
      path: '/cityManagement',
      name: '城市管理',
      children: [
        {
          path: '/cityManagement/city-management',
          name: '城市管理',
          component: './cityManagement/city-management'
        },
        {
          path: '/cityManagement/bussiness-management',
          name: '商圈管理',
          component: './cityManagement/bussiness-management'
        }
      ]
    },
    {
      path: '/shopManagement',
      name: '门店管理',
      children: [
        {
          path: '/shopManagement/shop-management',
          name: '门店管理',
          component: './shopManagement/shop-management'
        },
        {
          path: '/shopManagement/shop-category-management',
          name: '门店分类管理',
          component: './shopManagement/shop-category-management'
        },
        {
          path: '/shopManagement/store-audit',
          name: '门店审核',
          component: './shopManagement/store-audit'
        },
        {
          path: '/shopManagement/store-auditfail',
          name: '门店审核失败',
          component: './shopManagement/store-auditfail'
        }
      ]
    },
    {
      path: '/couponManagement',
      name: '卡券管理',
      children: [
        {
          path: '/couponManagement/panic-coupon-management',
          name: '抢购活动',
          component: './couponManagement/panic-coupon-management'
        }
      ]
    },
    {
      path: '/giftManagement',
      name: '礼品管理',
      children: [
        {
          path: '/giftManagement/gift-list',
          name: '商圈礼品列表',
          component: './giftManagement/gift-list'
        },
        {
          path: '/giftManagement/platform-gift-list',
          name: '平台礼品列表',
          component: './giftManagement/platform-gift-list'
        },
        {
          path: '/giftManagement/gift-post',
          name: '礼品邮寄记录',
          component: './giftManagement/gift-post'
        }
      ]
    },
    {
      path: '/systemSetting',
      name: '系统设置',
      children: [
        {
          path: '/systemSetting/use-know-management',
          name: '使用须知管理',
          component: './systemSetting/use-know-management'
        }
      ]
    },
    // {
    //   path: '/couponManagement',
    //   name: '卡券管理',
    //   children: [
    //     {
    //       path: '/couponManagement/community-list',
    //       name: '社群列表',
    //       component: './communityManagement/community-list'
    //     }
    //   ]
    // },
  ];
  useEffect(() => {
    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }


    setMenuData(data);
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <>
      <ProLayout
        menuHeaderRender={(logo, title) => (
          <Link to="/">
            {logo}
            <h1>小熊敬礼管理平台</h1>
          </Link>
          // <div>

          // </div>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
              <span>{route.breadcrumbName}</span>
            );
        }}
        // footerRender={footerRender}

        menuDataRender={() => menuData}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
