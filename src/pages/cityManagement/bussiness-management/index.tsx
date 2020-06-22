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

                cityDatas: []
            }


            componentDidMount() {
                const { bussinessName, cityName, currentPage, currentPageSize } = this.props.bussinessList;
                this.getListData(currentPage, currentPageSize, bussinessName, cityName);


                request('/admin/city', {
                    method: 'GET',
                    params: {
                        status: 1
                    }
                }).then(res => {
                    this.setState({
                        cityDatas: res.data
                    })
                })
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
                const { currentPage, currentPageSize } = this.props.bussinessList;
                this.getListData(currentPage, currentPageSize, bussinessName, cityName);
            }


            getListData = (currentPage: any, currentPageSize: any, bussinessName: any, cityName: any) => {
                this.setState({
                    loading: true,
                });
                request('/admin/business', {
                    method: 'GET',
                    params: {
                        name: bussinessName,
                        city: cityName,
                        status,
                        page: currentPage,
                        pre_page: currentPageSize
                    }
                }).then(res => {
                    this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
                })
            }


            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'bussinessList/resetFussySearch',
                });
            };

            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'bussinessList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.bussinessList;
                let bussinessName = this.props.form.getFieldValue('bussinessName');
                let cityName = this.props.form.getFieldValue('cityName');
                this.getListData(currentPage, currentPageSize, bussinessName, cityName);
            }

            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total, cityDatas } = this.state;
                const { bussinessName, cityName, currentPage, currentPageSize } = this.props.bussinessList;
                const columns = [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '商圈名称',
                        dataIndex: 'name',
                        key: 'name',
                        width: 100
                    },
                    {
                        title: '所属城市',
                        dataIndex: 'city',
                        key: 'city',
                        width: 100
                    },
                    {
                        title: '状态',
                        dataIndex: 'type',
                        key: 'type',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>{record.type == 1 ? "开通" : "关闭"}</span>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'opearation',
                        key: 'opearation',
                        width: 100,
                        render: (text: any, record: any) => (
                            <div>
                                <a>{record.type == 1 ? "关闭" : "开通"}</a>
                                <Divider type="vertical" />
                                <a>编辑</a>
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
                                                    {
                                                        cityDatas.map(item => (
                                                            <Option value={item.city_name}>{item.city_name}</Option>
                                                        ))
                                                    }
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