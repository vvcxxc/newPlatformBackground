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
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
import request from '@/utils/request';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  ID: any;
  activityName: any;
  storeName: any;
  status: any;
  expandForm: Boolean;
  currentPage: Number;
  currentPageSize: Number;
  activityInfo: any;
}

export default Form.create()(
  connect(({ activityInfo, merchantCard }: any) => ({ activityInfo, merchantCard }))(
    class ActivityInfo extends Component<Props> {
      state = {
        filteredInfo: {},
        sortedInfo: {},
        dataList: [],
        areaList: [],
        loading: false,
        total: 0,
      };

      componentDidMount = () => {
        console.log('环境：'+process.env.API_ENV)
        const {
          activityName,
          storeName,
          status,
          currentPage,
          currentPageSize,
        } = this.props.activityInfo;
        this.getListData(activityName, storeName, status, currentPage, currentPageSize);
        this.getAreaList();

        console.log(this.props);
      };

      handleEnlist = (record: any) => {
        request(`/api/v1/activity/recruit/${record.id}`, {
          method: 'PUT',
          params: {
            status: record.status == 1 ? 2 : 1,
          },
        }).then(res => {
          const {
            activityName,
            storeName,
            status,
            currentPage,
            currentPageSize,
          } = this.props.activityInfo;
          this.getListData(activityName, storeName, status, currentPage, currentPageSize);
        });
      };

      handleCheckActivity = (record: any) => {
        // console.log(record);
        router.push({
          pathname: '/marketingActivity/activityInfo/viewActivity',
          query: {
            activity_id: record.id,
          },
        });
      };

      getListData = (
        name: string,
        area_id: string,
        status: string,
        currentPage: any,
        currentPageSize: any,
      ) => {
        this.setState({
          loading: true,
        });
        request('/api/v1/activity/recruit', {
          method: 'GET',
          params: {
            name,
            area_id,
            status,
            page: currentPage,
            count: currentPageSize,
          },
        }).then(res => {
          if (res.status_code == 200) {
            this.setState({
              dataList: res.data,
              loading: false,
              total: res.pagination.total,
            });
          }
        });
      };

      getAreaList = () => {
        request('/api/common/area', {
          method: 'GET',
        }).then(res => {
          this.setState({
            areaList: res.data,
          });
        });
      };

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        // console.log('Various parameters', pagination, filters, sorter);
        console.log(pagination);
        await this.props.dispatch({
          type: 'activityInfo/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        // this.setState({
        //   filteredInfo: filters,
        //   sortedInfo: sorter,
        // });
        const { currentPage, currentPageSize } = this.props.activityInfo;
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let status = this.props.form.getFieldValue('status');
        this.getListData(activityName, storeName, status, currentPage, currentPageSize);
      };

      handleSearch = async (e: any) => {
        let ID = this.props.form.getFieldValue('ID');
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let status = this.props.form.getFieldValue('status');
        e.preventDefault();
        await this.props.dispatch({
          type: 'activityInfo/setFussyForm',
          payload: {
            ID,
            storeName,
            activityName,
            status,
          },
        });

        const { currentPage, currentPageSize } = this.props.activityInfo;

        this.getListData(activityName, storeName, status, currentPage, currentPageSize);
      };
      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'activityInfo/resetFussySearch',
        });
      };
      toggleForm = async () => {
        await this.props.dispatch({
          type: 'activityInfo/switchExpandForm',
        });
      };

      renderForm() {
        const { expandForm } = this.props.activityInfo;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
      }

      addActivity() {
        router.push('/marketingActivity/activityInfo/addActivity');
      }

      handleCheckStoreActivity = async (record: any) => {
        await this.props.dispatch({
          type: 'merchantCard/resetPageModel',
        });
        router.push({
          pathname: '/marketingActivity/merchantcard/cardList',
          query: {
            activity_id: record.id,
          },
        });
      };

      renderAdvancedForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { ID, activityName, storeName, status } = this.props.activityInfo;
        const { areaList } = this.state;
        return (
          <Form onSubmit={this.handleSearch.bind(this)} layout="inline" ref="fussy_search_form">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="活动名称">
                  {getFieldDecorator('activityName', { initialValue: activityName })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="商圈名称">
                  {getFieldDecorator('storeName', { initialValue: storeName })(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      {areaList.map((item: any) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
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
                  <a
                    style={{
                      marginLeft: 8,
                    }}
                    onClick={this.toggleForm}
                  >
                    收起 <Icon type="up" />
                  </a>
                </span>
              </Col>
            </Row>
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="活动状态">
                  {getFieldDecorator('status', { initialValue: status })(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="0">未生效</Option>
                      <Option value="1">招募中</Option>
                      <Option value="2">已结束</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        );
      }

      renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { ID, activityName, storeName } = this.props.activityInfo;
        const { areaList } = this.state;
        return (
          <Form onSubmit={this.handleSearch.bind(this)} layout="inline">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="活动名称">
                  {getFieldDecorator('activityName', { initialValue: activityName })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="商圈名称">
                  {getFieldDecorator('storeName', { initialValue: storeName })(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      {areaList.map((item: any) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
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
                  <a
                    style={{
                      marginLeft: 8,
                    }}
                    onClick={this.toggleForm}
                  >
                    展开 <Icon type="down" />
                  </a>
                </span>
              </Col>
            </Row>
          </Form>
        );
      }
      deletsActivity = (record: any) => {
        console.log(record);
        let url = '/api/v1/activity/recruit/' + record.id;
        request(url, { method: 'DELETE' }).then(res => {
          console.log(res);
          if (res.status_code == 200) {
            notification.success({ message: res.message });
            const {
              activityName,
              storeName,
              status,
              currentPage,
              currentPageSize,
            } = this.props.activityInfo;
            this.getListData(activityName, storeName, status, currentPage, currentPageSize);
          } else {
            notification.open({ message: res.message });
          }
        });
      };
      showDeleteConfirm = (record: any) => {
        let that = this;
        confirm({
          title: '删除操作',
          content: '确定要删除该活动吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            that.deletsActivity(record);
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };

      render() {
        let { sortedInfo, filteredInfo, dataList, loading, total } = this.state;
        const { currentPage, currentPageSize } = this.props.activityInfo;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            // key: 'id',
            // sorter: (a, b) => a.id - b.id,
            // sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '活动名称',
            dataIndex: 'name',
            // key: 'name',
            // sorter: (a, b) => a.name.length - b.name.length,
            // sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '活动商圈',
            dataIndex: 'area_name',
            // key: 'area_name',
            // sorter: (a, b) => a.area_name.length - b.area_name.length,
            // sortOrder: sortedInfo.columnKey === 'area_name' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '招募时间',
            dataIndex: 'enlistTime',
            // key: 'enlistTime',
            // sorter: (a, b) => a.enlistTime - b.enlistTime,
            // sortOrder: sortedInfo.columnKey === 'enlistTime' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '活动状态',
            dataIndex: 'status_name',
            // key: 'status_name',
            // sorter: (a, b) => a.status_name.length - b.status_name.length,
            // sortOrder: sortedInfo.columnKey === 'status_name' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '操作',
            // key: 'operation',
            width: 350,
            render: (text: any, record: any) => (
              <span>
                {record.status == 0 ? (
                  <span>
                    <a onClick={this.handleCheckActivity.bind(this, record)}>查看活动</a>
                    <Divider type="vertical" />
                    <a onClick={this.showDeleteConfirm.bind(this, record)}>删除活动</a>
                  </span>
                ) : record.status == 1 ? (
                  <span>
                    <a onClick={this.handleCheckActivity.bind(this, record)}>查看活动</a>
                    <Divider type="vertical" />
                    <a onClick={this.handleEnlist.bind(this, record)}>暂停招募</a>
                    <Divider type="vertical" />
                    <a onClick={this.handleCheckStoreActivity.bind(this, record)}>查看商家活动</a>
                  </span>
                ) : record.status == 2 ? (
                  <span>
                    <a onClick={this.handleCheckActivity.bind(this, record)}>查看活动</a>
                    <Divider type="vertical" />
                    <a onClick={this.handleCheckStoreActivity.bind(this, record)}>查看商家活动</a>
                  </span>
                ) : (
                  ''
                )}
              </span>
            ),
          },
        ];
        return (
          <ConfigProvider locale={zhCN}>
            <div>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <Button
                type="primary"
                icon="plus"
                className={styles.addActivity}
                onClick={this.addActivity}
              >
                新增活动
              </Button>
              <Table
                columns={columns}
                dataSource={dataList}
                onChange={this.handleChange}
                rowKey="id"
                loading={loading}
                pagination={{
                  current: currentPage,
                  // defaultCurrent: currentPage,
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
          </ConfigProvider>
        );
      }
    },
  ),
);
