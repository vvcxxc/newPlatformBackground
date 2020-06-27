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
    shopManagementList: any;
}

export default Form.create()(
    connect(({ shopManagementList }: any) => ({ shopManagementList }))(
        class shopManagementList extends Component<Props>{

            state = {
                dataList: [],
                loading: false,
                total: 10,

                categoryDatas: [],
                bussinessDatas: [],
            }



            componentDidMount() {
                const { storeName, loginAccount, categoryName, bussinessName, currentPage, currentPageSize } = this.props.shopManagementList;
                this.getListData(storeName, loginAccount, categoryName, bussinessName, currentPage, currentPageSize);

                request('/admin/store/category', {
                    method: 'GET',
                    params: {}
                }).then(res => {
                    this.setState({
                        categoryDatas: res.data
                    })
                })

                request('/admin/business', {
                    method: 'GET',
                    params: {
                        pre_page: 9999
                    }
                }).then(res => {
                    this.setState({
                        bussinessDatas: res.data
                    })
                })

            }


            getListData = (storeName: any, loginAccount: any, categoryName: any, bussinessName: any, currentPage: any, currentPageSize: any) => {
                this.setState({
                    loading: true,
                });
                request('/admin/stores/manage', {
                    method: 'GET',
                    params: {
                        store: storeName,
                        account: loginAccount,
                        category: categoryName,
                        business_district: bussinessName,
                        page: currentPage,
                        per_page: currentPageSize
                    }
                }).then(res => {
                    this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
                })
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let storeName = this.props.form.getFieldValue('storeName');
                let loginAccount = this.props.form.getFieldValue('loginAccount');
                let categoryName = this.props.form.getFieldValue('categoryName');
                let bussinessName = this.props.form.getFieldValue('bussinessName');
                await this.props.dispatch({
                    type: 'shopManagementList/setSearchState',
                    payload: {
                        storeName,
                        loginAccount,
                        categoryName,
                        bussinessName
                    },
                });
                const { currentPage, currentPageSize } = this.props.shopManagementList;
                this.getListData(storeName, loginAccount, categoryName, bussinessName, currentPage, currentPageSize);
            }



            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'shopManagementList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.shopManagementList;
                let storeName = this.props.form.getFieldValue('storeName');
                let loginAccount = this.props.form.getFieldValue('loginAccount');
                let categoryName = this.props.form.getFieldValue('categoryName');
                let bussinessName = this.props.form.getFieldValue('bussinessName');
                this.getListData(storeName, loginAccount, categoryName, bussinessName, currentPage, currentPageSize);
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'shopManagementList/resetFussySearch',
                });
            };

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total, categoryDatas, bussinessDatas } = this.state;
                const { currentPage, currentPageSize, storeName, loginAccount, categoryName, bussinessName } = this.props.shopManagementList;
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
                        dataIndex: 'facade_image',
                        key: 'facade_image',
                        width: 100,
                        render: (text: any, record: any) => (
                            <img src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/" + record.facade_image} alt="" width="90px" />
                        )
                    },
                    {
                        title: '法人名称',
                        dataIndex: 'legal_representative',
                        key: 'legal_representative',
                        width: 100
                    },
                    {
                        title: '门店地址',
                        dataIndex: 'detailed_address',
                        key: 'detailed_address',
                        width: 100
                    },
                    {
                        title: '门店电话',
                        dataIndex: 'contact_phone',
                        key: 'contact_phone',
                        width: 100
                    },
                    {
                        title: '经营品类',
                        dataIndex: 'business_category',
                        key: 'business_category',
                        width: 100
                    },
                    {
                        title: '商圈',
                        dataIndex: 'business_district_name',
                        key: 'business_district_name',
                        width: 100
                    },
                    {
                        title: '审核状态',
                        dataIndex: 'status',
                        key: 'status',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>通过</span>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'opearation',
                        key: 'opearation',
                        width: 100,
                        render: (text: any, record: any) => (
                            <a >编辑</a>
                        )
                    }
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
                                        <FormItem label='登录账户'>
                                            {getFieldDecorator('loginAccount', { initialValue: loginAccount })(
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
                                    <Col md={5} sm={24}>
                                        <FormItem label="商圈">
                                            {getFieldDecorator('bussinessName', { initialValue: bussinessName })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    {
                                                        bussinessDatas.map(item => (
                                                            <Option value={item.id}>{item.name}</Option>
                                                        ))
                                                    }
                                                </Select>,
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