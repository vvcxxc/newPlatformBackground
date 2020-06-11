import React, { Component } from 'react';
import InputBox from '@/components/myComponents/InputBox'
import styles from './index.less';
import { Breadcrumb, Select, Button, Modal, notification } from 'antd';
import { getAuditDetails, putAuditDetails } from '../service';
import { router } from 'umi';

const { Option } = Select;
export default class AuditDetails extends Component {
  state = {
    visible: false,
    active_value: '',
    examine_status: 1,
    id: '',
    imgs: [],
    mobile: null,
    name: "",
    remarks: "",
    upgrade_role: '',
    user_group: [],
    grade: '',
    invitation_code: '',
    modal_image: '',
    level: 0,
    avatar: '',
    invitation_user_name: ''
  }

  componentDidMount() {
    const id = this.props.location.query.id
    getAuditDetails(id).then(res => {
      console.log(res)
      this.setState({...res.data,level:res.data.grade})
    })
  }

  inputChange = (type: string) => (value: any) => {
    this.setState({ [type]: value })
  }

  showModal = (image: any) => {
    this.setState({
      visible: true,
      modal_image: image
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };


  submit = () => {
    const {remarks, examine_status, id, grade,invitation_code, mobile} = this.state
    const data = {
      remarks,
      examine_status,
      upgrade_role: grade,
      id,
      invitation_code,
      mobile
    }
    putAuditDetails(id, data).then (res => {
      console.log(res)
      if(res.status_code == 200){
        notification.success({message: res.message})
        router.goBack()
      }else {
        notification.error({message: res.message})
      }
    })
  }

  render() {
    const {active_value, examine_status, avatar, imgs, mobile, name, remarks, user_group,invitation_user_name ,grade,level} = this.state
    return (
      <div className={styles.auditPage}>
        <Breadcrumb>
          <Breadcrumb.Item>社群列表</Breadcrumb.Item>
          <Breadcrumb.Item>审核详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.main}>
          {/* <InputBox label='用户姓名' value={name} onChange={this.inputChange('name')} />
          <InputBox label='手机账号' value={mobile} onChange={this.inputChange('mobile')} /> */}
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>用户姓名：</div>
            <div className={styles.layout_main}>{name}</div>
          </div>
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>手机账号：</div>
            <div className={styles.layout_main}>{mobile}</div>
          </div>
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>邀请人名称：</div>
            <div className={styles.layout_main}>{invitation_user_name}</div>
          </div>
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>头像：</div>
            <div className={styles.layout_main}>
              <img src={avatar} alt=""/>
            </div>
          </div>
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>当前等级：</div>
            <div className={styles.layout_main}>{level == 5 ? '注册会员' : level == 6 ? '普通创客' : level == 7 ? '超级创客' : level == 8 ? '合伙人' : null}</div>
          </div>
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>社群等级：</div>
            <div className={styles.layout_main}>
              <Select value={grade} style={{ width: 120 }} onChange={this.inputChange('grade')}>
                {/* <Option value="1">普通会员</Option>
                <Option value="2">普通创客</Option>
                <Option value="3">超级创客</Option>
                <Option value="4">合伙人</Option> */}
                {
                  user_group.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
              </Select>
            </div>
          </div>

          <div className={styles.layout_img_box}>
            <div className={styles.layout_label}>提交内容：</div>
            <div className={styles.layout_img}>
              {
                imgs.length ? JSON.parse(imgs).map((item:string, index: number) => {
                  return <img key={index} onClick={this.showModal.bind(this,'http://oss.tdianyi.com/'+item)} src={'http://oss.tdianyi.com/'+item} alt="" />
                }) : null
              }
            </div>
          </div>

          <div className={styles.layout_box}>
            <div className={styles.layout_label}>审核状态：</div>
            <div className={styles.layout_main}>
              <Select value={examine_status ? examine_status : '请选择状态'} style={{ width: 120 }} onChange={this.inputChange('examine_status')}>
                <Option value={1}>通过</Option>
                <Option value={2}>拒绝</Option>
              </Select>
            </div>
          </div>

          <InputBox label='备注原因' value={remarks} onChange={this.inputChange('remarks')} />

          <div>
            <Button style={{ margin: 50 }} onClick={()=> router.goBack()}>取消</Button>
            <Button type="primary" onClick={this.submit}>确认</Button>
          </div>

          <Modal
            visible={this.state.visible}
            footer={null}
            onCancel={this.handleOk}
            style={{width: 'auto'}}
          >
            <img src={this.state.modal_image} alt="" />
          </Modal>


        </div>
      </div>
    )
  }
}
