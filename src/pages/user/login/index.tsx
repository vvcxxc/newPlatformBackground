import { Input, Icon, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './style.less';
import { Dispatch } from 'redux';

interface LoginProps {
  dispatch: Dispatch<any>;
}
@connect(({ login }: any) => login)
class Login extends Component<LoginProps> {

  state= {
    account: '',
    password: ''
  }
  componentDidMount (){
    // console.log(this.props)
  }

  inputChange = (type: string) => ({ target: { value } }) => {
    this.setState({
      [type]: value
    })
  }

  login = () => {
    const {account, password} = this.state
    this.props.dispatch({
      type: 'login/login',
      payload: {
        account,
        password
      }
    })
  }

  render() {
    const {account, password} = this.state
    return (
      <div className={styles.main}>
        <div className={styles.box}>
          <div className={styles.title}>新平台管理后台</div>
          <div className={styles.inputBox}>
            <Input
              value={account}
              onChange={this.inputChange('account')}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
            <Input
              value={password}
              type='password'
              onChange={this.inputChange('password')}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              style={{marginTop: '20px'}}
            />
            <Button onClick={this.login} style={{marginTop: '20px', width: '100%'}} type='primary'>登录</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
