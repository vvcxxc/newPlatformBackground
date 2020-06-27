import React, { Component } from 'react';
import styles from './index.less';
import { Card, Form, Input, Radio, Button, Table, Upload, Icon, message, Progress, Modal, DatePicker, Tabs, notification } from 'antd';
import Rule from '@/components/myComponents/rule';
import UploadBox from '@/components/myComponents/uploadBox'
import moment from 'moment'
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import { getRuleList, createCoupon } from './service'
import { getOssDate } from '@/services/common'
import StoreModal from './store-modal'
import GiftModal from './gift-modal'
import 'braft-editor/dist/index.css';
import { router } from 'umi';

interface Props {
  form: any;
}

const { confirm } = Modal;
const { RangePicker } = DatePicker;


export default Form.create()(
  class AddCoupon extends Component<Props> {

    state = {
      coupon_type: 1, // 卡券类型
      name: "", // 卡券名称
      validity_day: "",  // 商品券有效期
      pay_money: "0", // 商品券购买价
      market_money: "", // 商品券市场价
      rush_astrict_buy_num: 1,  // 商品券限购设置
      rule_description: [], // 商品券使用须知
      offset_money: '',
      use_min_price: '',
      is_support_refund: 1,
      brokerage_ratio: '',
      image1: '',
      image2: '',
      image3: '',


      isUploadVideo: false,
      isPlayVideo: false,
      progressLoad: 0,
      videoUrlPath: "",


      editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
      articleFileList: [],

      rush_share_content: "", // 商品券分享内容
      start_time: '',
      end_time: '',

      is_rush: 1, // 是否参与抢购活动
      rush_money: "", // 抢购价
      repertory_num: "",   // 抢购数量
      is_index_recommend: 1,       // 首页推广
      rush_description: '',
      rule_list: [], // 使用须知列表
      rush_astrict_buy_num1: '',

      is_show_store: false, // 展示门店列表
      is_show_gift: false, // 展示礼品列表
      store_id: 0,
      store_list: [],
      gift_id: [],
      gift_list: []
    }

    componentDidMount() {
      getOssDate().then(res => {
        this.setState({ oss_data_data: res })
      })
      // 获取使用规则列表
      getRuleList().then(res => {
        this.setState({ rule_list: res.data })
      })

    }

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


    /**
     * 上传视频
     */
    handleUploadVideoChange = (e) => {
      let fileInfo = this.refs.file.files[0];
      if (['video/mp4', 'video/flv', 'video/wmv'].indexOf(fileInfo.type) == -1) {
        message.error('请上传正确的视频格式');
        return false;
      }

      this.setState({
        oss_data: {
          policy: this.state.oss_data_data.policy,
          OSSAccessKeyId: this.state.oss_data_data.accessid,
          success_action_status: 200, //让服务端返回200,不然，默认会返回204
          signature: this.state.oss_data_data.signature,
          callback: this.state.oss_data_data.callback,
          host: this.state.oss_data_data.host,
          key: this.state.oss_data_data.dir + this.randomString(32) + '.mp4',
        }
      }, () => {
        let formdata = new FormData();
        formdata.append('policy', this.state.oss_data_data.policy);
        formdata.append('OSSAccessKeyId', this.state.oss_data_data.accessid);
        formdata.append('success_action_status', "200");
        formdata.append('signature', this.state.oss_data_data.signature);
        formdata.append('callback', this.state.oss_data_data.callback);
        formdata.append('host', this.state.oss_data_data.host);
        formdata.append('key', this.state.oss_data_data.dir + this.randomString(32) + '.mp4');
        formdata.append('file', fileInfo);

        const xhr = new XMLHttpRequest();
        const _this = this;
        xhr.upload.onprogress = function (evt) {
          let loading = Math.round(evt.loaded / evt.total * 100);
          _this.setState({
            isUploadVideo: true,
            isPlayVideo: false,
            progressLoad: loading
          })
        }
        xhr.open('post', "http://tmwl.oss-cn-shenzhen.aliyuncs.com/", true);
        xhr.send(formdata);
        xhr.onreadystatechange = function () {
          if (xhr.status == 200 && xhr.readyState == 4) {
            const res = JSON.parse(xhr.responseText);
            if (res.status == "ok") {
              _this.setState({
                isUploadVideo: false,
                isPlayVideo: true,
                videoUrlPath: res.data.path
              })
            }
          }
        }
      })


    }

    /**
     * 删除视频
     */
    handleCloseVideo = () => {
      const _this = this;
      confirm({
        title: '删除操作',
        content: '确定要删除该视频吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          _this.setState({
            isUploadVideo: false,
            isPlayVideo: false,
            videoUrlPath: ""
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    /**
     * 文章中图片
     */
    articleImageChange = (info: any) => {
      let fileList = [...info.fileList];
      if (info.file.status === 'done') {
        this.setState({
          articleFileList: fileList,
          editorState: ContentUtils.insertMedias(this.state.editorState, [{
            type: 'IMAGE',
            url: 'http://oss.tdianyi.com/' + info.file.response.data.path
          }])
        })
      }
      this.setState({ articleFileList: fileList })
    };

    /**
     * 文章编辑
     */
    articleChange = (editorState: any) => {
      this.setState({ editorState })
    }




    /**
     * 选中抢购时间
     */
    onOkSelectTime = (value: any,) => {
      let start_time = moment(value[0]).format('YYYY-MM-DD HH:mm')
      let end_time = moment(value[1]).format('YYYY-MM-DD HH:mm')
      console.log(start_time,end_time)
      this.setState({ start_time, end_time })
    }


    /**
     *
     */
    handleChange = (type: string, e: any) => {
      let regex = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/; // 保留两位小数
      let regex1 = /^[1-9]\d*$/; // 保留整数
      let value = e.target.value
      if (type == 'market_money' || type == 'offset_money' || type == 'use_min_price' || type == 'rush_money') {
        if (regex.test(value) && value <= 1000000 || value == '') {
          this.setState({ [type]: e.target.value })
        }
      }else if (type == 'brokerage_ratio') { // 分佣比例
        if (regex1.test(value) && value <= 100 || value == '') {
          this.setState({ [type]: e.target.value })
        }
      }else if (type == 'repertory_num') { // 抢购数量
        if (regex1.test(value) || value == '') {
          this.setState({ [type]: e.target.value })
        }
      }else if (type == 'rush_astrict_buy_num1') {
        if (regex1.test(value) && value <= this.state.repertory_num || value == '') {
          this.setState({ [type]: e.target.value })
        }
      }else if (type == 'name') { // 卡券名
        if (value.length <= 30) {
          this.setState({ [type]: e.target.value })
        }
      }else{
        this.setState({ [type]: e.target.value })
      }


    }




    /**
     * 上传图片回调
     */
    imgChange = (type: string, path: string) => {
      this.setState({ [type]: path })
    }

    /**
     * 选择店铺的回调
     * */
    storeChange = (store_id: any, store_list: any) => {
      this.setState({ store_id, store_list })
      this.close()
    }

    /**
     * 礼品回调
     */
    giftChange = (id: any, list: any) => {
      this.setState({ gift_id: id, gift_list: list })
      this.close()
    }

    /**
     * modal关闭
     */
    close = () => {
      this.setState({ is_show_gift: false, is_show_store: false })
    }

    /**
     * 使用须知回调
     */
    ruleChange = (content: any) => {
      let rush_description = []
      for (let i in content) {
        rush_description.push(content[i].content)
      }
      this.setState({ rush_description })
    }

    range = (start: number, end: number) => {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }

    /**
     * 限制时间
     */
    disabledRangeTime = (_: any, type: string) => {
      if (type == 'start' && _ && moment().format('YYYY-MM-DD') == moment(_).format('YYYY-MM-DD')) {

          console.log('3232')
          let time = moment().format()
          let hour = moment(time).get('hour')
          let minute = moment(time).get('minute')
          let new_minute = minute + 5
          if (new_minute > 59) {
            new_minute = new_minute - 59
            hour = hour + 1
          }
          return {
            disabledHours: () => this.range(0, 24).splice(0,hour),
            disabledMinutes: () => this.range(0, 60).splice(0,new_minute),
          }
      }
      return {}
    }

    disabledDate = (current: any) => {
      return current && current < moment(moment().endOf('day')).subtract(1, 'd');
    }

    submit = () => {
      const { store_id, name, coupon_type, validity_day, pay_money, market_money, offset_money, use_min_price, is_support_refund, brokerage_ratio, is_rush, rush_money, start_time, end_time, rush_astrict_buy_num, repertory_num, is_index_recommend, rush_description, rush_share_content, gift_id, editorState, videoUrlPath, image1, image2, image3, rush_astrict_buy_num1 } = this.state
      const rush_detail_connent = editorState.toHTML();
      const master_video = videoUrlPath;
      let coupon_image: any = [];
      if (image1) coupon_image.push(image1)
      if (image2) coupon_image.push(image2)
      if (image3) coupon_image.push(image3)
      let data = {
        store_id,
        name,
        coupon_type,
        validity_day,
        pay_money: rush_money,
        market_money: coupon_type === 1 ? market_money : undefined,
        offset_money: coupon_type === 2 ? offset_money : undefined,
        use_min_price: coupon_type === 3 ? use_min_price : undefined,
        is_support_refund,
        brokerage_ratio,
        coupon_image,
        master_video,
        is_rush,
        rush_money,
        start_time,
        end_time,
        rush_astrict_buy_num: rush_astrict_buy_num ? rush_astrict_buy_num1 : rush_astrict_buy_num,
        repertory_num,
        is_index_recommend,
        rush_description,
        rush_share_content,
        rush_detail_connent,
        binding_gift_ids: gift_id
      }
      createCoupon(data).then(res => {
        if (res.data && res.data.id) {
          notification.success({ message: '添加成功' })
          router.goBack()
        }
      })
    }

    /**
     * 删除礼品
     */
    deleteGift = (item: any) => {
      let gift_id = JSON.parse(JSON.stringify(this.state.gift_id))
      let gift_list = JSON.parse(JSON.stringify(this.state.gift_list))
      gift_id = gift_id.filter((res: any) => res != item.id)
      gift_list = gift_list.filter((res: any) => res.id != item.id)
      this.setState({gift_id, gift_list})
    }



    render() {
      const {
        coupon_type,
        name,
        validity_day,
        market_money,
        offset_money,
        use_min_price,
        is_support_refund,
        brokerage_ratio,
        rush_money,
        rush_astrict_buy_num,
        repertory_num,
        is_index_recommend,
        isUploadVideo,
        progressLoad,
        videoUrlPath,
        isPlayVideo,
        editorState,
        rush_share_content,
        is_show_store,
        is_show_gift,
        store_list,
        gift_list,
        rush_astrict_buy_num1
      } = this.state;
      const formItemLayout = {
        labelCol: {
          xs: { span: 2 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 6 },
          sm: { span: 6 },
        },
      };


      const extendControls = [
        {
          key: 'antd-uploader',
          type: 'component',
          component: (
            <Upload
              fileList={this.state.articleFileList}
              onChange={this.articleImageChange}
              showUploadList={false}
              data={this.state.oss_data_data}
              action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
            >
              {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
              <button type="button" className="control-item button upload-button" data-title="插入图片">
                <Icon type="upload" />
              </button>
            </Upload>
          )
        }
      ]
      const GiftList = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          align: 'center'
        },
        {
          title: '礼品名称',
          dataIndex: 'gift_name',
          key: 'gift_name',
          align: 'center'
        },
        {
          title: '礼品类型',
          dataIndex: 'gift_type',
          key: 'gift_type',
          render: (text: any, record: any) => (
            <div>
              {
                record.gift_type == 1 ? '现金券' : record.gift_type == 2 ? '商品券' : record.gift_type == 3 ? '实物礼品' : null
              }
            </div>
          ),
          align: 'center'
        },
        {
          title: '商品原价',
          dataIndex: 'worth_money',
          key: 'worth_money',
          align: 'center'
        },
        {
          title: '面额',
          dataIndex: 'offset_money',
          key: 'offset_money',
          align: 'center'
        },
        {
          title: '剩余数量(个)',
          dataIndex: 'total_surplus_num',
          key: 'total_surplus_num',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'index',
          render: (text: any, record: any, index: number) => {
            return <Icon type="delete" onClick={this.deleteGift.bind(this, record)} />;
          },
          align: 'center'
        }
      ]

      const ownStoreColumns = [
        {
          title: '门店图片',
          dataIndex: 'facade_image',
          key: 'facade_image',
          render: (text: any, record: any) => {
            return <img src={record.facade_image} style={{ width: 50, height: 50 }} />
          }
        },
        {
          title: '门店名称',
          dataIndex: 'store_name',
          key: 'store_name',
        },
        {
          title: '地址',
          dataIndex: 'detailed_address',
          key: 'detailed_address',
        },
        {
          title: '联系人',
          dataIndex: 'contact_person',
          key: 'contact_person',
        },
        {
          title: '联系电话',
          dataIndex: 'contact_phone',
          key: 'contact_phone',
        },
        {
          title: '商圈',
          dataIndex: 'business_district_name',
          key: 'business_district_name',
        },
      ];

      return (
        <div className={styles.add_coupon}>
          <Card title="基础信息" bordered={false} style={{ width: "100%" }}>
            <Form {...formItemLayout}
            >
              <Form.Item label="卡券类型">
                <Radio.Group value={coupon_type} onChange={this.handleChange.bind(this, 'coupon_type')}>
                  <Radio value={1}>商品券</Radio>
                  <Radio value={2}>现金券</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="卡券名称">
                <Input placeholder="最多允许输入30个字（60字符）" value={name} onChange={this.handleChange.bind(this, 'name')} />
              </Form.Item>

              <Form.Item label="所属门店" style={{ width: '100%' }}>
                <Button type="primary" onClick={() => this.setState({ is_show_store: true })}>
                  添加
                </Button>

              </Form.Item>
              {
                store_list.length ? <div style={{ width: '80%', marginLeft: 100 }}>
                  <Table
                    columns={ownStoreColumns}
                    dataSource={store_list}
                    pagination={false}
                  />
                </div> : null
              }

              <Form.Item label="抽佣比例">
                <Input value={brokerage_ratio} onChange={this.handleChange.bind(this, 'brokerage_ratio')} suffix="%" />
                <div style={{ fontSize: 12, width: 500, color: '#D9001B' }}>注：抽佣比例决定商家需要支付给平台的服务费。服务费=交易额*抽佣比例</div>
              </Form.Item>
            </Form>
          </Card>

          <Card title="限时抢购" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
            <Form {...formItemLayout}
            >
              {
                coupon_type === 1 ? <Form.Item label="市场价">
                  <Input value={market_money} onChange={this.handleChange.bind(this, 'market_money')} suffix="元" />
                </Form.Item> : <Form.Item label="面额">
                    <Input value={offset_money} onChange={this.handleChange.bind(this, 'offset_money')} suffix="元" />
                  </Form.Item>
              }

              <Form.Item label="抢购价">
                <Input value={rush_money} onChange={this.handleChange.bind(this, 'rush_money')} suffix="元" />
              </Form.Item>
              <div>
                <Form.Item label="抢购时间">
                  <RangePicker
                    showTime={{ format: 'HH:mm',  defaultValue: [moment().add(6, 'm'), moment('11:59:59', 'HH:mm:ss')] }}
                    disabledTime={this.disabledRangeTime}
                    disabledDate={this.disabledDate}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                    onOk={this.onOkSelectTime}

                  />
                </Form.Item>
                <Form.Item label="抢购数量">
                  <Input value={repertory_num} onChange={this.handleChange.bind(this, 'repertory_num')} suffix="张" />
                </Form.Item>
                {
                  coupon_type === 2 ? (
                    <Form.Item label="使用门槛">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        消费满<Input style={{ width: 300 }} value={use_min_price} onChange={this.handleChange.bind(this, 'use_min_price')} suffix="元" />可用
                    </div>
                    </Form.Item>
                  ) : null
                }
                <Form.Item label="限购设置">
                  <Radio.Group value={rush_astrict_buy_num} onChange={this.handleChange.bind(this, 'rush_astrict_buy_num')}>
                    <Radio value={0}>无限制</Radio>
                    <Radio value={1}>X张/人</Radio>
                  </Radio.Group>
                  {
                    rush_astrict_buy_num ? <Input value={rush_astrict_buy_num1} onChange={this.handleChange.bind(this, 'rush_astrict_buy_num1')} /> : null
                  }

                </Form.Item>
                <Form.Item label="有效期">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>购券日起</span>
                    <Input value={validity_day} onChange={this.handleChange.bind(this, 'validity_day')} style={{ width: "250px" }} />
                    <span>天可用</span>
                  </div>
                </Form.Item>
                <Form.Item label="是否可退款">
                  <Radio.Group value={is_support_refund} onChange={this.handleChange.bind(this, 'is_support_refund')}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="首页推广">
                  <Radio.Group value={is_index_recommend} onChange={this.handleChange.bind(this, 'is_index_recommend')}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="使用须知">
                  <Rule onChange={this.ruleChange} />
                </Form.Item>
              </div>
            </Form>
          </Card>

          <Card title="图文描述" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
            <Form {...formItemLayout}
            >
              <Form.Item label="卡券图片">
                <div className={styles.coupon_pic}>
                  <div className={styles.coupon_pic_desc}>温馨提示：请上传正方形图片，建议图片比例1:1</div>
                </div>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 2 }} >
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                    <UploadBox onChange={this.imgChange.bind(this, 'image1')} />
                  </div>
                  <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                    <UploadBox onChange={this.imgChange.bind(this, 'image2')} />
                  </div>
                  <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                    <UploadBox onChange={this.imgChange.bind(this, 'image3')} />
                  </div>
                </div>

              </Form.Item>

              <Form.Item label="主图视频" style={{ marginBottom: '10px' }}></Form.Item>
              <Form.Item wrapperCol={{ offset: 2 }} >
                <div style={{ display: 'flex' }}>
                  <div className={styles.upload_video_box}>

                    <div className={styles.upload_video}>
                      {
                        isUploadVideo && !isPlayVideo ? (
                          <Progress type="circle" percent={progressLoad} className={styles.upload_progress} />
                        ) : !isUploadVideo && !isPlayVideo ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <input type="file" name="file" id="file" ref="file" className={styles.upload_files} onChange={this.handleUploadVideoChange} />
                            <Icon type="play-circle" style={{ fontSize: '28px', }} />
                            <div className="ant-upload-text">上传视频</div>
                          </div>
                        ) : !isUploadVideo && isPlayVideo ? (
                          <div style={{ width: '100%', height: '100%' }}>
                            <video src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/${videoUrlPath}`} className={styles.play_video} controls="controls"></video>
                            <Icon type="close-circle" style={{ color: '#d14', fontSize: '18px', position: 'absolute', right: 0, top: 0, cursor: 'pointer' }} onClick={this.handleCloseVideo} />
                          </div>
                        ) : ""
                      }


                    </div>
                  </div>
                  <div className={styles.upload_video_desc} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <div>1.尺寸：此处可使用1：1或16：9比例视频</div>
                    <div>2.时长：{"<="} 15 秒</div>
                    <div>3.内容：突出商品1-2个核心卖点，不建议电子相册式的图片翻页视频</div>
                  </div>
                </div>
              </Form.Item>

              <Form.Item label="详情" style={{ marginBottom: '10px' }}></Form.Item>
              <Form.Item wrapperCol={{ offset: 2 }} style={{ width: "100%" }}>
                <div style={{ border: "1px solid #ccc" }}>
                  <BraftEditor
                    value={editorState}
                    onChange={this.articleChange}
                    // controls={controls}
                    extendControls={extendControls}
                  />
                </div>
              </Form.Item>

            </Form>


          </Card>


          <Card title="分享信息" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
            <Form {...formItemLayout}
            >
              <Form.Item label="分享内容">
                <Input value={rush_share_content} onChange={this.handleChange.bind(this, 'rush_share_content')} />
              </Form.Item>
            </Form>
          </Card>

          <Card title="礼品" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
            <div className={styles.add_gift_title}>
              <div >添加礼品</div>
              <Button type='primary' onClick={() => this.setState({ is_show_gift: true })}>添加</Button>
            </div>
            {
              gift_list.length ? <div style={{ width: '80%', marginLeft: 100 }}>
                <Table
                  columns={GiftList}
                  dataSource={gift_list}
                  pagination={false}
                />
              </div> : null
            }
          </Card>
          <Card bordered={false} style={{ width: "100%", marginTop: "20px" }}>
            <Button onClick={this.submit} type='primary'>确定</Button>
          </Card>

          <StoreModal visible={is_show_store} onChange={this.storeChange} onClose={this.close} />

          <GiftModal visible={is_show_gift} id={this.state.gift_id} store={store_list[0] ? store_list[0] : null} onClose={this.close} onChange={this.giftChange} />


        </div >
      )
    }
  }
)
