import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal } from 'antd'
import { connect } from "dva";
import { router } from "umi";

const FormItem = Form.Item;

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    useKnowList: any;
}

export default Form.create()(
    connect(({ useKnowList }: any) => ({ useKnowList }))(
        class useKnowList extends Component<Props>{

            state = {
                dataList: [],
                loading: false,
                total: 10,
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let useKnow = this.props.form.getFieldValue('useKnow');
                await this.props.dispatch({
                    type: 'useKnowList/setSearchState',
                    payload: {
                        useKnow
                    },
                });
                // const { currentPage, currentPageSize } = this.props.useKnowList;
                console.log(this.props)
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'useKnowList/resetFussySearch',
                });
            };

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total } = this.state;
                const { currentPage, currentPageSize, useKnow } = this.props.useKnowList;
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
                                        <FormItem label='使用须知'>
                                            {getFieldDecorator('useKnow', { initialValue: useKnow })(
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