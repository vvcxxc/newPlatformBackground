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
import Requset from 'umi-request';
import Item from 'antd/lib/list/Item';
const FormItem = Form.Item;
const { Option } = Select;


export default class addCity extends Component {

    state = {
        isDefault: 0,
        regionsList: [],
        regionsId: 0,
        cityList: [],
    }
    componentDidMount = () => {
        Requset('/json/regions').then(res => {
            this.setState({ regionsList: res.data })
        });

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

    setRegions = (id: any) => {
        console.log('query', id)
        const {regionsList } = this.state
        let cityList = []
        for(let i = 0; i < regionsList.length; i ++){
          if(regionsList[i].id === id){
            cityList = regionsList[i].city
            // this.setState({cityList: regionsList[i].city})
            break
          }
        }
        console.log(cityList)
        this.setState({ cityList })
    }

    handleChangeIsDefault = (e: any) => {
        this.setState({
            isDefault: e.target.value
        })
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
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio> 
                        </Radio.Group>
                    </FormItem>
                    <Form.Item wrapperCol={{ offset: 2 }} >
                        <Button type="primary" style={{ width: "120px" }}
                        >确定</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
