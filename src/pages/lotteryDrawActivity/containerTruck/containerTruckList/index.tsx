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
  message
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
  form: any;
  dispatch: (opt: any) => any;
  containerTruckList: any;
}

export default Form.create()(
  connect(({ containerTruckList }: any) => ({ containerTruckList }))(
    class ContainerTruckList extends Component<Props> {
      state = {
        dataList: [],
        areaList: [],
        loading: false,
        total: 0,
      };

      componentDidMount() {
        // console.log(this.props);

        const {
          activityName,
          storeName,
          status,
          currentPage,
          currentPageSize,
        } = this.props.containerTruckList;
        this.getListData(activityName, storeName, status, currentPage, currentPageSize);

        this.getAreaList();
      }

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
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let status = this.props.form.getFieldValue('status');
        e.preventDefault();
        await this.props.dispatch({
          type: 'containerTruckList/setFussyForm',
          payload: {
            storeName,
            activityName,
            status,
          },
        });

        const { currentPage, currentPageSize } = this.props.containerTruckList;

        this.getListData(activityName, storeName, status, currentPage, currentPageSize);
      };

      getListData = (activity_name: string, storeName: string, status: string, currentPage: any, currentPageSize: any) => {
        this.setState({
          loading: true,
        });
        request('/api/v1/activity/cardcollecting', {
          method: 'GET',
          params: {
            name: activity_name,
            status,
            area_id: storeName,
            page: currentPage,
            count: currentPageSize
          }
        }).then(res => {
          this.setState({
            dataList: res.data,
            loading: false,
            total: res.pagination.total,
          })
        })
      }

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        await this.props.dispatch({
          type: 'containerTruckList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        const { currentPage, currentPageSize } = this.props.containerTruckList;
        let status = this.props.form.getFieldValue('status');
        let activityName = this.props.form.getFieldValue('activityName');
        let storeName = this.props.form.getFieldValue('storeName');
        this.getListData(activityName, storeName, status, currentPage, currentPageSize);
      };

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'containerTruckList/resetFussySearch',
        });
      };

      toggleForm = async () => {
        await this.props.dispatch({
          type: 'containerTruckList/switchExpandForm',
        });
      };

      renderForm() {
        const { expandForm } = this.props.containerTruckList;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
      }

      renderAdvancedForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { activityName, storeName, status } = this.props.containerTruckList;
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
                      <Option value="1">进行中</Option>
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
        const { activityName, storeName } = this.props.containerTruckList;
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

      handleDeleteActivity = (record: any) => {
        // console.log(record);
        let _this = this;
        confirm({
          title: '删除操作',
          content: '确定要删除该活动吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request(`/api/v1/activity/cardcollecting/${record.id}`, {
              method: 'DELETE',
            }).then(res => {
              message.success(res.message);
              const {
                activityName,
                storeName,
                status,
                currentPage,
                currentPageSize,
              } = _this.props.containerTruckList;
              _this.getListData(activityName, storeName, status, currentPage, currentPageSize);
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      handleEnd = (record: any) => {
        // console.log(record);
        let _this = this;
        confirm({
          title: '立即结束',
          content: '确定要立即结束该活动吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request("/api/v1/activity/cardcollecting/stopIt", {
              method: 'POST',
              data: {
                id: record.id,
                status: 2
              }
            }).then(res => {
              message.success(res.message);
              const {
                activityName,
                storeName,
                status,
                currentPage,
                currentPageSize,
              } = _this.props.containerTruckList;
              _this.getListData(activityName, storeName, status, currentPage, currentPageSize);
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      addActivity = () => {
        router.push('/lotteryDrawActivity/containerTruck/addActivity');
      }

      Goto = (type: string, id: any) => {
        console.log(type, id)
        if (type == 'view') {
          router.push('/lotteryDrawActivity/containerTruck/viewActivity?id=' + id)
        } else if (type == 'edit') {
          router.push('/lotteryDrawActivity/containerTruck/editActivity?id=' + id)
        }
      }

      render() {
        const { dataList, loading, total } = this.state;
        const { currentPage, currentPageSize } = this.props.containerTruckList;
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '活动名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '活动区域',
            dataIndex: 'areaname',
            key: 'areaname',
          },
          {
            title: '活动时间',
            dataIndex: 'activity_time',
            key: 'activity_time',
          },
          {
            title: '卡片数量',
            dataIndex: 'card_number',
            key: 'card_number',
          },
          {
            title: '抽奖条件',
            dataIndex: 'lucky_draw_number',
            key: 'lucky_draw_number',
          },
          {
            title: '活动状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: any, record: any) => (
              <span>
                {
                  record.status == 0 ? (
                    <span>未生效</span>
                  ) : record.status == 1 ? (
                    <span>已开始</span>
                  ) : record.status == 2 ? (
                    <span>已结束</span>
                  ) : ""
                }
              </span>
            )
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text: any, record: any) => (
              <span>
                <a onClick={this.Goto.bind(this, 'view', text.id)}>查看</a>
                <Divider type="vertical" />
                <a onClick={this.Goto.bind(this, 'edit', text.id)}>编辑</a>
                {
                  record.status == 0 ? (
                    <span>
                      <Divider type="vertical" />
                      <a onClick={this.handleDeleteActivity.bind(this, record)}>删除活动</a>
                    </span>
                  ) : record.status == 1 ? (
                    <span>
                      <Divider type="vertical" />
                      <a onClick={this.handleEnd.bind(this, record)}>立即结束</a>
                    </span>
                  ) : ""
                }
              </span>
            ),
          },
        ]
        return (
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
        );
      }
    },
  ),
);
