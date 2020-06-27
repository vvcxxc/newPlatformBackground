import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal } from 'antd'
import { connect } from "dva";
import { router } from "umi";

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    storeAuditFailList: any;
}

export default Form.create()(
    connect(({ storeAuditFailList }: any) => ({ storeAuditFailList }))(
        class storeAuditFailList extends Component<Props>{

            state = {
                dataList: [],
                loading: false,
                total: 10,

                categoryDatas: []
            }

            componentDidMount() {
                const { storeName, telephone, categoryName, currentPage, currentPageSize } = this.props.storeAuditFailList;
                this.getListData(currentPage, currentPageSize, storeName, telephone, categoryName,);


                request('/admin/store/category', {
                    method: 'GET',
                    params: {}
                }).then(res => {
                    this.setState({
                        categoryDatas: res.data
                    })
                })
            }


            getListData = (currentPage: any, currentPageSize: any, storeName: any, telephone: any, categoryName: any) => {
                this.setState({
                    loading: true,
                });
                request('/admin/store/failure', {
                    method: 'GET',
                    params: {
                        storeName: storeName,
                        account: telephone,
                        category: categoryName,
                        page: currentPage,
                        pre_page: currentPageSize
                    }
                }).then(res => {
                    this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
                })
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let storeName = this.props.form.getFieldValue('storeName');
                let telephone = this.props.form.getFieldValue('telephone');
                let categoryName = this.props.form.getFieldValue('categoryName');
                await this.props.dispatch({
                    type: 'storeAuditFailList/setSearchState',
                    payload: {
                        storeName,
                        telephone,
                        categoryName,
                    },
                });
                const { currentPage, currentPageSize } = this.props.storeAuditFailList;
                this.getListData(currentPage, currentPageSize, storeName, telephone, categoryName,);
            }


            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'storeAuditFailList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.storeAuditFailList;
                let storeName = this.props.form.getFieldValue('storeName');
                let telephone = this.props.form.getFieldValue('telephone');
                let categoryName = this.props.form.getFieldValue('categoryName');
                this.getListData(currentPage, currentPageSize, storeName, telephone, categoryName,);
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'storeAuditFailList/resetFussySearch',
                });
            };

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total, categoryDatas } = this.state;
                const { currentPage, currentPageSize, storeName, telephone, categoryName } = this.props.storeAuditFailList;
                const columns = [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '登录账户',
                        dataIndex: 'account',
                        key: 'account',
                        width: 100
                    },
                    {
                        title: '门店名称',
                        dataIndex: 'store_name',
                        key: 'store_name',
                        width: 100
                    },
                    {
                        title: '门头照',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100,
                        render: (text: any, record: any) => (
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + record.door_photo} alt="" width="90" height="90" />
                        )
                    },
                    {
                        title: '法人名称',
                        dataIndex: 'legal_person_name',
                        key: 'legal_person_name',
                        width: 100
                    },
                    {
                        title: '门店地址',
                        dataIndex: 'store_address',
                        key: 'store_address',
                        width: 100
                    },
                    {
                        title: '门店电话',
                        dataIndex: 'store_telephone',
                        key: 'store_telephone',
                        width: 100
                    },
                    {
                        title: '经营品类',
                        dataIndex: 'category',
                        key: 'category',
                        width: 100
                    },
                    {
                        title: '审核状态',
                        dataIndex: 'examine_type',
                        key: 'examine_type',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>
                                {
                                    record.examine_type == 1 ? "未填写" : record.examine_type == 2 ? "待审核" : record.examine_type == 3 ? "通过" : record.examine_type == 4 ? "拒绝" : ""
                                }
                            </span>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'opearation',
                        key: 'opearation',
                        width: 100,
                        render: (text: any, record: any) => (
                            <a onClick={() => router.push(`/shopManagement/store-auditfail-detail/?id=${record.id}`)}>详情</a>
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
                                        <FormItem label='门店名称'>
                                            {getFieldDecorator('storeName', { initialValue: storeName })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={20}>
                                        <FormItem label='手机号'>
                                            {getFieldDecorator('telephone', { initialValue: telephone })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={24}>
                                        <FormItem label="分类">
                                            {getFieldDecorator('categoryName', { initialValue: categoryName })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    {
                                                        categoryDatas.map(item => (
                                                            <Option value={item.id}>{item.name}</Option>
                                                        ))
                                                    }
                                                </Select>,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={26}>
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
                        </div>

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
                )
            }
        }
    )
)