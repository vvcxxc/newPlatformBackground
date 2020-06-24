import React, { Component } from 'react';
import styles from './index.less';
import { Card, Form, Input, Radio, Button, Table, Upload, Icon, message, Progress, Modal, DatePicker, Tabs } from 'antd';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import request from '@/utils/request';
import 'braft-editor/dist/index.css';


export default class CouponDetail extends Component {

    state = {
        editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
        data: {
            id: 0,//优惠券id
            coupon_type: 0,//1商品券2现金券
            name: '',//券名称
            brokerage_ratio: 0,//抽佣比例
            create_at: '',//创建时间
            offset_money: 0,//抵扣金额
            use_min_price: 0,//最低使用门槛金额
            master_video: [
                {
                    id: 0,//附件id
                    accessory_format: '',//附件格式
                    file_path: ''//附件路径
                }
            ],
            coupon_image: [
                {
                    id: 0,//附件id
                    accessory_format: '',//附件格式
                    file_path: ''//附件路径
                }
            ],
            rush_activity: {
                id: 0,//活动id	
                market_money: 0,//市场金额	
                rush_money: 0,//抢购金额	
                start_time: '',//开始时间	
                end_time: '',//结束时间	
                repertory_num: 0,//总库存	
                rush_astrict_buy_num: 0,//每人限购个数	
                coupon_validity_day: 0,//优惠券有效期，单位天	
                is_support_refund: 0,//是否允许退款		
                is_index_recommend: 0,//是否首页推荐	
                index_recommend_sort: 0,//首页推荐排序		
                rush_description: [],	//使用须知	
                rush_detail_connent: '',//详情		
                rush_share_content: '',	//分享内容		
                is_binding_gift: 0,//是否绑定礼品		
                bind_gift_log: [
                    {
                        id: 0,//绑定记录id	
                        give_num: 0,//派发数量	
                        cancel_num: 0,//核销数量		
                        status: 0,//状态：1正常 2库存不足		
                        binding_time: '',//绑定时间	
                        update_status_time: '',	//更新状态时间	
                        gift: {
                            id: 0,//礼品id	
                            gift_no: '',//礼品编号		
                            gift_name: '',//礼品名称		
                            gift_type: 0,//礼品类型：1现金券 2商品券 3实物礼品	
                            worth_money: 0,//礼品价格	
                            delivery_type: 0,//配送方式：1快递	
                            delivery_money: 0,//配送费用	
                            delivery_pay_type: 0,//配送费支付方：1平台 2商家 3用户
                        }
                    }
                ]
            },
            coupon_no: ''//C20200619257148
        },
    }


    componentDidMount() {
        request('/admin/coupon/' + 'C20200619257148', {
            method: "GET",
        }).then(res => {
            res.data && this.setState({ data: res.data });
        }).catch(err => {
        });
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
            editorState,
            data
        } = this.state;
        return (
            <div className={styles.coupon_detail}>
                <Card title="基础信息" bordered={false} style={{ width: "100%" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="卡券类型">
                            <div className={styles.show_margin}>{data.coupon_type == 1 ? '商品券' : data.coupon_type == 2 ? '现金券' : ''}</div>
                        </Form.Item>
                        <Form.Item label="卡券名称">
                            <div className={styles.show_margin}>{data.name}</div>
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
                            <div className={styles.show_textalign}>{data.rush_activity.market_money}元</div>
                        </Form.Item>
                        <Form.Item label="购买价">
                            <div className={styles.show_textalign}>{data.rush_activity.rush_money}元</div>
                        </Form.Item>
                        <Form.Item label="发放数量">
                            <div className={styles.show_textalign}>{data.rush_activity.repertory_num}张</div>
                        </Form.Item>
                        <Form.Item label="限购设置">
                            <div className={styles.show_textalign}>{data.rush_activity.rush_astrict_buy_num}张/人</div>
                        </Form.Item>
                        <Form.Item label="有效期">
                            <div className={styles.show_textalign}>购券日起{data.rush_activity.coupon_validity_day}天可用</div>
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
                            <div className={styles.show_margin}>{data.rush_activity.rush_share_content}</div>
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
                            <div className={styles.show_textalign}>{data.rush_activity.start_time} - {data.rush_activity.end_time}</div>
                        </Form.Item>
                        <Form.Item label="抢购价">
                            <div className={styles.show_textalign}>{data.rush_activity.rush_money}元</div>
                        </Form.Item>
                        <Form.Item label="抢购数量">
                            <div className={styles.show_textalign}>50张</div>
                        </Form.Item>
                        <Form.Item label="限购设置">
                            <div className={styles.show_textalign}>{data.rush_activity.rush_astrict_buy_num}人/张</div>
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