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
  jackPotList: any;
  currentPage: Number;
  currentPageSize: Number;
}

export default Form.create()(
  connect(({ jackPotList }: any) => ({ jackPotList }))(
    class JackPotList extends Component<Props> {
      state = {
        dataList: [],
        loading: false,
        total: 0,
      };

      componentDidMount() {
        const {
          activityName,
          jackPotName,
          // activityStatus,
          currentPage,
          currentPageSize,
        } = this.props.jackPotList;
        // this.getListData(activityName, activityStatus, currentPage, currentPageSize);
        this.getListData(activityName, jackPotName, currentPage, currentPageSize);
      }

      handleSearch = async (e: any) => {
        // let activityStatus = this.props.form.getFieldValue('activityStatus');
        let activityName = this.props.form.getFieldValue('activityName');
        let jackPotName = this.props.form.getFieldValue('jackPotName');
        e.preventDefault();
        await this.props.dispatch({
          type: 'jackPotList/setFussyForm',
          payload: {
            // activityStatus,
            activityName,
            jackPotName
          },
        });

        const { currentPage, currentPageSize } = this.props.jackPotList;

        // this.getListData(activityName, activityStatus, currentPage, currentPageSize);
        this.getListData(activityName, jackPotName, currentPage, currentPageSize);
      };

      // getListData = (activity_name: string, status: string, currentPage: any, currentPageSize: any) => {
      //   this.setState({
      //     loading: true,
      //   });
      //   request('/api/v1/pools', {
      //     method: 'GET',
      //     params: {
      //       activity_name,
      //       status,
      //       page: currentPage,
      //       count: currentPageSize
      //     }
      //   }).then(res => {
      //     this.setState({
      //       dataList: res.data,
      //       loading: false,
      //       total: res.pagination.total,
      //     })
      //   })
      // }

      getListData = (activity_name: string, jackPotName: string, currentPage: any, currentPageSize: any) => {
        this.setState({
          loading: true,
        });
        request('/api/v1/pools', {
          method: 'GET',
          params: {
            activity_name,
            pools_name: jackPotName,
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

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'jackPotList/resetFussySearch',
        });
      };

      renderForm() {
        return this.renderSimpleForm();
      }

      renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        // const { activityName, activityStatus } = this.props.jackPotList;
        const { activityName, jackPotName } = this.props.jackPotList;
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
                <FormItem label="奖池名称">
                  {getFieldDecorator('jackPotName', { initialValue: jackPotName })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="活动名称">
                  {getFieldDecorator('activityName', { initialValue: activityName })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              {/* <Col md={8} sm={24}>
                <FormItem label="活动状态">
                  {getFieldDecorator('activityStatus', { initialValue: activityStatus })(
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
              </Col> */}
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
                </span>
              </Col>
            </Row>
          </Form>
        );
      }

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        await this.props.dispatch({
          type: 'jackPotList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        const { currentPage, currentPageSize } = this.props.jackPotList;
        // let activityStatus = this.props.form.getFieldValue('activityStatus');
        let activityName = this.props.form.getFieldValue('activityName');
        let jackPotName = this.props.form.getFieldValue('jackPotName');
        // this.getListData(activityName, activityStatus, currentPage, currentPageSize);
        this.getListData(activityName, jackPotName, currentPage, currentPageSize);
      };

      addJackPot() {
        router.push('/lotteryDrawActivity/jackPot/addJackPot');
      }

      goTo = (type: string, id: number) => {
        if (type == 'view') {
          router.push('/lotteryDrawActivity/jackPot/viewJackPot?id=' + id)
        } else {
          router.push('/lotteryDrawActivity/jackPot/editJackPot?id=' + id)
        }
      }

      handleDeletePools = (record: any) => {
        let _this = this;
        confirm({
          title: '删除操作',
          content: '确定要删除该活动吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request(`/api/v1/pools/${record.id}`, {
              method: 'DELETE',
            }).then(res => {
              if (res.status_code == 200) {
                message.success(res.message);
              } else {
                message.error(res.message);
              }
              const {
                activityName,
                jackPotName,
                currentPage,
                currentPageSize,
              } = _this.props.jackPotList;
              _this.getListData(activityName, jackPotName, currentPage, currentPageSize);
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      handleClearStorage = (id: any) => {
        let _this = this;
        confirm({
          title: '清除缓存',
          content: '确定要清除缓存吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request(`/api/v1/pools/clearCache/${id}`, {
              method: 'PUT',
            }).then(res => {
              if (res.status_code == 200) {
                message.success(res.message);
              } else {
                message.error(res.message);
              }
              const {
                activityName,
                jackPotName,
                currentPage,
                currentPageSize,
              } = _this.props.jackPotList;
              _this.getListData(activityName, jackPotName, currentPage, currentPageSize);
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      render() {
        const { dataList, loading, total } = this.state;
        const { currentPage, currentPageSize } = this.props.jackPotList;
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '奖池名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '奖池类型',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: '所属商圈',
            dataIndex: 'area_name',
            key: 'area_name',
          },
          {
            title: '关联活动',
            dataIndex: 'activity_name',
            key: 'activity_name',
          },
          // {
          //   title: '应用的抽奖活动',
          //   dataIndex: 'card_name',
          //   key: 'card_name',
          // },
          // {
          //   title: '抽奖活动状态',
          //   dataIndex: 'status',
          //   key: 'status',
          // },
          {
            title: '操作',
            key: 'operation',
            width: 300,
            render: (text: any, record: any) => (
              <span>
                <a onClick={this.handleClearStorage.bind(this, record.id)}>清除缓存</a>
                <Divider type="vertical" />
                <a onClick={this.goTo.bind(this, 'view', text.id)}>查看</a>
                <Divider type="vertical" />
                <a onClick={this.goTo.bind(this, 'edit', text.id)}>编辑</a>
                <Divider type="vertical" />
                <a onClick={this.handleDeletePools.bind(this, record)}>删除奖池</a>
                {/* {
                  record.status == "" ? (
                    <span>
                      <Divider type="vertical" />
                      <a onClick={this.handleDeletePools.bind(this, record)}>删除奖池</a>
                    </span>
                  ) : ""
                } */}
              </span>
            ),
          },
        ];
        return (
          <div>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Button
              type="primary"
              icon="plus"
              className={styles.addJackPot}
              onClick={this.addJackPot.bind(this)}
            >
              新增奖池
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
