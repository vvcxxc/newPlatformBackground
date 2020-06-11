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

const FormItem = Form.Item;
const { Option } = Select;

export default class addBussiness extends Component {
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
                    <FormItem label='城市'>
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
                    <FormItem label='商圈名称'>
                        <Input placeholder="请输入" style={{
                            width: '250px',
                        }} />
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