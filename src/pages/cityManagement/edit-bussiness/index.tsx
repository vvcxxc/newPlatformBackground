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
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;

export default class editBussiness extends Component {
    state = {
        cityList: [],
        cityId: 0,
        city: '请选择城市',
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
            this.setState({
                cityList: res.data
            }, () => {
                const id = this.props.location.query.id;
                request(`/admin/business/${id}`, {
                    method: 'GET',
                }).then(res => {
                    this.state.cityList.forEach(item => {
                        if (item.city_id == res.data.city_id) {
                            this.setState({
                                city: item.city_name
                            })
                        }
                    })
                    this.setState({
                        cityId: res.data.city_id,
                        name: res.data.name
                    })
                })
            })
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
        const id = this.props.location.query.id;
        request(`/admin/business/${id}`, {
            method: "PUT",
            data: {
                city_id: cityId,
                name: name,
            }
        }).then(res => {
            message.success('操作成功');

        }).catch(err => {
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