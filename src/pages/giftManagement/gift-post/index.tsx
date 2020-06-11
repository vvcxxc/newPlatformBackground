import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, Table, Divider, Modal, InputNumber, message, Timeline } from 'antd'
import request from '@/utils/request';
import { router } from 'umi';
import { connect } from "dva";
import styles from './index.less';

const { confirm } = Modal;
const { Option } = Select;
const FormItem = Form.Item;

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    giftPost: any
}


export default Form.create()(
    connect(({ giftPost }: any) => ({ giftPost }))(
        class GiftPost extends Component<Props> {

            state = {
                total: 0,
                loading: false,
                dataList: [],
                company: [],

                delivery_company_id: 0,  //物流公司id	
                delivery_sn: "", // 物流单号
                companyMsg: [],
            }

            componentDidMount() {
                const {
                    currentPage,
                    currentPageSize,
                    receiverName,
                    receiverPhone,
                    storeName,
                    sendGoodStatus
                } = this.props.giftPost;

                this.getListData(currentPage, currentPageSize, receiverName, receiverPhone, storeName, sendGoodStatus);

                this.getAllCompany();
            }

            getListData = (currentPage: any, currentPageSize: any, receiverName: any, receiverPhone: any, storeName: any, sendGoodStatus: any) => {
                this.setState({
                    loading: true
                })
                request('/api/v1/gift/orderGiftLog', {
                    method: 'GET',
                    params: {
                        page: currentPage,
                        count: currentPageSize,
                        user_name: receiverName,
                        user_phone: receiverPhone,
                        supplier_name: storeName,
                        delivery_status: sendGoodStatus
                    }
                }).then(res => {
                    this.setState({
                        dataList: res.data,
                        loading: false,
                        total: res.pagination.total,
                    })
                })
            }

            getAllCompany = () => {
                request('/api/v1/gift/deliveryCompany', {
                    method: "GET"
                }).then((res: any) => {
                    if (res.status_code == 200) {
                        this.setState({
                            company: res.data
                        })
                    }
                })
            }

            handleSelectCompany = (e) => {
                this.setState({
                    delivery_company_id: e
                })
            }

            handleInpOrderNum = (e) => {
                this.setState({
                    delivery_sn: e.target.value
                })
            }

            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'giftPost/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.giftPost;
                let receiverName = this.props.form.getFieldValue('receiverName');
                let receiverPhone = this.props.form.getFieldValue('receiverPhone');
                let storeName = this.props.form.getFieldValue('storeName');
                let sendGoodStatus = this.props.form.getFieldValue('sendGoodStatus');
                this.getListData(currentPage, currentPageSize, receiverName, receiverPhone, storeName, sendGoodStatus);
            };

            handleOrderNum = (id: any) => {
                const _this = this;
                confirm({
                    title: '填写单号',
                    content: (
                        <div>
                            <div className={styles.item_layout}>
                                <div className={styles.item_title}>物流公司</div>
                                <Select style={{ width: 220 }} onSelect={this.handleSelectCompany}>
                                    {
                                        this.state.company.map((item: any) => (
                                            <Option value={item.id}>{item.company_name}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className={styles.item_layout}>
                                <div className={styles.item_title}>单号</div>
                                <Input style={{ width: 220 }} onChange={this.handleInpOrderNum} />
                            </div>
                        </div>
                    ),
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        request('/api/v1/gift/orderGiftLog', {
                            method: "POST",
                            data: {
                                order_gift_log_id: id,
                                delivery_company_id: _this.state.delivery_company_id,
                                delivery_sn: _this.state.delivery_sn
                            }
                        }).then((res: any) => {
                            if (res.status_code == 200) {
                                message.success(res.message);
                                const {
                                    currentPage,
                                    currentPageSize,
                                    receiverName,
                                    receiverPhone,
                                    storeName,
                                    sendGoodStatus
                                } = _this.props.giftPost;

                                _this.getListData(currentPage, currentPageSize, receiverName, receiverPhone, storeName, sendGoodStatus);
                            } else {
                                message.error(res.message);
                            }
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            }


            handleCompanyDetail = async (id: any, companyOrder: any) => {
                await request('/api/v1/gift/getWuLiu', {
                    method: "GET",
                    params: {
                        delivery_sn: companyOrder
                    }
                }).then((res: any) => {
                    if (res.status_code == 200) {
                        if (res.data.status == true) {
                            this.setState({
                                companyMsg: res.data.data.list
                            }, () => {
                                confirm({
                                    title: '物流详情',
                                    content: (
                                        <div style={{ marginTop: "50px" }}>
                                            <Timeline>
                                                {
                                                    this.state.companyMsg.map((item: any) => (
                                                        <Timeline.Item key={item.time}>{item.time} {item.status}</Timeline.Item>
                                                    ))
                                                }

                                            </Timeline>
                                        </div>
                                    ),
                                    okText: '确定',
                                    okType: 'danger',
                                    cancelText: '取消',
                                });
                            })

                        } else {
                            message.error("暂无物流信息")
                        }
                    }

                })

            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let receiverName = this.props.form.getFieldValue('receiverName');
                let receiverPhone = this.props.form.getFieldValue('receiverPhone');
                let storeName = this.props.form.getFieldValue('storeName');
                let sendGoodStatus = this.props.form.getFieldValue('sendGoodStatus');
                await this.props.dispatch({
                    type: 'giftPost/setSearchState',
                    payload: {
                        receiverName,
                        receiverPhone,
                        storeName,
                        sendGoodStatus,
                    },
                });

                const { currentPage, currentPageSize } = this.props.giftPost;
                this.getListData(currentPage, currentPageSize, receiverName, receiverPhone, storeName, sendGoodStatus);
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'giftPost/resetFussySearch',
                });
            };

            render() {
                const columns = [
                    {
                        title: 'id',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: "微信用户",
                        dataIndex: 'user',
                        key: 'user',
                        render: (text: any, record: any) => (
                            <span>{record.user.user_name}</span>
                        )
                    },
                    // {
                    //     title: "头像",
                    //     dataIndex: 'gift_image',
                    //     key: 'gift_image',
                    //     render: (text: any, record: any) => (
                    //         <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/${record.gift_image}`} width="90" height="90" alt="" />
                    //     )
                    // },
                    {
                        title: '收货人',
                        dataIndex: 'order_address',
                        key: 'order_address',
                        render: (text: any, record: any) => (
                            <span>{record.order_address.user_name}</span>
                        )
                    },
                    {
                        title: "联系电话",
                        dataIndex: 'order_address',
                        key: 'order_address',
                        render: (text: any, record: any) => (
                            <span>{record.order_address.user_phone}</span>
                        )
                    },
                    {
                        title: "收货地址",
                        dataIndex: 'order_address',
                        key: 'order_address',
                        render: (text: any, record: any) => (
                            <span>{record.order_address.address}</span>
                        )
                    },
                    {
                        title: "礼品名称",
                        dataIndex: 'gift_name',
                        key: 'gift_name',
                    },
                    {
                        title: "礼品图片",
                        dataIndex: 'gift_name',
                        key: 'gift_name',
                        render: (text: any, record: any) => (
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/${record.gift_image}`} width="90" height="90" alt="" />
                        )
                    },
                    {
                        title: '参与活动',
                        dataIndex: 'binding',
                        key: 'binding',
                        render: (text: any, record: any) => (
                            <span>{record.binding.binding_type == 1 ? "拼团活动" : record.binding.binding_type == 2 ? "增值活动" : record.binding.binding_type == 3 ? "优惠券" : ""}</span>
                        )
                    },
                    {
                        title: "商家",
                        dataIndex: 'binding_supplier',
                        key: 'binding_supplier',
                        render: (text: any, record: any) => (
                            <span>{record.binding_supplier.name}</span>
                        )
                    },
                    // {
                    //     title: "活动状态",
                    //     dataIndex: 'total_surplus_num',
                    //     key: 'total_surplus_num',
                    // },
                    {
                        title: "发货时间",
                        dataIndex: 'delivery_time',
                        key: 'delivery_time',
                    },
                    {
                        title: "快递单号",
                        dataIndex: 'delivery_sn',
                        key: 'delivery_sn',
                    },
                    {
                        title: "快递公司",
                        dataIndex: 'delivery_company_name',
                        key: 'delivery_company_name',
                    },
                    {
                        title: "物流状态",
                        dataIndex: 'delivery_status',
                        key: 'delivery_status',
                        render: (text: any, record: any) => (
                            <span>{record.delivery_status == 0 ? "待接单" : record.delivery_status == 1 ? "已接单" : record.delivery_status == 2 ? "配送中" : record.delivery_status == 3 ? "配送成功" : record.delivery_status == 4 ? "配送失败" : ""}</span>
                        )
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        render: (text: any, record: any) => (
                            <span>
                                {
                                    record.delivery_status == 0 ? (<a onClick={this.handleOrderNum.bind(this, record.id)}>填写单号</a>) : ""
                                }
                                {/* <Divider type="vertical" /> */}
                                {
                                    record.delivery_status != 0 ? (<a onClick={this.handleCompanyDetail.bind(this, record.id, record.delivery_sn)}>物流详情</a>) : ""
                                }
                            </span>
                        )
                    },
                ]
                const { total, loading, dataList } = this.state;
                const { receiverName, receiverPhone, storeName, sendGoodStatus, currentPage, currentPageSize } = this.props.giftPost;

                const { getFieldDecorator } = this.props.form;
                return (
                    <div>
                        <Form onSubmit={this.onSearch.bind(this)} layout="inline" style={{ marginBottom: '20px' }}>
                            <Row
                                gutter={{
                                    md: 8,
                                    lg: 24,
                                    xl: 48,
                                }}
                            >
                                <Col md={5} sm={20}>
                                    <FormItem label='收货人'>
                                        {getFieldDecorator('receiverName', { initialValue: receiverName })(
                                            <Input placeholder="请输入" />,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={5} sm={20}>
                                    <FormItem label='收货人手机号'>
                                        {getFieldDecorator('receiverPhone', { initialValue: receiverPhone })(
                                            <Input placeholder="请输入" />,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={5} sm={20}>
                                    <FormItem label='商家名称'>
                                        {getFieldDecorator('storeName', { initialValue: storeName })(
                                            <Input placeholder="请输入" />,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={5} sm={20}>
                                    <FormItem label='发货状态'>
                                        {getFieldDecorator('sendGoodStatus', { initialValue: sendGoodStatus })(
                                            <Select placeholder="全部状态" style={{
                                                width: '174px'
                                            }}>
                                                <Option value={0}>待接单</Option>
                                                <Option value={2}>配送中</Option>
                                                <Option value={3}>配送成功</Option>
                                                <Option value={4}>配送失败</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={4} sm={26}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button
                                        style={{
                                            marginLeft: 8,
                                        }}
                                        onClick={this.handleFormReset}
                                    >
                                        重置
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            columns={columns}
                            dataSource={dataList}
                            loading={loading}
                            onChange={this.handleChange}
                            pagination={{
                                current: currentPage,
                                defaultPageSize: currentPageSize,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                total,
                                showTotal: () => {
                                    return `共${total}条`;
                                },
                            }}
                        />
                    </div>
                )
            }
        }
    )
)
