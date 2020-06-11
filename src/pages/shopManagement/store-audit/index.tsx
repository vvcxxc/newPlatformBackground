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
    storeAuditList: any;
}

export default Form.create()(
    connect(({ storeAuditList }: any) => ({ storeAuditList }))(
        class storeAuditList extends Component<Props>{

            state = {
                dataList: [],
                loading: false,
                total: 10,
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let storeName = this.props.form.getFieldValue('storeName');
                let telephone = this.props.form.getFieldValue('telephone');
                let categoryName = this.props.form.getFieldValue('categoryName');
                await this.props.dispatch({
                    type: 'storeAuditList/setSearchState',
                    payload: {
                        storeName,
                        telephone,
                        categoryName,
                    },
                });
                // const { currentPage, currentPageSize } = this.props.storeAuditList;
                console.log(this.props)
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'storeAuditList/resetFussySearch',
                });
            };

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total } = this.state;
                const { currentPage, currentPageSize, storeName, telephone, categoryName } = this.props.storeAuditList;
                const columns = [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100
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
                                                    <Option value="0">全部</Option>
                                                    <Option value="1">餐饮</Option>
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
                            // onChange={this.handleChange}
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