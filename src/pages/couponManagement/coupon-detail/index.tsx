import React, { Component } from 'react';
import styles from './index.less';
import { Card, Form, Input, Radio, Button, Table, Upload, Icon, message, Progress, Modal, DatePicker, Tabs } from 'antd';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';


export default class CouponDetail extends Component {

    state = {
        editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 10 },
            },
        };
        const storeDataSource = [
            {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
        ];
        const storeColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            },
        ];
        const ruleDataSource = [
            {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
        ];
        const ruleColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            },
        ];
        const giftDataSource = [
            {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
        ];
        const giftColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            },
        ];
        const {
            editorState
        } = this.state;
        return (
            <div className={styles.coupon_detail}>
                <Card title="基础信息" bordered={false} style={{ width: "100%" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="卡券图片">
                            <div className={styles.show_margin}>商品券</div>
                        </Form.Item>
                        <Form.Item label="卡券名称">
                            <div className={styles.show_margin}>XXXX商品券</div>
                        </Form.Item>
                        <Form.Item label="所属门店" style={{ marginBottom: '10px' }}></Form.Item>
                        <Form.Item wrapperCol={{ offset: 2 }} className={styles.show_margin}>
                            <Table dataSource={storeDataSource} columns={storeColumns} pagination={false} />
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="销售信息" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="市场价">
                            <div className={styles.show_textalign}>123元</div>
                        </Form.Item>
                        <Form.Item label="购买价">
                            <div className={styles.show_textalign}>100元</div>
                        </Form.Item>
                        <Form.Item label="发放数量">
                            <div className={styles.show_textalign}>100张</div>
                        </Form.Item>
                        <Form.Item label="限购设置">
                            <div className={styles.show_textalign}>1张/人</div>
                        </Form.Item>
                        <Form.Item label="有效期">
                            <div className={styles.show_textalign}>购券日起7天可用</div>
                        </Form.Item>
                        <Form.Item label="使用须知" style={{ marginBottom: '10px' }}></Form.Item>
                        <Form.Item wrapperCol={{ offset: 2 }} className={styles.show_margin}>
                            <Table dataSource={ruleDataSource} columns={ruleColumns} pagination={false} />
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="图文描述" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="详情" style={{ marginBottom: '10px' }}></Form.Item>
                        <Form.Item wrapperCol={{ offset: 2 }} style={{ width: "100%" }}>
                            <div style={{ border: "1px solid #ccc" }}>
                                <BraftEditor
                                    value={editorState}
                                    readOnly={true}
                                />
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="分享信息" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="分享内容" style={{ marginBottom: '10px' }}>
                            <div className={styles.show_margin}>商品券</div>
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="销售信息" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="是否参与抢购活动">
                            <div className={styles.show_textalign}>参与</div>
                        </Form.Item>
                        <Form.Item label="抢购时间">
                            <div className={styles.show_textalign}>2020-05-01 10:00 - 2020-05-01 22:00</div>
                        </Form.Item>
                        <Form.Item label="抢购价">
                            <div className={styles.show_textalign}>29.99元</div>
                        </Form.Item>
                        <Form.Item label="抢购数量">
                            <div className={styles.show_textalign}>50张</div>
                        </Form.Item>
                        <Form.Item label="限购设置">
                            <div className={styles.show_textalign}>1人/张</div>
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="礼品" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item wrapperCol={{ offset: 0 }} className={styles.show_margin}>
                            <Table dataSource={giftDataSource} columns={giftColumns} pagination={false} />
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}