import React, { Component } from 'react'
import styles from './index.less'
import { Breadcrumb, Radio, notification, Select, Button, Spin } from 'antd'
import InputBox from '@/components/myComponents/InputBox'
import UploadBox from '@/components/myComponents/uploadBox'
import router from 'umi/router'
import request from '@/utils/request'
const { Option } = Select;
class PayAudit extends Component {
  state = {
    address: '',
    deal_cate_id: '',
    contact_name: '',
    legal_id_no: '',
    legal_id_valid_date: '',
    hand_hold_id_img: '',
    legal_id_back_img: '',
    legal_id_front_img: '',
    legal_name: '',
    corn_bus_name: '',
    three_certs_in_one_no: '',
    three_certs_in_one_valid_date: '',
    three_certs_in_one_img: '',
    settle_bank_account_no: '',
    settle_bank: '',
    bank_name: '',
    bank_card_front_img: '',
    bank_card_back_img: '',
    bank_opening_permit: '',
    typeList: [],
    type: 1,
    remarks: '',
    payment_status: '1',
    Loading: false
  }

  async componentWillMount() {
    let phone = this.props.location.query.phone
    let type = this.props.location.query.type
    // request.get('/api/sq/',{
    //   params: {phone}
    // }).then(res => {
    //   if(res.data != []){
    //     this.setState({...res.data})
    //   }
    // })
    let res = await request.get('/api/sq/', { params: { phone, type } })
    if (res.data != []) {
      this.setState({ ...res.data })
    }
    request.get('http://api.supplier.tdianyi.com/v3/manage_type').then(res => {
      if (res.code == 200) {
        this.setState({
          typeList: res.data
        })
      }
    })
  }


  radioChange = (type: string) => (e: any) => {
    if (type == 'type') {
      this.setState({ type: e.target.value })
    }
    console.log(e.target.value)
  }

  inputChange = (type: string) => (value: any) => {
    this.setState({ [type]: value })
  }

  imageChange = (type: string) => (path: string) => {
    console.log(type, path)
    this.setState({ [type]: path })
  }

  // 提交数据
  submit = () => {
    let phone = this.props.location.query.phone
    this.setState({ Loading: true })
    request.post('/api/sq', {
      data: {
        phone: phone,
        type: this.state.type
      }
    }).then(res => {
      console.log(res)
      this.setState({ Loading: false })
      if (res.status_code == 200) {
        notification.success({
          message: res.message,
        });
        router.goBack()
      } else {
        notification.error({
          message: res.message,
        });
      }
    }).catch(err => this.setState({ Loading: false }))
  }

  //确定按钮
  confirm = () => {
    let phone = this.props.location.query.phone
    let type = this.props.location.query.type
    const { payment_status, remarks } = this.state
    request.post('/api/sq/examine', {
      data: {
        phone,
        payment_status,
        remarks,
        type
      }
    }).then(res => {
      console.log(res)
      if (res.status_code == 200) {
        notification.success({
          message: res.message,
        });
        router.goBack()
      } else {
        notification.error({
          message: res.message,
        });
      }
    })
  }

  //修改数据
  changeInfo = () => {
    let phone = this.props.location.query.phone
    let type = this.props.location.query.type
    const { contact_name, legal_id_no, legal_id_valid_date, hand_hold_id_img, legal_id_back_img, legal_id_front_img, settle_bank_account_no, settle_bank, bank_name, bank_card_back_img, bank_card_front_img } = this.state
    if (contact_name &&
      legal_id_no &&
      legal_id_valid_date &&
      hand_hold_id_img &&
      legal_id_back_img &&
      legal_id_front_img &&
      settle_bank_account_no &&
      settle_bank &&
      bank_name &&
      bank_card_front_img &&
      bank_card_back_img) {
      request.put('/api/sq/update', {
        data: {
          type,
          contact_name,
          legal_id_no,
          legal_id_valid_date,
          hand_hold_id_img,
          legal_id_back_img,
          legal_id_front_img,
          settle_bank_account_no,
          settle_bank,
          bank_name,
          bank_card_front_img,
          bank_card_back_img,
          phone
        }
      }).then(res => {
        console.log(res)
        if (res.status_code == 200) {
          notification.success({
            message: res.message
          })
          router.goBack()
        } else {
          notification.error({
            message: res.message
          })
        }

      })
    } else {
      notification.error({
        message: '请将信息填写完整'
      })
    }

  }

  status(type: any) {
    switch (type) {
      case 0: return '认证失败';
      case 1: return '已认证';
      case 2: return '未认证';
      case 3: return '审核中';
      case 4: return '未注册';
      default: return ''
    }
  }

  render() {
    const { address, deal_cate_id, Loading, contact_name, message, legal_id_no, legal_id_valid_date, hand_hold_id_img, legal_id_back_img, legal_id_front_img, corn_bus_name, three_certs_in_one_no, three_certs_in_one_valid_date, three_certs_in_one_img, settle_bank_account_no, settle_bank, bank_name, bank_opening_permit, bank_card_back_img, bank_card_front_img, typeList, remarks, payment_status, status, sub_status } = this.state

    return (
      <div className={styles.page}>
        <Breadcrumb>
          <Breadcrumb.Item><a onClick={() => router.goBack()}>商家审核</a></Breadcrumb.Item>
          <Breadcrumb.Item>支付审核</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={Loading}>
          <div className={styles.title}>基本信息</div>
          <div className={styles.radioBox}>
            <Radio.Group defaultValue="a" buttonStyle="solid" onChange={this.radioChange('channel')}>
              <Radio.Button value="a">双乾通道</Radio.Button>
              {/*<Radio.Button value="b">服务商通道</Radio.Button>*/}
              {/*<Radio.Button value="c">小微通道</Radio.Button>*/}
            </Radio.Group>
          </div>
          <div className={styles.layout}>
            <div>提交双乾审核：{sub_status ? '已提交' : '未提交'}</div>
            <Button type='primary' style={{ marginLeft: 30 }} onClick={this.submit} disabled={status == 1 ? true : false}>提交数据</Button>
          </div>
          <div className={styles.layout}>
            <div className={styles.status}>认证状态：{this.status(status)}</div>
            <div className={styles.reason}>返回信息：{message}</div>
          </div>

          <div className={styles.radioBox}>
            <Radio.Group onChange={this.radioChange('type')} value={this.state.type} defaultValue={1}>
              <Radio value={1}>个人商户</Radio>
              {/*<Radio value={0}>企业商户</Radio>*/}
            </Radio.Group>
          </div>

          {/* 门店信息 */}
          {/*<div className={styles.title}>门店信息</div>*/}
          {/*<InputBox label='门店地址' onChange={this.inputChange('address')} value={address} />*/}
          {/*/!* <InputBox label='行业/经营品类' onChange={this.inputChange('address')} value={address} /> *!/*/}

          {/*<div className={styles.layout} style={{ alignItems: 'center' }}>*/}
          {/*  <div className={styles.label}>行业/经营品类：</div>*/}
          {/*  <Select defaultValue='行业/经营品类' value={deal_cate_id} style={{ width: 120 }} onChange={this.inputChange('deal_cate_id')}>*/}
          {/*    /!* <Option value="1">待审核</Option>*/}
          {/*    <Option value="2">拒绝</Option>*/}
          {/*    <Option value="3">通过</Option> *!/*/}
          {/*    {*/}
          {/*      typeList.map(item => {*/}
          {/*        return <Option key={item.id} value={item.id}>{item.name}</Option>*/}
          {/*      })*/}
          {/*    }*/}
          {/*  </Select>*/}
          {/*</div>*/}

          {/* 身份证信息 */}
          <div className={styles.title}>身份证信息</div>
          <InputBox label='姓名' onChange={this.inputChange('contact_name')} value={contact_name} />
          <InputBox label='身份证号' onChange={this.inputChange('legal_id_no')} value={legal_id_no} />
          <InputBox label='有效期' onChange={this.inputChange('legal_id_valid_date')} value={legal_id_valid_date} />
          <div className={styles.imageLayout}>
            <div className={styles.label}>证件照片：</div>
            <UploadBox style={{ margin: '0 20px' }} onChange={this.imageChange('legal_id_front_img')} title='身份证正面' imgUrl={legal_id_front_img} />
            <UploadBox style={{ margin: '0 20px' }} onChange={this.imageChange('legal_id_back_img')} title='身份证反面' imgUrl={legal_id_back_img} />
            <UploadBox style={{ margin: '0 20px' }} onChange={this.imageChange('hand_hold_id_img')} title='手持身份证' imgUrl={hand_hold_id_img} />
          </div>

          {/* 营业执照 */}
          {/*<div className={styles.title}>身份证信息</div>*/}
          {/*<InputBox label='营业执照名称' onChange={this.inputChange('corn_bus_name')} value={corn_bus_name} />*/}
          {/*<InputBox label='营业执照号' onChange={this.inputChange('three_certs_in_one_no')} value={three_certs_in_one_no} />*/}
          {/*<InputBox label='有效期' onChange={this.inputChange('three_certs_in_one_valid_date')} value={three_certs_in_one_valid_date} />*/}
          {/*<div className={styles.imageLayout}>*/}
          {/*  <div className={styles.label}>证件照片：</div>*/}
          {/*  <UploadBox style={{margin: '0 20px'}} onChange={this.imageChange('three_certs_in_one_img')} title='营业执照图' imgUrl={three_certs_in_one_img}/>*/}
          {/*</div>*/}

          {/* 银行卡信息 */}
          <div className={styles.title}>银行卡信息</div>
          <InputBox label='银行卡号' onChange={this.inputChange('settle_bank_account_no')} value={settle_bank_account_no} />
          <InputBox label='开户行' onChange={this.inputChange('settle_bank')} value={settle_bank} />
          <InputBox label='支行' onChange={this.inputChange('bank_name')} value={bank_name} />
          <div className={styles.imageLayout}>
            <div className={styles.label}>证件照片：</div>
            <UploadBox style={{ margin: '0 20px' }} onChange={this.imageChange('bank_card_front_img')} title='银行卡正面' imgUrl={bank_card_front_img} />
            <UploadBox style={{ margin: '0 20px' }} onChange={this.imageChange('bank_card_back_img')} title='银行卡反面' imgUrl={bank_card_back_img} />
            {
              this.state.type ? null : <UploadBox style={{ margin: '0 20px' }} onChange={this.imageChange('bank_opening_permit')} title='银行卡户许可' imgUrl={bank_opening_permit} />
            }

          </div>

          {/* 审核设置 */}
          <div className={styles.title}>审核设置</div>
          <div className={styles.layout} style={{ alignItems: 'center' }}>
            <div className={styles.label}>审核状态：</div>
            <Select defaultValue="设置状态" style={{ width: 120 }} value={payment_status} onChange={this.inputChange('payment_status')}>
              <Option value={0}>未提交资料</Option>
              <Option value={1}>审核中</Option>
              <Option value={2}>拒绝</Option>
              <Option value={3}>通过</Option>
            </Select>
          </div>
          <InputBox label='备注原因' value={remarks} onChange={this.inputChange('remarks')} />

          <div className={styles.buttonBox}>
            <Button type='primary' className={styles.confirm} onClick={this.changeInfo}>保存修改</Button>
            <Button type='primary' className={styles.confirm} onClick={this.confirm}>确定</Button>
            <Button onClick={() => router.goBack()}>取消</Button>
          </div>
        </Spin>
      </div>
    )
  }
}

export default PayAudit
