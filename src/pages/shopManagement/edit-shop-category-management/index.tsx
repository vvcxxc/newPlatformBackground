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
    Upload,
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
        img_url: '',
        pid: ''
    }

    componentDidMount() {
        const id = this.props.location.query.id;
        request(`/admin/store/category/${id}`, {
            method: "GET"
        }).then(res => {
            this.setState({
                name: res.data.name,
                img_url: res.data.img_url,
                pid: res.data.pid
            })
        })
    }


    changeName = (e: any) => {
        if (e.target.value.length <= 8) {
            this.setState({ name: e.target.value })
        }
    }

    imgChange = (url: string) => {
        this.setState({ img_url: url })
    }

    submit = () => {
        const id = this.props.location.query.id;
        const { name, img_url, pid } = this.state;
        const data = {
            name,
            img_url,
            pid
        }
        request.put(`/admin/store/category/${id}`, {
            data
        }).then(res => {
            notification.success({ message: '编辑成功' })
            router.goBack()
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
                        <UploadBox onChange={this.imgChange} imgUrl={this.state.img_url} />
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
