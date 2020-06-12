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

const FormItem = Form.Item;
const { Option } = Select;

export default class addBussiness extends Component {
    state = {
        cityList: [],
        cityId: 0,
        city:'请选择城市',
        name: ''
    }
    componentDidMount = () => {
        request('/admin/city', {
            method: 'GET',
            params: {
                status: 1,
                pre_page: 9999
            }
        }).then(res => {
            this.setState({ cityList: res.data })
        });
    }
    setCity = (cityId: any) => {
        const { cityList } = this.state;
        let city = '';
        for (let i = 0; i < cityList.length; i++) {
            if (cityList[i].city_id === cityId) {
                city = cityList[i].city_name;
                break
            }
        }
        this.setState({ cityId, city })
    }
    changeName = (e: any) => {
        this.setState({ name: e.target.value })
    }
    sumbit = () => {
        const { cityId, name } = this.state;    
        request('/admin/business', {
            method: "POST",
            data: {
                city_id: cityId,
                name: name,
            }
        }).then(res => {
            console.log(res)
            notification.success({
                message: '添加成功',
                description: res.message,
            });
        }).catch(err => {
            notification.success({
                message: '添加失败',
                description: err.message,
            });
        });
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 2 },
            }
        };
        const { cityList } = this.state;
        return (
            <div>
                <Form {...formItemLayout}>
                    <FormItem label='城市'>
                        <Select
                            placeholder="请选择"
                            style={{
                                width: '250px',
                            }}
                            onChange={this.setCity}
                            value={this.state.city}
                        >
                            {
                                cityList.length && cityList.map((item: any, index: number) => {
                                    return (
                                        <Option key={item.id} value={item.city_id}>{item.city_name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label='商圈名称'>
                        <Input placeholder="请输入" style={{
                            width: '250px',
                        }}
                            onChange={this.changeName.bind(this)}
                            value={this.state.name}
                        />
                    </FormItem>
                    <Form.Item wrapperCol={{ offset: 2 }} >
                        <Button type="primary" style={{ width: "120px" }}
                           onClick={this.sumbit}
                        >确定</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}