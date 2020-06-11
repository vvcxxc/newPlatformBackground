import React, { Component } from 'react';
import { Table, Button, Col, Form, Icon, Input, Row, Select, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
import request from '@/utils/request';

const FormItem = Form.Item;
const { Option } = Select;

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
  cardManage: any;
}

export default Form.create()(
  connect(({ cardManage, merchantCard }: any) => ({ cardManage, merchantCard }))(
    class CardManage extends Component<Props> {
      state = {
        filteredInfo: {},
        sortedInfo: {},
        dataList: [],
        areaList: [],
        loading: false,
        total: 0,
      };

      componentDidMount() {
        // 设置已存在此组件
        window.sessionStorage.setItem('cardmanage', 'true');

        const {
          activityName,
          storeName,
          status,
          currentPage,
          currentPageSize,
        } = this.props.cardManage;
        this.getListData(activityName, storeName, status, currentPage, currentPageSize);

        this.getAreaList();

        console.log(this.props);
      }

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
          this.setState({
            dataList: res.data,
            loading: false,
            total: res.pagination.total,
          });
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

      handleSearch = async (e: any) => {
        let ID = this.props.form.getFieldValue('ID');
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let status = this.props.form.getFieldValue('status');
        e.preventDefault();
        await this.props.dispatch({
          type: 'cardManage/setFussyForm',
          payload: {
            ID,
            storeName,
            activityName,
            status,
          },
        });

        const { currentPage, currentPageSize } = this.props.cardManage;

        this.getListData(activityName, storeName, status, currentPage, currentPageSize);
      };
      handleFormReset = async () => {
        const { form } = this.props;
        const { dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'cardManage/resetFussySearch',
        });
      };
      toggleForm = async () => {
        await this.props.dispatch({
          type: 'cardManage/switchExpandForm',
        });
      };

      renderForm() {
        const { expandForm } = this.props.cardManage;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
      }

      renderAdvancedForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { ID, activityName, storeName, status } = this.props.cardManage;
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
              {/* <Col md={8} sm={24}>
                <FormItem label="ID">
                  {getFieldDecorator('ID', { initialValue: ID })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col> */}
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
        const { ID, activityName, storeName } = this.props.cardManage;
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
              {/* <Col md={8} sm={24}>
                <FormItem label="ID">
                  {getFieldDecorator('ID', { initialValue: ID })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col> */}
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

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        // console.log('Various parameters', pagination, filters, sorter);
        await this.props.dispatch({
          type: 'cardManage/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        // this.setState({
        //   filteredInfo: filters,
        //   sortedInfo: sorter,
        // });
        const { currentPage, currentPageSize } = this.props.cardManage;
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let status = this.props.form.getFieldValue('status');
        this.getListData(activityName, storeName, status, currentPage, currentPageSize);
      };

      handleCheckStoreActivity = async (record: any) => {
        // console.log(record);
        await this.props.dispatch({
          type: 'merchantCard/resetPageModel',
        });
        router.push({
          pathname: '/marketingActivity/merchantcard/cardList',
          query: {
            // go: 1, // 是否为前进页面
            activity_id: record.id,
          },
        });
      };

      render() {
        let { sortedInfo, filteredInfo, dataList, loading, total } = this.state;
        const { currentPage, currentPageSize } = this.props.cardManage;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            // sorter: (a, b) => a.num.length - b.num.length,
            // sortOrder: sortedInfo.columnKey === 'num' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '活动名称',
            dataIndex: 'name',
            key: 'name',
            // sorter: (a, b) => a.activityName.length - b.activityName.length,
            // sortOrder: sortedInfo.columnKey === 'activityName' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '活动商圈',
            dataIndex: 'area_name',
            key: 'area_name',
            // sorter: (a, b) => a.area_name.length - b.area_name.length,
            // sortOrder: sortedInfo.columnKey === 'area_name' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '招募时间',
            dataIndex: 'enlistTime',
            key: 'enlistTime',
            // sorter: (a, b) => a.enlistTime.length - b.enlistTime.length,
            // sortOrder: sortedInfo.columnKey === 'enlistTime' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '活动状态',
            dataIndex: 'status_name',
            key: 'status_name',
            // sorter: (a, b) => a.activityStatus.length - b.activityStatus.length,
            // sortOrder: sortedInfo.columnKey === 'activityStatus' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text: any, record: any) => (
              <span>
                <a onClick={this.handleCheckStoreActivity.bind(this, record)}>查看商家活动</a>
              </span>
            ),
          },
        ];
        return (
          <ConfigProvider locale={zhCN}>
            <div>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <Table
                columns={columns}
                dataSource={dataList}
                loading={loading}
                onChange={this.handleChange}
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
