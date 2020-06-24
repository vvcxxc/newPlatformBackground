import React, { Component } from 'react'
import { Button, Breadcrumb, Upload, Icon, Radio, Tooltip, notification } from 'antd'
import InputBox from '@/components/myComponents/InputBox'
import UploadBox from '@/components/myComponents/uploadBox'
import RuleBox from '@/components/myComponents/ruleBox'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils';
import { addRealGift } from '../service'

import 'braft-editor/dist/index.css'
import styles from './index.less'
import { router } from 'umi'
export default class AddGift extends Component {
  state = {
    gift_name: '',
    gift_original_money: '',
    gift_money: 0,
    gift_image: '',
    gift_detail: '',
    total_repertory_num: '',
    each_num: '',
    delivery_type: 1,
    use_description: '',
    rule_description: [],
    editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
    outputHTML: '',
    value: ''
  }

  componentDidMount() {
    console.log(JSON.parse(localStorage.getItem('oss_data')))
  }

  inputChange = (type: string) => (value: any) => {
    console.log(value, type)
    this.setState({ [type]: value })
  }

  imageChange = (type: string) => (path: string) => {
    this.setState({ [type]: path })
  }

  editChange = (editorState: any) => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML()
    })
  }

  textAreaChange = ({ target: { value } }) => {
    console.log(value)
    this.setState({ rule_description: value });
  };

  // 随机数
  randomString = (len: any) => {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  };
  //上传图片
  getData = (file: any) => {
    let res = localStorage.getItem('oss_data');
    if (res) {
      let data = JSON.parse(res)
      let data1 = {
        policy: data.policy,
        OSSAccessKeyId: data.accessid,
        success_action_status: 200, //让服务端返回200,不然，默认会返回204
        signature: data.signature,
        callback: data.callback,
        host: data.host,
        key: data.dir + this.randomString(32) + '.png',
      }
      return data1
    }
    return
  }

  //文章中图片
  articleImageChange = (info: any) => {
    let fileList = [...info.fileList];
    if (info.file.status === 'done') {
      this.setState({
        articleFileList: fileList,
        editorState: ContentUtils.insertMedias(this.state.editorState, [{
          type: 'IMAGE',
          url: 'http://oss.tdianyi.com/' + info.file.response.data.path + '?x-oss-process=image/resize,w_300'
        }])
      })
    }
    this.setState({ articleFileList: fileList })
  };

  submit = () => {
    const { gift_name, gift_original_money, gift_money, gift_image, gift_detail, total_repertory_num, each_num, delivery_type, use_description, rule_description } = this.state
    const data = {
      gift_name,
      gift_original_money,
      gift_money,
      worth_money: gift_original_money,
      gift_image,
      gift_detail: this.state.editorState.toHTML(),
      total_repertory_num,
      each_num,
      delivery_type,
      use_description,
      rule_description: rule_description,
      gift_type: 3
    }
    addRealGift(data).then(res => {
      if (res.data && res.data.id) {
        router.goBack()
        notification.success({ message: '添加成功' })
      }
    })
  }

  reset = () => {
    this.setState({
      gift_name: '',
      gift_original_money: '',
      gift_money: 0,
      gift_image: '',
      gift_detail: '',
      total_repertory_num: '',
      each_num: '',
      delivery_type: 1,
      use_description: '',
      rule_description: [],
      editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
      outputHTML: '',
      value: ''
    }, () => {
      notification.success({ message: '重置成功' })
    })

  }




  render() {
    const { gift_name, gift_original_money, gift_image, editorState, total_repertory_num, each_num, delivery_type, use_description, rule_description, value } = this.state
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            fileList={this.state.articleFileList}
            onChange={this.articleImageChange}
            showUploadList={false}
            data={this.getData}
            action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" />
            </button>
          </Upload>
        )
      }
    ]


    return (
      <div className={styles.add_page}>
        <Breadcrumb>
          <Breadcrumb.Item>礼品管理</Breadcrumb.Item>
          <Breadcrumb.Item>添加礼品</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <InputBox label='礼品名称' value={gift_name} onChange={this.inputChange('gift_name')} />
          <InputBox label='展示价格' value={gift_original_money} onChange={this.inputChange('gift_original_money')} />
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>礼品价格：</div>
            <div className={styles.layout_main}>0元</div>
          </div>
          <div className={styles.layout}>
            <div className={styles.label}>礼品图片：</div>
            <div className={styles.layout_main}>
              <UploadBox onChange={this.imageChange('gift_image')} imgUrl={gift_image} />
            </div>
          </div>

          {/* <div className={styles.layout}>
            <div className={styles.label}>多图详情：</div>
            <div className={styles.edit_main}>
              <BraftEditor
                value={editorState}
                onChange={this.editChange}
                controls={controls}
                extendControls={extendControls}
              />
            </div>
          </div> */}
          <InputBox label='礼品总数量' value={total_repertory_num} onChange={this.inputChange('total_repertory_num')} suffix='个' />
          <InputBox
            label='发放方式'
            value={each_num}
            onChange={this.inputChange('each_num')}
            suffix={
              <Tooltip title="单个消费者的每次的发放数量">
                个 <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />


          <div className={styles.layout}>
            <div className={styles.label}>配送方式：</div>
            <div className={styles.layout_main}>
              <Radio.Group value={delivery_type}>
                <Radio value={1}>邮寄（运费平台承担）</Radio>
              </Radio.Group>
            </div>
          </div>

          <InputBox label='使用说明' value={use_description} onChange={this.inputChange('use_description')} />

          <RuleBox label='参与规则' value={rule_description} onChange={this.inputChange('rule_description')} />
          <div className={styles.button_box}>
            <Button type='primary' onClick={this.submit}>提交</Button>
            <Button style={{ marginLeft: 50 }} onClick={this.reset}>重置</Button>
          </div>
        </div>
      </div>
    )
  }
}
