import { Reducer } from 'redux';
import { Effect } from 'dva';
import { notification } from 'antd';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { router } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let res = yield call(fakeAccountLogin, payload)
      if(res.status_code == 200){
        localStorage.setItem('token',res.data.token_type + ' ' + res.data.token)
        yield put({
          type: 'user/saveCurrentUser',
          payload:{
            name: payload.username,
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          }
        })
        router.push('/marketingActivity/activityinfo/cardlist')
      }else{
        notification.error({
          message: res.message,
        });
      }
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      localStorage.removeItem('token')
      router.push('/user/login')
      // redirect

      // if (window.location.pathname !== '/user/login' && !redirect) {
      //   yield put(
      //     routerRedux.replace({
      //       pathname: '/user/login',
      //       search: stringify({
      //         redirect: window.location.href,
      //       }),
      //     }),
      //   );
      // }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
