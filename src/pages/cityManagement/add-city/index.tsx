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
    Radio,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import request from '@/utils/request'
import Item from 'antd/lib/list/Item';
const FormItem = Form.Item;
const { Option } = Select;


export default class addCity extends Component {

    state = {
        isDefault: 0,
        regionsList: [],
        regionsId: 0,
        cityList: [],
        cityId: 0,
        regions: '请选择省份/地区',
        city: '请选择城市'
    }
    componentDidMount = () => {
        request('/json/regions').then(res => {
            this.setState({ regionsList: res.data })
        }).catch(err => {
            notification.success({
                message: '查询省市失败',
                description: err.message,
            });
        })
        // var requestURL = 'http://test.bruin_shop.api.tdianyi.com/storage/json/regions.json';
        // var request = new XMLHttpRequest();
        // request.open('GET', requestURL);
        // request.responseType = 'json';
        // request.send();
        // request.onload = function () {
        //     var superHeroes = request.response;
        //     console.log('superHeroes ', superHeroes)
        // }
    }

    setRegions = (regionsId: any) => {
        const { regionsList } = this.state
        let cityList = [], regions = '';
        for (let i = 0; i < regionsList.length; i++) {
            if (regionsList[i].id === regionsId) {
                cityList = regionsList[i].city;
                regions = regionsList[i].name;
                break
            }
        }
        this.setState({ cityList, cityId: 0, regions, regionsId, city: '请选择城市' })
    }
    setCity = (cityId: any) => {
        const { cityList } = this.state;
        let city = '';
        for (let i = 0; i < cityList.length; i++) {
            if (cityList[i].id === cityId) {
                city = cityList[i].name
                break
            }
        }
        this.setState({ cityId, city })
    }
    handleChangeIsDefault = (e: any) => {
        this.setState({
            isDefault: e.target.value
        })
    }
    sumbit = () => {
        const { regionsId, cityId, isDefault } = this.state;
        console.log(regionsId, cityId, isDefault);
        request('/admin/city', {
            method: "GET",
            params: {
                city_id: cityId,
                province_id: regionsId,
                is_default: isDefault
            }
        }).then(res => {
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
        const { isDefault, regionsList, cityList } = this.state;
        return (
            <div>
                <Form {...formItemLayout}>
                    <FormItem label='省份/地区'>
                        <Select
                            placeholder="请选择"
                            style={{
                                width: '250px',
                            }}
                            value={this.state.regions}
                            onChange={this.setRegions}
                        >
                            {
                                regionsList.length && regionsList.map((item: any, index: number) => {
                                    return (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label='城市'>
                        <Select
                            placeholder="请选择"
                            style={{
                                width: '250px',
                            }}
                            value={this.state.city}
                            onChange={this.setCity}
                        >
                            {
                                cityList.length && cityList.map((item: any, index: number) => {
                                    return (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label='是否默认'>
                        <Radio.Group value={isDefault} onChange={this.handleChangeIsDefault}>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </Radio.Group>
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
