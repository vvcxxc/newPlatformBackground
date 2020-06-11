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
                // const { currentPage, currentPageSize } = this.props.panicCouponList;
                console.log(this.props)
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'panicCouponList/resetFussySearch',
                });
            };

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
                                                    <Option value="0">疯抢中</Option>
                                                    <Option value="1">即将开始</Option>
                                                    <Option value="2">即将售罄</Option>
                                                    <Option value="3">已结束</Option>
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
                                                    <Option value="0">现金券</Option>
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

                            <Button type="primary" htmlType="submit" style={{marginBottom: '20px'}} onClick={() => router.push('/couponManagement/add-coupon')}>
                                新增
                            </Button>

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
                    </div>
                )
            }
        }
    )
)