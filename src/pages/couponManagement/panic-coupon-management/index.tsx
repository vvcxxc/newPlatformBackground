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
import { connect } from 'dva';
import styles from './index.less';
import { router } from 'umi';
import request from '@/utils/request'

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    panicCouponList: any;
    currentPage: Number;
    currentPageSize: Number;
}

export default Form.create()(
    connect(({ panicCouponList }: any) => ({ panicCouponList }))(
        class panicCouponList extends Component<Props> {


            state = {
                dataList: [],
                loading: false,
                total: 10,
            }

            componentDidMount() {
                const { panicStatus, panicCouponType, panicCouponName, storeName, currentPage, currentPageSize } = this.props.panicCouponList;
                this.getListData(currentPage, currentPageSize, panicStatus, panicCouponType, panicCouponName, storeName);
            }

            getListData = (currentPage: any, currentPageSize: any, panicStatus: any, panicCouponType: any, panicCouponName: any, storeName: any) => {
                this.setState({
                    loading: true,
                });
                request('/admin/activityRush', {
                    method: 'GET',
                    params: {
                        status: panicStatus,
                        coupon_type: panicCouponType,
                        name: panicCouponName,
                        store_name: storeName,
                        page: currentPage,
                        pre_page: currentPageSize
                    }
                }).then(res => {
                    this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
                })
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let panicStatus = this.props.form.getFieldValue('panicStatus');
                let panicCouponType = this.props.form.getFieldValue('panicCouponType');
                let panicCouponName = this.props.form.getFieldValue('panicCouponName');
                let storeName = this.props.form.getFieldValue('storeName');
                await this.props.dispatch({
                    type: 'panicCouponList/setSearchState',
                    payload: {
                        panicStatus,
                        panicCouponType,
                        panicCouponName,
                        storeName,
                    },
                });
                const { currentPage, currentPageSize } = this.props.panicCouponList;
                this.getListData(currentPage, currentPageSize, panicStatus, panicCouponType, panicCouponName, storeName);
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'panicCouponList/resetFussySearch',
                });
            };

            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'panicCouponList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.panicCouponList;
                let panicStatus = this.props.form.getFieldValue('panicStatus');
                let panicCouponType = this.props.form.getFieldValue('panicCouponType');
                let panicCouponName = this.props.form.getFieldValue('panicCouponName');
                let storeName = this.props.form.getFieldValue('storeName');
                this.getListData(currentPage, currentPageSize, panicStatus, panicCouponType, panicCouponName, storeName);
            }

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total } = this.state;
                const { panicStatus, panicCouponType, panicCouponName, storeName, currentPage, currentPageSize, } = this.props.panicCouponList;
                const columns = [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '卡券图片',
                        dataIndex: 'coupon_cover',
                        key: 'coupon_cover',
                        width: 100,
                        render: (text: any, record: any) => (
                            <img src={'http://tmwl.oss-cn-shenzhen.aliyuncs.com/' + record.coupon_cover} alt="" width="90px" />
                        )
                    },
                    {
                        title: '卡券名称',
                        dataIndex: 'name',
                        key: 'name',
                        width: 100
                    },
                    {
                        title: '卡券类型',
                        dataIndex: 'coupon_type',
                        key: 'coupon_type',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>{record.coupon_type == 1 ? "商品券" : record.coupon_type == 2 ? "现金券" : ""}</span>
                        )
                    },
                    {
                        title: '所属门店',
                        dataIndex: 'store_name',
                        key: 'store_name',
                        width: 100
                    },
                    {
                        title: '市场价(元)',
                        dataIndex: 'market_money',
                        key: 'market_money',
                        width: 100
                    },
                    {
                        title: '抢购价',
                        dataIndex: 'rush_money',
                        key: 'rush_money',
                        width: 100
                    },
                    {
                        title: '发放数量(张)',
                        dataIndex: 'repertory_num',
                        key: 'repertory_num',
                        width: 100
                    },
                    {
                        title: '参与库存(张)',
                        dataIndex: 'surplus_num',
                        key: 'surplus_num',
                        width: 100
                    },
                    {
                        title: '已抢购数量(张)',
                        dataIndex: 'sales_num',
                        key: 'sales_num',
                        width: 100
                    },
                    {
                        title: '抢购状态',
                        dataIndex: 'status',
                        key: 'status',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>{record.status == 1 ? "待开始" : record.status == 2 ? "抢购中" : record.status == 3 ? "抢购结束" : record.status == 4 ? "已取消" : ""}</span>
                        )
                    },
                    {
                        title: '抢购时间',
                        dataIndex: 'time',
                        key: 'time',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>{record.start_time + "~" + record.end_time}</span>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'opearation',
                        key: 'opearation',
                        width: 100,
                        render: (text: any, record: any) => (
                            <div>
                                <a >详情</a>
                                <Divider type="vertical" />
                                <a >订单明细</a>
                            </div>
                        )
                    },
                ]
                return (
                    <div>
                        <div className={styles.tableListForm}>
                            <Form layout="inline" onSubmit={this.onSearch.bind(this)}>
                                <Row
                                    gutter={{
                                        md: 8,
                                        lg: 24,
                                        xl: 48,
                                    }}
                                >
                                    <Col md={5} sm={20}>
                                        <FormItem label='抢购状态'>
                                            {getFieldDecorator('panicStatus', { initialValue: panicStatus })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Option value="1">待开始</Option>
                                                    <Option value="2">抢购中</Option>
                                                    <Option value="3">抢购结束</Option>
                                                    <Option value="4">已取消</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={20}>
                                        <FormItem label='券类型'>
                                            {getFieldDecorator('panicCouponType', { initialValue: panicCouponType })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Option value="2">现金券</Option>
                                                    <Option value="1">优惠券</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={20}>
                                        <FormItem label='券名称'>
                                            {getFieldDecorator('panicCouponName', { initialValue: panicCouponName })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={20}>
                                        <FormItem label='门店名称'>
                                            {getFieldDecorator('storeName', { initialValue: storeName })(
                                                <Input placeholder="请输入" />,
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

                            <Button type="primary" htmlType="submit" style={{ marginBottom: '20px' }} onClick={() => router.push('/couponManagement/add-coupon')}>
                                新增
                            </Button>

                            <Table
                                rowKey="id"
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
                    </div>
                )
            }
        }
    )
)