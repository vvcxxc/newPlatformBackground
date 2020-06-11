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

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    couponList: any;
    currentPage: Number;
    currentPageSize: Number;
}

export default Form.create()(
    connect(({ couponList }: any) => ({ couponList }))(
        class couponList extends Component<Props> {

            state = {
                dataList: [],
                loading: false,
                total: 10,
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let couponType = this.props.form.getFieldValue('couponType');
                let couponName = this.props.form.getFieldValue('couponName');
                let storeName = this.props.form.getFieldValue('storeName');
                let bussinessName = this.props.form.getFieldValue('bussinessName');
                let couponStatus = this.props.form.getFieldValue('couponStatus');
                let publishPlatform = this.props.form.getFieldValue('publishPlatform');
                await this.props.dispatch({
                    type: 'couponList/setSearchState',
                    payload: {
                        couponType,
                        couponName,
                        storeName,
                        bussinessName,
                        couponStatus,
                        publishPlatform
                    },
                });
                // const { currentPage, currentPageSize } = this.props.couponList;
                console.log(this.props)
            }


            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'couponList/resetFussySearch',
                });
            };

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total } = this.state;
                const { couponType, couponName, storeName, bussinessName, couponStatus, publishPlatform, currentPage, currentPageSize, } = this.props.couponList;
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
                                    <Col md={6} sm={20}>
                                        <FormItem label='券类型'>
                                            {getFieldDecorator('couponType', { initialValue: couponType })(
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
                                    <Col md={6} sm={20}>
                                        <FormItem label='券名称'>
                                            {getFieldDecorator('couponName', { initialValue: couponName })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={6} sm={20}>
                                        <FormItem label='门店名称'>
                                            {getFieldDecorator('storeName', { initialValue: storeName })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={6} sm={20}>
                                        <FormItem label='商圈'>
                                            {getFieldDecorator('bussinessName', { initialValue: bussinessName })(
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
                                </Row>
                                <Row
                                    gutter={{
                                        md: 8,
                                        lg: 24,
                                        xl: 48,
                                    }}
                                >
                                    <Col md={6} sm={20}>
                                        <FormItem label='券状态'>
                                            {getFieldDecorator('couponStatus', { initialValue: couponStatus })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Option value="0">上架</Option>
                                                    <Option value="1">下架</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={6} sm={20}>
                                        <FormItem label='发布主体'>
                                            {getFieldDecorator('publishPlatform', { initialValue: publishPlatform })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Option value="0">平台</Option>
                                                    <Option value="1">商家</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={6} sm={26}>
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