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
    username: '',
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
    const {username, password} = this.state
    this.props.dispatch({
      type: 'login/login',
      payload: {
        username,
        password
      }
    })
  }

  render() {
    const {username, password} = this.state
    return (
      <div className={styles.main}>
        <div className={styles.box}>
          <div className={styles.title}>营销管理中心</div>
          <div className={styles.inputBox}>
            <Input
              value={username}
              onChange={this.inputChange('username')}
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
