import React, { Component } from 'react';
import {
  Table,
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Row,
  Select,
  Modal,
  ConfigProvider,
  message,
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
import request from '@/utils/request';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

// const data = [
//   {
//     key: '1',
//     num: '1',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '2',
//     num: '2',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '3',
//     num: '3',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '4',
//     num: '4',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '5',
//     num: '5',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '6',
//     num: '6',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '7',
//     num: '7',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '8',
//     num: '8',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '9',
//     num: '9',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '10',
//     num: '10',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '11',
//     num: '11',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '12',
//     num: '12',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '13',
//     num: '13',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
//   {
//     key: '14',
//     num: '14',
//     card_id: 'PC9527',
//     store_name: '多美蛋糕店',
//     address: '广东省广州市',
//     telphone: 13666666666,
//     card_time: '2019-10-10 15:30:30',
//     card_type: '现金券',
//     card_name: '50元代金券',
//     store_price: '50元',
//     card_status: '未审核',
//     card_num: 1000,
//   },
// ];

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  cardID: any;
  activityName: any;
  storeName: any;
  cardStatus: any;
  expandForm: Boolean;
  currentPage: Number;
  currentPageSize: Number;
  location: any;
  merchantCard: any;
}

export default Form.create()(
  connect(({ merchantCard, cardManage }: any) => ({ merchantCard, cardManage }))(
    class MerchantCard extends Component<Props> {
      state = {
        filteredInfo: {},
        sortedInfo: {},
        visible: false,

        dataList: [],
        loading: false,
        areaList: [],
        total: 0,
        rejectReason: '',
        record: {},
      };

      componentDidMount = async () => {
        /**
         * 判断 sessionStorage 有没 cardmanage
         * true -- 清除数据再重新请求列表数据
         */
        // const { dispatch } = this.props;
        // if (window.sessionStorage.getItem("cardmanage")) {
        //   await dispatch({
        //     type: "merchantCard/resetPageModel"
        //   })
        //   // 请求列表数据
        // }

        const {
          activityName,
          storeName,
          cardStatus,
          currentPage,
          currentPageSize,
        } = this.props.merchantCard;
        this.getListData(activityName, storeName, cardStatus, currentPage, currentPageSize);

        this.getAreaList();

        console.log(this.props);
      };

      handlePass = (record: any) => {
        let _this = this;
        confirm({
          title: '确认操作',
          content: '确定要通过该活动吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request(`/api/v1/activity/recruit/card/${record.id}`, {
              method: 'PUT',
              params: {
                status: 1,
              },
            }).then(res => {
              const {
                activityName,
                storeName,
                cardStatus,
                currentPage,
                currentPageSize,
              } = _this.props.merchantCard;
              _this.getListData(activityName, storeName, cardStatus, currentPage, currentPageSize);
            });
          },
          onCancel() {
            console.log('Cancel');
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
        const {
          location: {
            query: { activity_id },
          },
        } = this.props;
        request('/api/v1/activity/recruit/card', {
          method: 'GET',
          params: {
            activity_id,
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

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        // console.log('Various parameters', pagination, filters, sorter);
        await this.props.dispatch({
          type: 'merchantCard/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        // this.setState({
        //   filteredInfo: filters,
        //   sortedInfo: sorter,
        // });
        const { currentPage, currentPageSize } = this.props.merchantCard;
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let cardStatus = this.props.form.getFieldValue('cardStatus');
        this.getListData(activityName, storeName, cardStatus, currentPage, currentPageSize);
      };

      handleSearch = async (e: any) => {
        e.preventDefault();
        let cardID = this.props.form.getFieldValue('cardID');
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let cardStatus = this.props.form.getFieldValue('cardStatus');
        await this.props.dispatch({
          type: 'merchantCard/setFussyForm',
          payload: {
            cardID,
            storeName,
            activityName,
            cardStatus,
          },
        });
        const { currentPage, currentPageSize } = this.props.merchantCard;

        this.getListData(activityName, storeName, cardStatus, currentPage, currentPageSize);
      };

      handleReject = (record: any) => {
        this.setState({
          record,
          visible: true,
        });
      };

      handleFormReset = () => {
        const { form, dispatch } = this.props;
        dispatch({
          type: 'merchantCard/resetFussySearch',
        });
        form.resetFields();
      };

      toggleForm = () => {
        this.props.dispatch({
          type: 'merchantCard/switchExpandForm',
        });
      };

      renderAdvancedForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { cardID, activityName, storeName, cardStatus } = this.props.merchantCard;
        const { areaList } = this.state;
        return (
          <Form onSubmit={this.handleSearch} layout="inline" ref="fussy_search_form">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              {/* <Col md={8} sm={24}>
                <FormItem label="卡券ID">
                  {getFieldDecorator('cardID', { initialValue: cardID })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col> */}
              <Col md={8} sm={24}>
                <FormItem label="卡券名称">
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
                <FormItem label="卡券状态">
                  {getFieldDecorator('cardStatus', { initialValue: cardStatus })(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="0">未审核</Option>
                      <Option value="1">已通过</Option>
                      <Option value="2">已拒绝</Option>
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
        const { cardID, activityName, storeName } = this.props.merchantCard;
        const { areaList } = this.state;
        return (
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              {/* <Col md={8} sm={24}>
                <FormItem label="卡券ID">
                  {getFieldDecorator('cardID', { initialValue: cardID })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col> */}
              <Col md={8} sm={24}>
                <FormItem label="卡券名称">
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

      renderForm() {
        const { expandForm } = this.props.merchantCard;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
      }

      handleDetails = (record: any) => {
        router.push({
          pathname: '/marketingActivity/merchantcard/detail',
          query: {
            id: record.id,
          },
        });
      };

      handleOk = (e: any) => {
        const { rejectReason, record } = this.state;
        if (!rejectReason) {
          message.error('请输入拒绝原因');
          return;
        }
        request(`/api/v1/activity/recruit/card/${record.id}`, {
          method: 'PUT',
          params: {
            status: 2,
            reason: rejectReason,
          },
        }).then(res => {
          const {
            activityName,
            storeName,
            cardStatus,
            currentPage,
            currentPageSize,
          } = this.props.merchantCard;
          this.getListData(activityName, storeName, cardStatus, currentPage, currentPageSize);
          this.setState(
            {
              visible: false,
              rejectReason: '',
            },
            () => {
              console.log(this.state);
            },
          );
        });
      };

      handleCancel = (e: any) => {
        this.setState({
          visible: false,
        });
      };

      handleChangeRejectReason = (e: any) => {
        if (e.target.value.length <= 60) {
          this.setState({
            rejectReason: e.target.value,
          });
        }
      };

      handleDelete = (record: any) => {
        let _this = this;
        confirm({
          title: '删除操作',
          content: '确定要删除该卡券吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request('/api/v1/activity/recruit/card', {
              method: 'DELETE',
              params: {
                youhui_id: record.youhui_id
              }
            }).then(res => {
              if (res.status_code == 200) {
                message.success(res.message);
              } else {
                message.error(res.message);
              }
              const {
                activityName,
                storeName,
                cardStatus,
                currentPage,
                currentPageSize,
              } = _this.props.merchantCard;
              _this.getListData(activityName, storeName, cardStatus, currentPage, currentPageSize);
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      render() {
        let { sortedInfo, filteredInfo, dataList, loading, total, rejectReason } = this.state;
        const { currentPage, currentPageSize } = this.props.merchantCard;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            // sorter: (a, b) => a.id.length - b.id.length,
            // sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '卡券ID',
            dataIndex: 'youhui_id',
            key: 'youhui_id',
            // sorter: (a, b) => a.card_id - b.card_id,
            // sortOrder: sortedInfo.columnKey === 'card_id' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '商户名称',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
            // sorter: (a, b) => a.store_name.length - b.store_name.length,
            // sortOrder: sortedInfo.columnKey === 'store_name' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '所属商圈',
            dataIndex: 'area_name',
            key: 'area_name',
            // sorter: (a, b) => a.address.length - b.address.length,
            // sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '联系电话',
            dataIndex: 'supplier_phone',
            key: 'supplier_phone',
            // sorter: (a, b) => a.telphone.length - b.telphone.length,
            // sortOrder: sortedInfo.columnKey === 'telphone' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '发券时间',
            dataIndex: 'youhui_create_time',
            key: 'youhui_create_time',
            // sorter: (a, b) => a.card_time.length - b.card_time.length,
            // sortOrder: sortedInfo.columnKey === 'card_time' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '卡券类型',
            dataIndex: 'youhui_type_name',
            key: 'youhui_type_name',
            // sorter: (a, b) => a.card_type.length - b.card_type.length,
            // sortOrder: sortedInfo.columnKey === 'card_type' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '卡券名称',
            dataIndex: 'youhui_name',
            key: 'youhui_name',
            // sorter: (a, b) => a.card_type.length - b.card_type.length,
            // sortOrder: sortedInfo.columnKey === 'card_type' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '商品价值',
            dataIndex: 'youhui_price',
            key: 'youhui_price',
            // sorter: (a, b) => a.store_price.length - b.store_price.length,
            // sortOrder: sortedInfo.columnKey === 'store_price' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '卡券状态',
            dataIndex: 'youhui_publish_wait',
            key: 'youhui_publish_wait',
            // sorter: (a, b) => a.card_status.length - b.card_status.length,
            // sortOrder: sortedInfo.columnKey === 'card_status' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '数量',
            dataIndex: 'youhui_total_num',
            key: 'youhui_total_num',
            // sorter: (a, b) => a.card_num.length - b.card_num.length,
            // sortOrder: sortedInfo.columnKey === 'card_num' && sortedInfo.order,
            // ellipsis: true,
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text: any, record: any) => (
              <span>
                {record.youhui_publish_wait == '未审核' ? (
                  <span>
                    <a onClick={this.handleDetails.bind(this, record)}>查看</a>
                    <Divider type="vertical" />
                    <a onClick={this.handlePass.bind(this, record)}>通过</a>
                    <Divider type="vertical" />
                    <a onClick={this.handleReject.bind(this, record)}>拒绝</a>
                  </span>
                ) : record.youhui_publish_wait == '已通过' ? (
                  <span>
                    <a onClick={this.handleDetails.bind(this, record)}>查看</a>
                  </span>
                ) : record.youhui_publish_wait == '已拒绝' ? (
                  <span>
                    <a onClick={this.handleDetails.bind(this, record)}>查看</a>
                    <Divider type="vertical" />
                    <a onClick={this.handlePass.bind(this, record)}>通过</a>
                  </span>
                ) : (
                        ''
                      )}
                {record.recruit_status == 1 ? (
                  <span>
                    <Divider type="vertical" />
                    <a onClick={this.handleDelete.bind(this, record)}>删除</a>
                  </span>
                ) : ''}
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
                  // onChange: (page:any,pageSize:any) => {
                  //   console.log('page',page);
                  //   console.log('pageSize',pageSize);
                  // }
                }}
              />
              <Modal
                title="请输入拒绝原因"
                centered
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确定"
                cancelText="取消"
              >
                <TextArea
                  rows={4}
                  onChange={this.handleChangeRejectReason.bind(this)}
                  value={rejectReason}
                />
              </Modal>
            </div>
          </ConfigProvider>
        );
      }
    },
  ),
);
