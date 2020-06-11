import React, { Component } from 'react'
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal } from 'antd'
import { connect } from 'dva';
import router from 'umi/router';
import QRCode  from 'qrcode';
interface Props {
  form: any;
  dispatch: (opt: any) => any;
  containerTruckList: any;
  merchantList: any
}
const FormItem = Form.Item;
const { Option } = Select;
export default Form.create()(
  connect(({ merchantList }: any) => ({ merchantList }))(
    class MerchantList extends Component<Props> {
      state = {
        dataList: [],
        loading: false,
        total: 10,
        visible: false,
        codeUrl: '',
        code: ''
      }
      componentDidMount() {
        this.getList()
      }

      getList = () => {
        this.setState({
          loading: true,
        });
        const { accountname, created, name, mobile, status, paystatus, page } = this.props.merchantList
        console.log(page)
        request.get('/api/v1/store', {
          params: {
            accountname,
            name,
            created,
            mobile,
            status,
            paystatus,
            page
          }
        }).then(res => {
          console.log(res)
          if(res.status_code == 200){
            this.setState({ dataList: res.data, loading: false, total: res.pagination.total, })
          }
        })
      }

      // 查看码
      viewCode = (id: any) => {
        request('/api/v1/store/getCode', {
          method: 'get',
          params: {
            supplier_id: id
          }
        }).then(res => {
          console.log(res)
          if (res.status_code == 200) {
            this.setState({code: res.data.url})
            QRCode.toDataURL(res.data.url).then((res: any) => {
              this.setState({ codeUrl: res, visible: true })
            })
          }
        })
      }
      // 关闭码
      handleCancel = () => {
        this.setState({visible:false})
      }

      onSearch = async (e: any) => {
        e.preventDefault();
        let accountname = this.props.form.getFieldValue('accountname');
        let name = this.props.form.getFieldValue('name');
        let start_date = this.props.form.getFieldValue('start_date');
        let end_date = this.props.form.getFieldValue('end_date');
        let mobile = this.props.form.getFieldValue('mobile');
        let status = this.props.form.getFieldValue('status');
        let paystatus = this.props.form.getFieldValue('paystatus');
        await this.props.dispatch({
          type: 'merchantList/setSearchItem',
          payload: {
            accountname,
            name,
            start_date,
            end_date,
            mobile,
            status,
            paystatus,
          }
        })
        this.getList()

      }

      handleFormReset = async () => {
        await this.props.dispatch({ type: 'merchantList/reset' })
        this.props.form.resetFields();
        this.getList()
      };

      // 操作
      Goto = (type: string, info: any) => {
        console.log(type, info)
        switch (type) {
          case 'viewStore':
            router.push('/merchantManagement/storeAudit?id=' + info.id)
            break
          case 'viewPay':
            router.push('/merchantManagement/payAudit?phone=' + info.mobile + '&type=1')
            break
          case 'viewCode':
            this.viewCode(info.id)
            break
          case 'setNum':
            router.push('/merchantManagement/merchantList/setNumber')
            break
        }

      }

      handleChange = async (pagination: any) => {
        console.log(pagination)
        await this.props.dispatch({
          type: 'merchantList/setPage',
          payload: {
            page: pagination.current,
          }
        });
        this.getList()


      }

      render() {
        const { getFieldDecorator } = this.props.form;
        const { dataList, loading, total } = this.state
        const { page, currentPageSize, accountname, name, created, mobile, status, paystatus, start_date, end_date } = this.props.merchantList
        const columns = [
          {
            title: '入驻时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160
          },
          {
            title: '商家名称',
            dataIndex: 'account_name',
            key: 'account_name',
            width: 200
          },
          {
            title: '门店名称',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
            width: 200
          },
          {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 120
          },
          {
            title: '门店状态',
            dataIndex: 'supplier_status',
            key: 'supplier_status',
            width: 100
          },
          {
            title: '支付状态',
            dataIndex: 'supplier_payment_status',
            key: 'supplier_payment_status',
            width: 100
          },
          {
            title: '双乾支付',
            dataIndex: 'double_money_status',
            key: 'double_money_status',
            width: 100
          },
          {
            title: '微信支付',
            dataIndex: 'wx_money_status',
            key: 'wx_money_status',
            width: 100
          },
          {
            title: '小微支付',
            dataIndex: 'small_wei_money_status',
            key: 'small_wei_money_status',
            width: 100
          },
          {
            title: '支付宝支付',
            dataIndex: 'zfb_money_status',
            key: 'zfb_money_status',
            width: 100
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text: any, record: any) => (
              <span>
                {
                  (text.supplier_status != '通过' || text.supplier_status != '通过') ? (
                    <span>
                      <a className={styles.click_a} onClick={this.Goto.bind(this, 'viewStore', text)}>查看门店</a>
                      <a className={styles.click_a} onClick={this.Goto.bind(this, 'viewPay', text)}>查看支付</a>
                      <a className={styles.click_a} onClick={this.Goto.bind(this, 'viewCode', text)}>查看码</a>
                      {/*<a className={styles.click_a} onClick={this.Goto.bind(this, 'download', text)}>下载资料</a>*/}
                      <a className={styles.click_a} onClick={this.Goto.bind(this, 'setNum', text)}>商户号设置</a>
                    </span>
                  ) : (
                    <span>
                      {
                        text.supplier_status != '通过' ? <a className={styles.click_a} onClick={this.Goto.bind(this, 'viewStore', text)}>门店审核</a> : <a className={styles.click_a} onClick={this.Goto.bind(this, 'viewStore', text)}>查看门店</a>
                      }
                      {/*<a className={styles.click_a} onClick={this.Goto.bind(this, 'viewStore', text)}>门店审核</a>*/}
                      <a className={styles.click_a} onClick={this.Goto.bind(this, 'viewPay', text)}>支付审核</a>
                    </span>
                  )
                }

              </span>
            ),
          },
        ]
        return (
          <div>
            <Form onSubmit={this.onSearch} layout="inline">
              <Row
                gutter={{
                  md: 8,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={5} sm={20}>
                  <FormItem label='商家名称'>
                    {getFieldDecorator('accountname', { initialValue: accountname })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={5} sm={20}>
                  <FormItem label='门店名称'>
                    {getFieldDecorator('name', { initialValue: name })(
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
                  <FormItem label='手机号码'>
                    {getFieldDecorator('mobile', { initialValue: mobile })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={5} sm={20}>
                  <FormItem label='门店状态' style={{ width: '100%' }}>
                    {getFieldDecorator('status', { initialValue: status })(
                      <Select placeholder="全部状态" style={{
                        width: '174px'
                      }}>
                        <Option value={1}>审核中</Option>
                        <Option value={2}>拒绝</Option>
                        <Option value={3}>已通过</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={5} sm={20}>
                  <FormItem label='支付状态'>
                    {getFieldDecorator('paystatus', { initialValue: paystatus })(
                      <Select placeholder="全部状态" style={{
                        width: '174px'
                      }}>
                        <Option value={1}>审核中</Option>
                        <Option value={2}>拒绝</Option>
                        <Option value={3}>已通过</Option>
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
                current: page,
                defaultPageSize: currentPageSize,
                showSizeChanger: false,
                showQuickJumper: true,
                total,
                showTotal: () => {
                  return `共${total}条`;
                },
              }}
            />

            <Modal
              title="查看码"
              visible={this.state.visible}
              onCancel={this.handleCancel}
              footer={null}
            >
              <div className={styles.modal}>
                <a href={this.state.code}>点击授权</a>
                <img src={this.state.codeUrl} style={{width: 200, height: 200}}/>
              </div>
            </Modal>

          </div>
        )
      }
    }
  )

)

// export default MerchantList
