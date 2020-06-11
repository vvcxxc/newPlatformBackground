import React, { Component } from 'react';
import styles from './index.less';
import { Card, Form, Input, Radio, Button, Table, Upload, Icon, message, Progress, Modal, DatePicker, Tabs } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import RuleBox from '@/components/myComponents/ruleBox';
import request from '@/utils/request';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';

interface Props {
  form: any;
}

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default Form.create()(
  class AddCoupon extends Component<Props> {

    state = {
      couponType: 1, // 卡券类型
      couponName: "", // 卡券名称
      ownStoreDataSource: [],
      goodsMarketPrize: "", // 商品券市场价
      goodsBuyPrize: "", // 商品券购买价
      goodsExtendNum: "", // 商品券发放数量
      goodsLimitSetting: 1,  // 商品券限购设置
      goodsValidity: "",  // 商品券有效期
      rule_description: [], // 商品券使用须知

      oss_data: {},
      oss_data_data: {},
      loadingFirst: false,
      imageUrlFirst: "",
      cover_image_first: "",

      loadingSecond: false,
      imageUrlSecond: "",
      cover_image_second: "",

      loadingThird: false,
      imageUrlThird: "",
      cover_image_third: "",

      isUploadVideo: false,
      isPlayVideo: false,
      progressLoad: 0,
      videoUrlPath: "",


      editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
      articleFileList: [],

      goodsShareContent: "", // 商品券分享内容

      participate: 1, // 是否参与抢购活动
      panicBuyPrice: "", // 抢购价
      panicBuyNum: "",   // 抢购数量
      limitBuySetting: 1,   // 限购设置
      indexExtend: 1,       // 首页推广

      isShowGiftModal: false, // 添加礼品Modal
    }

    componentDidMount() {
      request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
        let { data } = res;
        this.setState({
          oss_data_data: data,
          oss_data: {
            policy: data.policy,
            OSSAccessKeyId: data.accessid,
            success_action_status: 200, //让服务端返回200,不然，默认会返回204
            signature: data.signature,
            callback: data.callback,
            host: data.host,
            key: data.dir + this.randomString(32) + '.png',
          },
        }, () => {
          console.log('aaa', this.state)
        });
      });
    }


    /**
     * 商品券使用须知
     */
    inputChange = (type: string) => (value: any) => {
      console.log(value, type)
      this.setState({ [type]: value })
    }


    /**随机数 */
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

    // 将图片转为base64
    getBase64 = (img: any, callback: any) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    };

    // 上传图片1前
    beforeUploadFirst = () => {
      this.setState({
        oss_data: {
          policy: this.state.oss_data_data.policy,
          OSSAccessKeyId: this.state.oss_data_data.accessid,
          success_action_status: 200, //让服务端返回200,不然，默认会返回204
          signature: this.state.oss_data_data.signature,
          callback: this.state.oss_data_data.callback,
          host: this.state.oss_data_data.host,
          key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
        }
      })
    }
    // 上传图片1
    imageChangeFirst = (info: any) => {
      if (info.file.status === 'uploading') {
        this.setState({ loadingFirst: true });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrlFirst: imageUrl,
            cover_image_first: info.file.response.data.path,
            loadingFirst: false,
          }, () => {
            console.log(this.state)
          }),
        );
      }
    };
    // 上传图片2前
    beforeUploadSecond = () => {
      this.setState({
        oss_data: {
          policy: this.state.oss_data_data.policy,
          OSSAccessKeyId: this.state.oss_data_data.accessid,
          success_action_status: 200, //让服务端返回200,不然，默认会返回204
          signature: this.state.oss_data_data.signature,
          callback: this.state.oss_data_data.callback,
          host: this.state.oss_data_data.host,
          key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
        }
      })
    }
    // 上传图片2
    imageChangeSecond = (info: any) => {
      if (info.file.status === 'uploading') {
        this.setState({ loadingSecond: true });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrlSecond: imageUrl,
            cover_image_second: info.file.response.data.path,
            loadingSecond: false,
          }, () => {
            console.log(this.state)
          }),
        );
      }
    };

    // 上传图片3前
    beforeUploadThird = () => {
      this.setState({
        oss_data: {
          policy: this.state.oss_data_data.policy,
          OSSAccessKeyId: this.state.oss_data_data.accessid,
          success_action_status: 200, //让服务端返回200,不然，默认会返回204
          signature: this.state.oss_data_data.signature,
          callback: this.state.oss_data_data.callback,
          host: this.state.oss_data_data.host,
          key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
        }
      })
    }
    // 上传图片3
    imageChangeThird = (info: any) => {
      if (info.file.status === 'uploading') {
        this.setState({ loadingThird: true });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrlThird: imageUrl,
            cover_image_third: info.file.response.data.path,
            loadingThird: false,
          }, () => {
            console.log(this.state)
          }),
        );
      }
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
          }, () => {
            console.log(_this.state)
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
     * 抢购时间
     */
    onChangeSelectTime = (value, dateString) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    }

    /**
     * 选中抢购时间
     */
    onOkSelectTime = (value) => {
      console.log('onOk: ', value);
    }


    /**
     * 
     */
    handleChange = (type, e) => {
      this.setState({
        [type]: e.target.value
      }, () => {
        console.log(this.state)
      })
    }


    /**
     * 切换Tab
     */
    handleChangeTabs = (key) => {
      console.log(key);
    }

    render() {
      const {
        couponType,
        couponName,
        ownStoreDataSource,
        goodsMarketPrize,
        goodsBuyPrize,
        goodsExtendNum,
        goodsLimitSetting,
        goodsValidity,
        rule_description,
        oss_data,
        imageUrlFirst,
        imageUrlSecond,
        imageUrlThird,
        isUploadVideo,
        progressLoad,
        videoUrlPath,
        isPlayVideo,
        editorState,
        goodsShareContent,
        participate,
        panicBuyPrice,
        panicBuyNum,
        limitBuySetting,
        indexExtend,
        isShowGiftModal
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

      const ownStoreColumns = [
        {
          title: '门店图片',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '门店名称',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '地址',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '联系人',
          dataIndex: 'concat',
          key: 'concat',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: '商圈',
          dataIndex: 'store',
          key: 'store',
        },
      ];
      const uploadButtonFirst = (
        <div className={styles.uploadDefault}>
          <Icon type={this.state.loadingFirst ? 'loading' : 'plus'} />
          <div className="ant-upload-text">上传图片</div>
        </div>
      );
      const uploadButtonSecond = (
        <div className={styles.uploadDefault}>
          <Icon type={this.state.loadingSecond ? 'loading' : 'plus'} />
          <div className="ant-upload-text">上传图片</div>
        </div>
      );
      const uploadButtonThird = (
        <div className={styles.uploadDefault}>
          <Icon type={this.state.loadingThird ? 'loading' : 'plus'} />
          <div className="ant-upload-text">上传图片</div>
        </div>
      );
      const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];
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
                <PictureOutlined />
              </button>
            </Upload>
          )
        }
      ]

      return (
        <div className={styles.add_coupon}>
          <Card title="基础信息" bordered={false} style={{ width: "100%" }}>
            <Form {...formItemLayout}
            >
              <Form.Item label="卡券类型">
                <Radio.Group value={couponType} onChange={this.handleChange.bind(this, 'couponType')}>
                  <Radio value={1}>商品券</Radio>
                  <Radio value={2}>现金券</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="卡券名称">
                <Input placeholder="最多允许输入30个字（60字符）" value={couponName} onChange={this.handleChange.bind(this, 'couponName')} />
              </Form.Item>

              <Form.Item label="所属门店">
                <Button type="primary"
                >添加</Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="销售信息" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
            <Form {...formItemLayout}
            >
              <Form.Item label="市场价">
                <Input value={goodsMarketPrize} onChange={this.handleChange.bind(this, 'goodsMarketPrize')} suffix="元" />
              </Form.Item>
              <Form.Item label="购买价">
                <Input value={goodsBuyPrize} onChange={this.handleChange.bind(this, 'goodsBuyPrize')} suffix="元" />
              </Form.Item>
              <Form.Item label="发放数量">
                <Input value={goodsExtendNum} onChange={this.handleChange.bind(this, 'goodsExtendNum')} suffix="张" />
              </Form.Item>
              <Form.Item label="限购设置">
                <Radio.Group value={goodsLimitSetting} onChange={this.handleChange.bind(this, 'goodsLimitSetting')}>
                  <Radio value={1}>无限制</Radio>
                  <Radio value={2}>x张/人</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="有效期">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>购券日起</span>
                  <Input value={goodsValidity} onChange={this.handleChange.bind(this, 'goodsValidity')} style={{ width: "250px" }} />
                  <span>天可用</span>
                </div>
              </Form.Item>
              <Form.Item label="使用须知">
                <RuleBox value={rule_description} onChange={this.inputChange('rule_description')} />
              </Form.Item>
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
                    <Upload
                      style={{ width: '150px', height: '150px' }}
                      listType="picture-card"
                      showUploadList={false}
                      onChange={this.imageChangeFirst}
                      data={oss_data}
                      action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                      beforeUpload={this.beforeUploadFirst}
                    >
                      {imageUrlFirst ? (
                        <img src={imageUrlFirst} alt="avatar" style={{ width: '150px', height: '150px' }} />
                      ) : (
                          uploadButtonFirst
                        )}
                    </Upload>
                  </div>

                  <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                    <Upload
                      style={{ width: '150px', height: '150px' }}
                      listType="picture-card"
                      showUploadList={false}
                      onChange={this.imageChangeSecond}
                      data={oss_data}
                      action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                      beforeUpload={this.beforeUploadSecond}
                    >
                      {imageUrlSecond ? (
                        <img src={imageUrlSecond} alt="avatar" style={{ width: '150px', height: '150px' }} />
                      ) : (
                          uploadButtonSecond
                        )}
                    </Upload>
                  </div>

                  <div style={{ width: '150px', height: '150px' }}>
                    <Upload
                      style={{ width: '150px', height: '150px' }}
                      listType="picture-card"
                      showUploadList={false}
                      onChange={this.imageChangeThird}
                      data={oss_data}
                      action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                      beforeUpload={this.beforeUploadThird}
                    >
                      {imageUrlThird ? (
                        <img src={imageUrlThird} alt="avatar" style={{ width: '150px', height: '150px' }} />
                      ) : (
                          uploadButtonThird
                        )}
                    </Upload>
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
                <Input value={goodsShareContent} onChange={this.handleChange.bind(this, 'goodsShareContent')} />
              </Form.Item>
            </Form>
          </Card>


          <Card title="限时抢购" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
            <Form {...formItemLayout}
            >
              <Form.Item label="是否参与抢购活动">
                <Radio.Group value={participate} onChange={this.handleChange.bind(this, 'participate')}>
                  <Radio value={1}>参与</Radio>
                  <Radio value={2}>不参与</Radio>
                </Radio.Group>
              </Form.Item>
              {
                participate == 1 ? (
                  <div>
                    <Form.Item label="抢购时间">
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['开始时间', '结束时间']}
                        onChange={this.onChangeSelectTime}
                        onOk={this.onOkSelectTime}
                      />
                    </Form.Item>
                    <Form.Item label="抢购价">
                      <Input value={panicBuyPrice} onChange={this.handleChange.bind(this, 'panicBuyPrice')} suffix="元" />
                    </Form.Item>
                    <Form.Item label="抢购数量">
                      <Input value={panicBuyNum} onChange={this.handleChange.bind(this, 'panicBuyNum')} suffix="元" />
                    </Form.Item>
                    <Form.Item label="限购设置">
                      <Radio.Group value={limitBuySetting} onChange={this.handleChange.bind(this, 'limitBuySetting')}>
                        <Radio value={1}>无限制</Radio>
                        <Radio value={2}>X张/人</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item label="首页推广">
                      <Radio.Group value={indexExtend} onChange={this.handleChange.bind(this, 'indexExtend')}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                      </Radio.Group>
                    </Form.Item>

                  </div>
                ) : ""
              }
            </Form>
          </Card>

          <Modal
            title="添加礼品"
            visible={isShowGiftModal}
            footer={null}
            width="820px"
          >
            <Tabs defaultActiveKey="1" onChange={this.handleChangeTabs}>
              <TabPane tab="我的礼品" key="1">
                Content of Tab Pane 1
              </TabPane>
              <TabPane tab="商圈礼品" key="2">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="平台礼品" key="3">
                Content of Tab Pane 3
              </TabPane>
            </Tabs>
          </Modal>
        </div >
      )
    }
  }
)
