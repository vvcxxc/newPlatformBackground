import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, Table, Divider, Modal, InputNumber, message } from 'antd'
import request from '@/utils/request';
import { router } from 'umi';
import { connect } from "dva";

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    giftList: any
}


export default Form.create()(
    connect(({ giftList }: any) => ({ giftList }))(
        class GiftList extends Component<Props> {

            state = {
                total: 0,
                loading: false,
                dataList: [],
                visible: false,
                gift_id: 0,
                add_repertory_num: 0
            }


            componentDidMount() {
                const {
                    currentPage,
                    currentPageSize
                } = this.props.giftList;

                this.getListData(currentPage, currentPageSize);
            }

            getListData = (currentPage: any, currentPageSize: any) => {
                this.setState({
                    loading: true
                })
                request('/api/v1/gift', {
                    method: 'GET',
                    params: {
                        page: currentPage,
                        count: currentPageSize
                    }
                }).then(res => {
                    this.setState({
                        dataList: res.data,
                        loading: false,
                        total: res.pagination.total,
                    })
                })
            }

            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'giftList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.giftList;
                this.getListData(currentPage, currentPageSize);
            };

            onChangeNumber = (e: any) => {
                this.setState({
                    add_repertory_num: e
                })
            }

            handleOk = () => {
                request('/api/v1/gift/updateGiftRepertoryNum', {
                    method: "PUT",
                    data: {
                        gift_id: this.state.gift_id,
                        add_repertory_num: this.state.add_repertory_num
                    }
                }).then(async (res: any) => {
                    if (res.status_code == 200) {
                        message.success(res.message);
                        await this.setState({
                            visible: false,
                            add_repertory_num: 0
                        })
                        const {
                            currentPage,
                            currentPageSize
                        } = this.props.giftList;

                        this.getListData(currentPage, currentPageSize);
                    } else {
                        message.error(res.message)
                    }
                })
            }

            render() {
                const columns = [
                    {
                        title: 'id',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: "礼品名称",
                        dataIndex: 'gift_name',
                        key: 'gift_name',
                    },
                    {
                        title: "礼品类型",
                        dataIndex: 'gift_type',
                        key: 'gift_type',
                        render: (text: any, record: any) => (
                            <span>
                                {record.gift_type == 1 ? "现金券" : record.gift_type == 2 ? "商品券" : record.gift_type == 3 ? "实物礼品" : ""}
                            </span>
                        )
                    },
                    {
                        title: '礼品数量',
                        dataIndex: 'total_repertory_num',
                        key: 'total_repertory_num',
                    },
                    {
                        title: "总派发数量",
                        dataIndex: 'total_give_num',
                        key: 'total_give_num',
                    },
                    {
                        title: "已使用数量",
                        dataIndex: 'total_obtain_num',
                        key: 'total_obtain_num',
                    },
                    {
                        title: "剩余数量",
                        dataIndex: 'total_surplus_num',
                        key: 'total_surplus_num',
                    },
                    {
                        title: "状态",
                        dataIndex: 'status',
                        key: 'status',
                        render: (text: any, record: any) => (
                            <span>{record.status == 1 ? "正常" : record.status == 2 ? "关闭" : ""}</span>
                        )
                    },
                    {
                        title: "关闭方式",
                        dataIndex: 'shut_type',
                        key: 'shut_type',
                        render: (text: any, record: any) => (
                            <span>{record.shut_type == 1 ? "自动关闭" : record.status == 2 ? "手动关闭" : "未关闭"}</span>
                        )
                    },
                    {
                        title: "创建时间",
                        dataIndex: 'created_at',
                        key: 'created_at',
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        render: (text: any, record: any) => (
                            <span>
                                <a onClick={() => router.push({ pathname: '/giftManagement/gift-details', query: { id: record.id } })}>查看详情</a>
                                <Divider type="vertical" />
                                <a onClick={() => this.setState({ visible: true, gift_id: record.id })}>增加库存</a>
                                {/* <Divider type="vertical" /> */}
                                {/* <a>编辑</a> */}
                            </span>
                        )
                    },
                ]
                const { total, loading, dataList, add_repertory_num } = this.state;
                const { currentPage, currentPageSize } = this.props.giftList;
                return (
                    <div>
                        <Button
                            type="primary"
                            onClick={() => {
                                router.push('/giftManagement/add-gift')
                            }}
                            style={{ marginBottom: "20px" }}
                        >
                            添加礼品
                        </Button>
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
                        <Modal
                            title="请输入添加库存数"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={() => { this.setState({ visible: false, add_repertory_num: 0 }) }}
                        >
                            <InputNumber min={0}
                                value={add_repertory_num}
                                onChange={this.onChangeNumber}
                            />
                        </Modal>
                    </div>
                )
            }
        }
    )
)