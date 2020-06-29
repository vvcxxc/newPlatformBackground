import React, { Component } from 'react';
import styles from './index.less';
import { Card, Form, Input, Radio, Button, Table, Upload, Icon, message, Progress, Modal, DatePicker, Tabs } from 'antd';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import request from '@/utils/request';
import 'braft-editor/dist/index.css';


export default class CouponDetail extends Component {

    state = {
        imgUrl: '',
        imgVisible: false,
        videoUrl: '',
        videoVisible: false,
        phoneVisible: false,
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
            store: {
                id: 10,
                facade_image: "",
                store_name: "",
                detailed_address: "",
                contact_person: "",
                contact_phone: "",
            },
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
            coupon_no: '',//C20200619257148
        },
        rush_rule: {}
    }

    componentDidMount() {
        request('/admin/coupon/' + this.props.location.query.id, {
            method: "GET",
        }).then(res => {
            let rush_rule = res.data.rush_activity.rush_description, temp = [];
            if (rush_rule && rush_rule.length) {
                for (let i in rush_rule) {
                    temp.push({ id: Number(i) + 1, item: rush_rule[i] })
                }
            }
            res.data && this.setState({ data: res.data, rush_rule: temp });
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
        const storeColumns = [
            {
                title: '门店图片',
                dataIndex: 'facade_image',
                key: 'facade_image',
                render: (facade_image: any) => <img className={styles.show_margin_img} src={'http://oss.tdianyi.com/' + facade_image} />,
            },
            {
                title: '门店名称',
                dataIndex: 'store_name',
                key: 'store_name',
            },
            {
                title: '地址',
                dataIndex: 'detailed_address',
                key: 'detailed_address',
            },
            {
                title: '联系人',
                dataIndex: 'contact_person',
                key: 'contact_person',
            },
            {
                title: '联系电话',
                dataIndex: 'contact_phone',
                key: 'contact_phone',
            },
        ];

        const ruleColumns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '使用须知',
                dataIndex: 'item',
                key: 'item',
            }
        ];
        const giftColumns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '礼品名称',
                dataIndex: 'gift',
                key: 'gift',
                render: (gift: any) => <text>{gift.gift_name}</text>,
            },
            {
                title: '礼品类型',
                dataIndex: 'gift',
                key: 'gift',
                render: (gift: any) => <text>{gift.gift_type == 1 ? '现金券' : gift.gift_type == 2 ? '商品券' : gift.gift_type == 3 ? '实物礼品' : ''}</text>,//1现金券 2商品券 3实物礼品
            },
            {
                title: '面额',
                dataIndex: 'gift',
                key: 'gift',
                render: (gift: any) => <text>{gift.gift_type == 1 ? '￥' + gift.worth_money : '-'}</text>,
            },
            {
                title: '商品价值',
                dataIndex: 'gift',
                key: 'gift',
                render: (gift: any) => <text>{gift.gift_type != 1 ? '￥' + gift.worth_money : '-'}</text>,
            },
            {
                title: '剩余库存',
                dataIndex: 'gift',
                key: 'gift',
                render: (gift: any) => <text>{!gift.is_astrict_repertory ? '-' : gift.total_surplus_num}</text>,
            },
            {
                title: '占用数量',
                dataIndex: 'give_num',
                key: 'give_num',
                render: (give_num: any) => <text>{give_num}</text>,
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
                            {
                                data.store.id && <Table dataSource={[data.store]} columns={storeColumns} pagination={false} />
                            }
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
                        <Form.Item label="抢购时间">
                            <div className={styles.show_textalign}>{data.rush_activity.start_time} - {data.rush_activity.end_time}</div>
                        </Form.Item>
                        <Form.Item label="限购数量">
                            <div className={styles.show_textalign}>{data.rush_activity.repertory_num ? data.rush_activity.repertory_num + '张' : '不限制'}</div>
                        </Form.Item>
                        <Form.Item label="限购设置">
                            <div className={styles.show_textalign}>{data.rush_activity.rush_astrict_buy_num}张/人</div>
                        </Form.Item>
                        <Form.Item label="有效期">
                            <div className={styles.show_textalign}>购券日起{data.rush_activity.coupon_validity_day}天可用</div>
                        </Form.Item>
                        <Form.Item label="是否可退款">
                            <div className={styles.show_textalign}>{data.rush_activity.is_support_refund == 1 ? '是' : '否'}</div>
                        </Form.Item>
                        <Form.Item label="使用须知" style={{ marginBottom: '10px' }}></Form.Item>
                        <Form.Item wrapperCol={{ offset: 2 }} className={styles.show_margin}>
                            {
                                this.state.rush_rule.length && <Table dataSource={this.state.rush_rule} columns={ruleColumns} pagination={false} />
                            }
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="图文描述" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="卡券图片" style={{ marginBottom: '10px' }}></Form.Item>
                        <div className={styles.imgBox}>
                            {
                                data.coupon_image.length && data.coupon_image.map((item: any, index: any) => {
                                    return (<img className={styles.imgItem} src={'http://oss.tdianyi.com/' + item.file_path} onClick={() => { this.setState({ imgUrl: item.file_path, imgVisible: true }) }} />)
                                })
                            }
                        </div>
                        <Form.Item label="主图视频" style={{ marginBottom: '10px' }}></Form.Item>
                        <div className={styles.imgBox}>
                            {
                                data.master_video.length && data.master_video.map((item: any, index: any) => {
                                    return (<video className={styles.imgItem} src={'http://oss.tdianyi.com/' + item.file_path} onClick={() => { this.setState({ videoUrl: item.file_path, videoVisible: true }) }} />)
                                })
                            }
                        </div>
                        <Form.Item label="详情" style={{ marginBottom: '10px' }}></Form.Item>
                        <Button type="primary"  className={styles.Bbtn} onClick={() => { this.setState({ phoneVisible: true }) }} >点击查看</Button>
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

                <Card title="礼品" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item wrapperCol={{ offset: 0 }} className={styles.show_margin}>
                            {
                                data.rush_activity.bind_gift_log.length && <Table dataSource={data.rush_activity.bind_gift_log} columns={giftColumns} pagination={false} />
                            }
                        </Form.Item>
                    </Form>
                </Card>

                <Modal
                    title="卡券图片"
                    visible={this.state.imgVisible}
                    onOk={() => this.setState({ imgVisible: false, imgUrl: '' })}
                    onCancel={() => this.setState({ imgVisible: false, imgUrl: '' })}
                >
                    <img className={styles.imgShow} src={'http://oss.tdianyi.com/' + this.state.imgUrl} />
                </Modal>
                <Modal
                    title="主图视频"
                    visible={this.state.videoVisible}
                    onOk={() => this.setState({ videoVisible: false, videoUrl: '' })}
                    onCancel={() => this.setState({ videoVisible: false, videoUrl: '' })}
                >
                    <video className={styles.imgShow} src={'http://oss.tdianyi.com/' + this.state.videoUrl} controls="controls" />
                </Modal>
                <Modal
                    title="详情"
                    visible={this.state.phoneVisible}
                    onOk={() => this.setState({ phoneVisible: false })}
                    onCancel={() => this.setState({ phoneVisible: false })}
                >
                    <div className={styles.phoneBox} dangerouslySetInnerHTML={{ __html: data.rush_activity.rush_detail_connent }} ></div>
                </Modal>
            </div>
        )
    }
}