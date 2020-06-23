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
const { confirm } = Modal;

interface Props {
    form: any;
    dispatch: (opt: any) => any;
    cityList: any;
    currentPage: Number;
    currentPageSize: Number;
}


export default Form.create()(
    connect(({ cityList }: any) => ({ cityList }))(
        class cityList extends Component<Props> {

            state = {
                dataList: [],
                loading: false,
                total: 0,
            }



            componentDidMount() {
                const { provinceName, cityName, status, currentPage, currentPageSize } = this.props.cityList;
                this.getListData(currentPage, currentPageSize, provinceName, cityName, status,);
            }

            getListData = (currentPage: any, currentPageSize: any, provinceName: any, cityName: any, status: any) => {
                this.setState({
                    loading: true,
                });
                request('/admin/city', {
                    method: 'GET',
                    params: {
                        province: provinceName,
                        city: cityName,
                        status,
                        page: currentPage,
                        pre_page: currentPageSize
                    }
                }).then(res => {
                    this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
                })
            }


            onSearch = async (e: any) => {
                e.preventDefault();
                let provinceName = this.props.form.getFieldValue('provinceName');
                let cityName = this.props.form.getFieldValue('cityName');
                let status = this.props.form.getFieldValue('status');
                await this.props.dispatch({
                    type: 'cityList/setSearchState',
                    payload: {
                        provinceName,
                        cityName,
                        status
                    },
                });
                const { currentPage, currentPageSize } = this.props.cityList;
                this.getListData(currentPage, currentPageSize, provinceName, cityName, status,);
            }

            handleFormReset = async () => {
                const { form, dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'cityList/resetFussySearch',
                });
            };

            handleChange = async (pagination: any, filters: any, sorter: any) => {
                await this.props.dispatch({
                    type: 'cityList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });
                const { currentPage, currentPageSize } = this.props.cityList;
                let provinceName = this.props.form.getFieldValue('provinceName');
                let cityName = this.props.form.getFieldValue('cityName');
                let status = this.props.form.getFieldValue('status');
                this.getListData(currentPage, currentPageSize, provinceName, cityName, status,);
            }

            handleStatus = (record: any) => {
                // console.log(record)
                let _this = this;
                confirm({
                    title: '操作',
                    content: '确定要开通/关闭该城市吗?',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        request(`/admin/city/status/${record.id}`, {
                            method: 'PUT',
                        }).then(res => {
                            message.success('操作成功');
                            const { provinceName, cityName, status, currentPage, currentPageSize } = _this.props.cityList;
                            _this.getListData(currentPage, currentPageSize, provinceName, cityName, status,);
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            }


            render() {
                const { getFieldDecorator } = this.props.form;
                const { dataList, loading, total } = this.state;
                const { provinceName, cityName, status, currentPage, currentPageSize } = this.props.cityList;
                const columns = [
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '省份',
                        dataIndex: 'province_name',
                        key: 'province_name',
                        width: 100
                    },
                    {
                        title: '城市',
                        dataIndex: 'city_name',
                        key: 'city_name',
                        width: 100
                    },
                    {
                        title: '是否默认',
                        dataIndex: 'is_default',
                        key: 'is_default',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span>{record.is_default == 1 ? "是" : "否"}</span>
                        )
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        width: 100,
                        render: (text: any, record: any) => (
                            <span >{record.status == 1 ? "开通" : "关闭"}</span>
                        )
                    },
                    {
                        title: '操作',
                        dataIndex: 'id',
                        key: 'id',
                        width: 100,
                        render: (text: any, record: any) => (
                            <div>
                                <a onClick={this.handleStatus.bind(this, record)}>{record.status == 1 ? "关闭" : "开通"}</a>
                                <Divider type="vertical" />
                                <a onClick={() => router.push(`/cityManagement/edit-city?id=${record.id}`)}>编辑</a>
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
                                        <FormItem label='省份'>
                                            {getFieldDecorator('provinceName', { initialValue: provinceName })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={20}>
                                        <FormItem label='城市'>
                                            {getFieldDecorator('cityName', { initialValue: cityName })(
                                                <Input placeholder="请输入" />,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col md={5} sm={20}>
                                        <FormItem label='状态'>
                                            {getFieldDecorator('status', { initialValue: status })(
                                                <Select
                                                    placeholder="请选择"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Option value="1">开通</Option>
                                                    <Option value="0">关闭</Option>
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

                        <Button type="primary" htmlType="submit" style={{ marginBottom: 20 }} onClick={() => router.push('/cityManagement/add-city')}>
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
                    </div >
                )
            }
        }
    )
)