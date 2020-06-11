import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Form, Button, Select, Input, DatePicker, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';
import { router } from 'umi';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker, } = DatePicker;

interface Props {
  form: any;
  dispatch: (opt: any) => any;
  communityList: any

}

export default Form.create()(
  connect(({ communityList }: any) => ({ communityList }))(
    class AuditDetails extends Component<Props> {
      state = {
        dataList: [],
        loading: false,
        total: 10,
      }

      componentDidMount() {
        // 获取列表
        this.props.dispatch({ type: 'communityList/getList', payload: { page: 1, count: 10 } })
      }

      handleChange = (pagination: any, ) => {
        console.log(pagination)
        const page = pagination.current
        let { name, mobile, created_at, user_add_at } = this.props.communityList;
        if (created_at) {
          created_at = `${moment(created_at[0]).format('YYYY-MM-DD')}/${moment(created_at[1]).format('YYYY-MM-DD')}`
        }
        if (user_add_at) {
          user_add_at = `${moment(user_add_at[0]).format('YYYY-MM-DD')}/${moment(user_add_at[1]).format('YYYY-MM-DD')}`
        }

        const payload = {
          name: name ? name : undefined,
          mobile: mobile ? mobile : undefined,
          created_at: created_at ? created_at : undefined,
          user_add_at: user_add_at ? user_add_at : undefined,
          count: 10,
          page
        }
        this.props.dispatch({
          type: 'communityList/setState',
          payload: {
            page
          }
        })
        this.props.dispatch({ type: 'communityList/getList', payload })

      }

      onSearch = (e: any) => {
        e.preventDefault();
        let name = this.props.form.getFieldValue('name');
        let mobile = this.props.form.getFieldValue('mobile');
        let created_at = this.props.form.getFieldValue('created_at');
        let user_add_at = this.props.form.getFieldValue('user_add_at');
        let examine_status = this.props.form.getFieldValue('examine_status');
        this.props.dispatch({
          type: 'communityList/setState',
          payload: {
            name,
            mobile,
            created_at,
            user_add_at,
            examine_status
          }
        })
        if (created_at) {
          created_at = `${moment(created_at[0]).format('YYYY-MM-DD')}/${moment(created_at[1]).format('YYYY-MM-DD')}`
        }
        if (user_add_at) {
          user_add_at = `${moment(user_add_at[0]).format('YYYY-MM-DD')}/${moment(user_add_at[1]).format('YYYY-MM-DD')}`
        }
        const payload = {
          name: name ? name : undefined,
          mobile: mobile ? mobile : undefined,
          created_at: created_at ? created_at : undefined,
          user_add_at: user_add_at ? user_add_at : undefined,
          examine_status: examine_status,
          count: 10
        }
        this.props.dispatch({ type: 'communityList/getList', payload })
      }

      goto = (id: string) => {
        router.push('/communityManagement/audit-details?id=' + id)
      }

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'communityList/resetFussySearch',
        });
        this.props.dispatch({ type: 'communityList/getList', payload: { page: 1, count: 10 } })
      };

      render() {
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;
        const { dataList, name, user_add_at, created_at, mobile, page, total, examine_status } = this.props.communityList;
        console.log(created_at, 'created_at')
        const columns = [
          {
            title: '提交审核时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 100
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 100
          },
          {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 100
          },
          {
            title: '社群角色',
            dataIndex: 'grade',
            key: 'grade',
            width: 100
          },
          {
            title: '升级后角色',
            dataIndex: 'upgrade_role',
            key: 'upgrade_role',
            width: 100
          },
          {
            title: '用户注册时间',
            dataIndex: 'user_add_at',
            key: 'user_add_at',
            width: 100
          },
          {
            title: '审核状态',
            dataIndex: 'examine_status',
            key: 'examine_status',
            width: 100,
            render: (res: any) => {
              return <div>{res == 1 ? '通过' : res == 2 ? '拒绝' : res == 0 ? '待审核' : null}</div>
            }
          },
          {
            title: '操作',
            key: 'operation',
            width: 100,
            align: 'center',
            render: (res: any, record: any) => {
              return <div>
                {
                  record.examine_status == 1 ? <Button type="link" disabled>
                    审核申请
              </Button> : record.examine_status == 2 ? <Button type="link" onClick={this.goto.bind(this, record.id)} disabled>
                      审核申请
              </Button> : record.examine_status == 0 ? <Button type="link" onClick={this.goto.bind(this, record.id)}>
                        审核申请
              </Button> : null
                }
              </div>
            }
          },

        ]
        return (
          <div className={styles.listPage}>
            <Form layout="inline" onSubmit={this.onSearch.bind(this)}>
              <Row
                gutter={{
                  md: 8,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={8} sm={24}>
                  <FormItem label='注册时间'>
                    {getFieldDecorator('user_add_at', { initialValue: user_add_at })(
                      <RangePicker />
                    )}

                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label='申请时间'>
                    {getFieldDecorator('created_at', { initialValue: created_at })(
                      <RangePicker />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label='手机号'>
                    {getFieldDecorator('mobile', { initialValue: mobile })(
                      <Input />
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
                <Col md={6} sm={24}>
                  <FormItem label='个人名称'>
                    {getFieldDecorator('name', { initialValue: name })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label='审核状态'>
                    {getFieldDecorator('examine_status', { initialValue: examine_status })(
                      <Select value={examine_status} style={{width: 150}}>
                        <Option value={0}>待审核</Option>
                        <Option value={1}>通过</Option>
                        <Option value={2}>拒绝</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={5} sm={26}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button onClick={this.handleFormReset}>
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
              onChange={this.handleChange}
              pagination={{
                current: page,
                pageSize: 10,
                total
              }}
            />
          </div>
        )
      }
    }

  )

)
