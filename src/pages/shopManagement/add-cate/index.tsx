import React, { Component } from 'react';
import {
  Table,
  Button,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  ConfigProvider,
  Divider,
  notification,
  Modal,
  message,
} from 'antd';
import styles from './index.less';
import request from '@/utils/request'
import UploadBox from '@/components/myComponents/uploadBox'
import { router } from 'umi';
const FormItem = Form.Item;
const { Option } = Select;

export default class AddCate extends Component {
  state = {
    name: '',
    img_url: ''
  }


  changeName = (e: any) => {
    this.setState({ name: e.target.value })
  }

  imgChange = (url: string) => {
    this.setState({ img_url: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/' + url })
  }

  submit = () => {
    const { name, img_url } = this.state;
    const data = {
      name,
      img_url,
      pid: 0
    }
    request.post('/admin/store/category', { data }).then(res => {
      if(res.data){
        notification.success({ message: '创建成功' })
        router.goBack()
      }
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 5 },
        sm: { span: 2 },
      }
    };
    return (
      <div>
        <Form {...formItemLayout}>
          <FormItem label='分类名称'>
            <Input placeholder="请输入" style={{
              width: '250px',
            }}
              onChange={this.changeName.bind(this)}
              value={this.state.name}
            />
          </FormItem>
          <FormItem label='分类图标'>
            <UploadBox onChange={this.imgChange} />
          </FormItem>
          <Form.Item wrapperCol={{ offset: 2 }} >
            <Button type="primary" style={{ width: "120px" }}
              onClick={this.submit}
            >确定</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
