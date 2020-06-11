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

const FormItem = Form.Item;
const { Option } = Select;


export default class addCity extends Component {

    state = {
        isDefault: 0
    }

    handleChangeIsDefault = (e) => {
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
        const { isDefault } = this.state;
        return (
            <div>
                <Form {...formItemLayout}>
                    <FormItem label='省份/地区'>
                        <Select
                            placeholder="请选择"
                            style={{
                                width: '250px',
                            }}
                        >
                            {/* <Option value="0">开通</Option>
                            <Option value="1">关闭</Option> */}
                        </Select>
                    </FormItem>
                    <FormItem label='城市'>
                        <Select
                            placeholder="请选择"
                            style={{
                                width: '250px',
                            }}
                        >
                        </Select>
                    </FormItem>
                    <FormItem label='是否默认'>
                        <Radio.Group value={isDefault} onChange={this.handleChangeIsDefault}>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </Radio.Group>
                    </FormItem>
                    <Form.Item wrapperCol={{ offset: 2 }} >
                        <Button type="primary" style={{width: "120px"}}
                        >确定</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}