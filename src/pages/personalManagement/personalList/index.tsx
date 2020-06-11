import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal } from 'antd'
import { connect } from "dva";
import moment from "moment";
import { router } from "umi";
const FormItem = Form.Item;
const { Option } = Select;
interface Props {
  form: any;
  dispatch: (opt: any) => any;
  containerTruckList: any;
  personalList: any
}
export default Form.create()(
  connect(({ personalList }: any) => ({ personalList }))(
    class PersonalList extends Component<Props>{
      state = {
        dataList: [],
        loading: false,
        total: 10,
      }
      componentDidMount(): void {
        const { currentPage, currentPageSize, name, mobile, start_date, end_date, status, type } = this.props.personalList;
        // console.log(this.props.personalList)
        let time;
        if (start_date && end_date) {
          time = moment(start_date).format('YYYY-MM-DD') + '/' + moment(end_date).format('YYYY-MM-DD');
        } else {
          time = undefined;
        }
        this.getListData(currentPage, currentPageSize, name, mobile, time, status, type);
      }

      onSearch = async (e: any) => {
        e.preventDefault();
        let name = this.props.form.getFieldValue('name');
        let mobile = this.props.form.getFieldValue('mobile');
        let start_date = this.props.form.getFieldValue('start_date');
        let end_date = this.props.form.getFieldValue('end_date');
        let status = this.props.form.getFieldValue('status');
        let type = this.props.form.getFieldValue('type');
        await this.props.dispatch({
          type: 'personalList/setSearchState',
          payload: {
            name,
            mobile,
            start_date,
            end_date,
            status,
            type
          },
        });

        const { currentPage, currentPageSize } = this.props.personalList;
        let time;
        if (start_date && end_date) {
          time = moment(start_date).format('YYYY-MM-DD') + '/' + moment(end_date).format('YYYY-MM-DD');
        } else {
          time = undefined;
        }
        this.getListData(currentPage, currentPageSize, name, mobile, time, status, type);
        // console.log(this.props.personalList)
        // console.log(moment(start_date).format('YYYY-MM-DD'))
      }

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'personalList/resetFussySearch',
        });
      };

      getListData = (currentPage: any, currentPageSize: any, name: any, mobile: any, time: any, status: any, type: any) => {
        this.setState({
          loading: true,
        });
        // const { name, mobile, start_date, end_date, status, type, currentPage } = this.props.personalList;
        request.get('/api/v1/ck/party_account/examine', {
          params: {
            page: currentPage,
            count: currentPageSize,
            name,
            mobile,
            time,
            payment_status: status,
            type
          }
        }).then(res => {
          console.log(res)
          if (res.status_code == 200) {
            this.setState({ dataList: res.data, loading: false, total: res.pagination.total })
          }
        })
      }

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        await this.props.dispatch({
          type: 'personalList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        const { currentPage, currentPageSize } = this.props.personalList;
        let name = this.props.form.getFieldValue('name');
        let mobile = this.props.form.getFieldValue('mobile');
        let start_date = this.props.form.getFieldValue('start_date');
        let end_date = this.props.form.getFieldValue('end_date');
        let status = this.props.form.getFieldValue('status');
        let type = this.props.form.getFieldValue('type');
        let time;
        if (start_date && end_date) {
          time = moment(start_date).format('YYYY-MM-DD') + '/' + moment(end_date).format('YYYY-MM-DD');
        } else {
          time = undefined;
        }
        // console.log(currentPage, currentPageSize)
        this.getListData(currentPage, currentPageSize, name, mobile, time, status, type);
      }

      handlePayAuditing = (text: any) => {
        router.push(`/merchantManagement/payAudit?phone=${text.phone}&type=2`)
      }

      handleLookPay = (text: any) => {
        router.push(`/merchantManagement/payAudit?phone=${text.phone}&type=2`)
      }

      render() {
        const { getFieldDecorator } = this.props.form;
        const { dataList, loading, total } = this.state;
        const { currentPage, currentPageSize, name, mobile, status, type, start_date, end_date } = this.props.personalList;
        const columns = [
          {
            title: '入驻时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 100
          },
          {
            title: '个人名称',
            dataIndex: 'name',
            key: 'name',
            width: 100
          },
          {
            title: '类型',
            dataIndex: 'pattern',
            key: 'pattern',
            width: 100
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 100
          },
          {
            title: '账户状态',
            dataIndex: 'payment_status',
            key: 'payment_status',
            width: 100
          },
          {
            title: '双乾认证状态',
            dataIndex: 'status',
            key: 'status',
            width: 100
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text: any, record: any) => (
              <span>
                {
                  (text.operation == 0) ? (
                    <span>
                      {
                        text.button_effective == 1 ? (<a onClick={this.handlePayAuditing.bind(this, text)}>支付审核</a>) : (<a style={{ color: '#ccc' }}>支付审核</a>)
                      }
                    </span>
                  ) : (
                      <span>
                        {
                          text.button_effective == 1 ? (<a onClick={this.handleLookPay.bind(this, text)}>查看支付</a>) : (<a style={{ color: '#ccc' }}>查看支付</a>)
                        }
                      </span>
                    )
                }
              </span>
            )
          }
        ]
        return (
          <div>
            <Form onSubmit={this.onSearch.bind(this)} layout="inline">
              <Row
                gutter={{
                  md: 8,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={5} sm={20}>
                  <FormItem label='个人名称'>
                    {getFieldDecorator('name', { initialValue: name })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={5} sm={20}>
                  <FormItem label='手机号'>
                    {getFieldDecorator('mobile', { initialValue: mobile })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label='入驻时间'>
                    <Form.Item
                      style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
                    >
                      {/* <DatePicker /> */}
                      {getFieldDecorator('start_date', { initialValue: start_date })(
                        <DatePicker />
                      )}
                    </Form.Item>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                    <Form.Item style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}>
                      {/* <DatePicker /> */}
                      {getFieldDecorator('end_date', { initialValue: end_date })(
                        <DatePicker />
                      )}
                    </Form.Item>
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
              <Row gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}>
                <Col md={5} sm={20}>
                  <FormItem label='账户状态' style={{ width: '100%' }}>
                    {getFieldDecorator('status', { initialValue: status })(
                      <Select placeholder="全部状态" style={{
                        width: '174px'
                      }}>
                        <Option value={1}>待审核</Option>
                        <Option value={2}>拒绝</Option>
                        <Option value={3}>通过</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={5} sm={20}>
                  <FormItem label='类型'>
                    {getFieldDecorator('type', { initialValue: type })(
                      <Select placeholder="全部类别" style={{
                        width: '174px'
                      }}>
                        <Option value={6}>创客</Option>
                        <Option value={5}>会长</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>

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
    }
  ))
