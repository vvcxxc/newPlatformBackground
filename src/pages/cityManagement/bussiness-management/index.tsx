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
    bussinessList: any;
    currentPage: Number;
    currentPageSize: Number;
}


export default Form.create()(
    connect(({ bussinessList }: any) => ({ bussinessList }))(
        class bussinessList extends Component<Props> {

            state = {
                dataList: [],
                loading: false,
                total: 10,
            }

            onSearch = async (e: any) => {
                e.preventDefault();
                let bussinessName = this.props.form.getFieldValue('bussinessName');
                let cityName = this.props.form.getFieldValue('cityName');
                await this.props.dispatch({
                    type: 'bussinessList/setSearchState',
                    payload: {
                        bussinessName,
                        cityName,
                    },
                });
                // const { currentPage, currentPageSize } = this.props.bussinessList;
                console.log(this.props)
            }


            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'bussinessList/resetFussySearch',
                });
            };

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total } = this.state;
                const { bussinessName, cityName, currentPage, currentPageSize } = this.props.bussinessList;
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
                                        <FormItem label='名称'>
                                            {getFieldDecorator('bussinessName', { initialValue: bussinessName })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={20}>
                                        <FormItem label='城市'>
                                            {getFieldDecorator('cityName', { initialValue: cityName })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                </Select>
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

                        <Button type="primary" htmlType="submit" style={{ marginBottom: 20 }} onClick={() => router.push('/cityManagement/add-bussiness')}>
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
                )
            }
        }
    )
)