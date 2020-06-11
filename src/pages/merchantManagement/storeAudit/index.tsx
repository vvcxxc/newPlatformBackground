import React, { Component } from 'react'
import styles from './index.less'
import { Breadcrumb, Upload, Icon, Select, Button, notification } from 'antd'
import InputBox from '@/components/myComponents/InputBox'
import UploadBox from '@/components/myComponents/uploadBox'
import router from 'umi/router'
const { Option } = Select;
import request from '@/utils/request';
class StoreAudit extends Component {
  state = {
    id: '',
    supplier_id: '',
    supplier_location_id: '',
    name: '',
    ImgLoading: false,
    mobile: '',
    area_id: '',
    address: '',
    house_num: '',
    tel: '',
    deal_cate_id: '',
    email: '',
    shop_door_header_img: '',
    store_img_one: '',
    store_img_two: '',
    service_charge: '', //商家手续费
    service_charge_free_mix: '', //免手续费额度
    youhui_consume_discount: '', // 商家券费率
    payment_status: 1,
    refuse_reason: '',
    typeList: [], // 经营列表品类
    area_list: []
  }

  componentDidMount() {
    request.get('http://api.supplier.tdianyi.com/v3/manage_type').then(res => {
      if(res.code == 200){
        this.setState({
          typeList: res.data
        })
      }

    })
    let id = this.props.location.query.id
    request.get('/api/v1/store/toExamine/'+ id).then(res => {
      if(res.status_code == 200){
        this.setState({ ...res.data })
      }
    })
    request.get('/api/common/area').then(res => {
      if(res.status_code == 200){
        this.setState({ area_list: res.data });
      }
    });

  }

  inputChange = (type: string) => (value: any) => {
    this.setState({ [type]: value })
  }

  imageChange = (type: string) => (path: string) => {
    this.setState({ [type]: path })
  }

  submit = () => {
    const {id, supplier_id, supplier_location_id, name, mobile, area_id, address, house_num, tel, deal_cate_id, email, shop_door_header_img, store_img_one, store_img_two, service_charge, service_charge_free_mix, youhui_consume_discount, payment_status, refuse_reason} = this.state
    request.patch('/api/v1/store/subToExamine',{data: {
      id, supplier_id, supplier_location_id, name, mobile, area_id, address, house_num, tel, deal_cate_id, email, shop_door_header_img, store_img_one, store_img_two, service_charge, service_charge_free_mix, youhui_consume_discount, payment_status, refuse_reason
    }}).then(res => {
      if(res.status_code == 200){
        notification.success({
          message: res.message,
        });
        router.goBack()
      }else{
        notification.error({
          message: res.message,
        });
      }
    })

  }

  render() {
    const { area_list, typeList, name, mobile, address, house_num, tel, deal_cate_id, email, service_charge, service_charge_free_mix, youhui_consume_discount, refuse_reason, payment_status, shop_door_header_img, store_img_one, store_img_two, area_id } = this.state
    return (
      <div className={styles.page}>
        <Breadcrumb>
          <Breadcrumb.Item><a onClick={() => router.goBack()}>门店审核</a></Breadcrumb.Item>
          <Breadcrumb.Item>门店审核</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.title}>门店信息</div>
        <InputBox label='门店名称' value={name} onChange={this.inputChange('name')} />
        <InputBox label='手机号码' value={mobile} onChange={this.inputChange('mobile')} />
        <InputBox label='门店地址' value={address} onChange={this.inputChange('address')} />
        <InputBox label='门牌号' value={house_num} onChange={this.inputChange('house_num')} />
        <InputBox label='门店电话' value={tel} onChange={this.inputChange('tel')} />
        {/* <InputBox label='行业/经营品类' value={name} onChange={this.inputChange('name')} /> */}
        <div className={styles.layout} style={{ alignItems: 'center' }}>
          <div className={styles.label}>行业/经营品类：</div>
          <Select defaultValue='行业/经营品类' value={deal_cate_id} style={{ width: 120 }} onChange={this.inputChange('deal_cate_id')}>
            {/* <Option value="1">待审核</Option>
            <Option value="2">拒绝</Option>
            <Option value="3">通过</Option> */}
            {
              typeList.map(item => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              })
            }
          </Select>
        </div>
        <InputBox label='邮箱' value={email} onChange={this.inputChange('email')} />

        <div style={{ marginTop: 10 }}>
          <div className={styles.layout}>
            <div className={styles.label}>门头照：</div>
            <UploadBox onChange={this.imageChange('shop_door_header_img')} imgUrl={shop_door_header_img} />
            <div className={styles.layout}>
              <div className={styles.label}>环境照：</div>
              <div style={{ marginRight: 20 }}>

                <UploadBox onChange={this.imageChange('store_img_one')} imgUrl={store_img_one} />
              </div>
              <UploadBox onChange={this.imageChange('store_img_two')} imgUrl={store_img_two} />

            </div>
          </div>
        </div>

        <div className={styles.title}>门店设置</div>
        {/* <InputBox label='所属商圈' value={name} onChange={this.inputChange('name')} /> */}
        <div className={styles.layout} style={{ alignItems: 'center' }}>
          <div className={styles.label}>所属商圈：</div>
          <Select defaultValue="所属商圈" style={{ width: 200 }} onChange={this.inputChange('area_id')} value={area_id}>
            {
              area_list.map(item => {
                return <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              })
            }
          </Select>
        </div>
        <InputBox label='商家手续费' value={service_charge} onChange={this.inputChange('service_charge')} />
        <InputBox label='免手续费额度' value={service_charge_free_mix} onChange={this.inputChange('service_charge_free_mix')} />
        <InputBox label='商家券费率' value={youhui_consume_discount} onChange={this.inputChange('youhui_consume_discount')} />

        <div className={styles.title}>审核设置</div>
        <div className={styles.layout} style={{ alignItems: 'center' }}>
          <div className={styles.label}>审核状态：</div>
          <Select value={payment_status} style={{ width: 120 }} onChange={this.inputChange('payment_status')}>
            <Option value={1} >待审核</Option>
            <Option value={2} >拒绝</Option>
            <Option value={3} >通过</Option>
          </Select>
        </div>
        <InputBox label='备注原因' value={refuse_reason} onChange={this.inputChange('refuse_reason')} />


        <div className={styles.buttonBox}>
          <Button type='primary' className={styles.confirm} onClick={this.submit}>确定</Button>
          <Button onClick={()=> router.goBack()}>取消</Button>
        </div>
      </div>
    )
  }
}
export default StoreAudit
