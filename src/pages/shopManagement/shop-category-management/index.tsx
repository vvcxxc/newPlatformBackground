import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal } from 'antd'
import { connect } from "dva";
import { router } from "umi";
import request from '@/utils/request'
import { text } from "express";

const FormItem = Form.Item;

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    shopCategoryList: any;
}

export default Form.create()(
    connect(({ shopCategoryList }: any) => ({ shopCategoryList }))(
        class shopCategoryList extends Component<Props>{

            state = {
                dataList: [],
                loading: false,
                total: 10,
            }

            componentDidMount() {
                const { categoryName, currentPage, currentPageSize } = this.props.shopCategoryList;
                this.getListData(categoryName, currentPage, currentPageSize);
            }

            getListData = (categoryName: any, currentPage: any, currentPageSize: any) => {
                this.setState({
                    loading: true,
                });
                request('/admin/store/category', {
                    method: 'GET',
                    params: {
                        name: categoryName,
                        page: currentPage,
                        per_page: currentPageSize
                    }
                }).then(res => {
                    this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
                })
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let categoryName = this.props.form.getFieldValue('categoryName');
                await this.props.dispatch({
                    type: 'shopCategoryList/setSearchState',
                    payload: {
                        categoryName,
                    },
                });
                const { currentPage, currentPageSize } = this.props.shopCategoryList;
                this.getListData(categoryName, currentPage, currentPageSize);
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'shopCategoryList/resetFussySearch',
                });
            };

            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'shopCategoryList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.shopCategoryList;
                let categoryName = this.props.form.getFieldValue('categoryName');
                this.getListData(categoryName, currentPage, currentPageSize);
            }

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total } = this.state;
                const { currentPage, currentPageSize, categoryName } = this.props.shopCategoryList;
                const columns = [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '分类',
                        dataIndex: 'name',
                        key: 'name',
                        width: 100
                    },
                    {
                        title: '图片',
                        dataIndex: 'img_url',
                        key: 'img_url',
                        width: 100,
                        render: (text, record) => (
                            <img src={record.img_url} alt="" width="90" />
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'opearation',
                        key: 'opearation',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>
                                <a>编辑</a>
                            </span>
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
                                        <FormItem label='分类名称'>
                                            {getFieldDecorator('categoryName', { initialValue: categoryName })(
                                                <Input placeholder="请输入" />,
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