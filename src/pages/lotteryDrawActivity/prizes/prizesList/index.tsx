import React, { Component } from 'react';
import {
  Table,
  Button,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  ConfigProvider,
  Divider,
  notification,
  Modal,
  Upload,
  message
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
import request from '@/utils/request';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  form: any;
  dispatch: (opt: any) => any;
  prizesList: any;
}

export default Form.create()(
  connect(({ prizesList }: any) => ({ prizesList }))(
    class PrizesList extends Component<Props> {
      state = {
        dataList: [],
        loading: false,
        total: 0,
        visible: false,
        imageUrl: '',
        cover_image: "",
        ImgLoading: false,
        oss_data: {}, // oss参数
        prizeName: '',
        prizeNum: '',
        prizePrice: '',
        editModal: false,
        editPrizeName: '',
        editPrizePrice: '',
        editPrizeNum: '',
        record: {},
        showPoolsModal: false,
        poolsPrizeName: '',
        relatedPools: [],
        showImgModal: false
      };

      componentDidMount() {
        this.getOSSData();
        // console.log(this.props);

        const {
          prizeName,
          currentPage,
          currentPageSize,
        } = this.props.prizesList;
        this.getListData(prizeName, currentPage, currentPageSize);
      }

      getListData = (prizeName: string, currentPage: any, currentPageSize: any) => {
        this.setState({
          loading: true,
        });
        request('/api/v1/prize', {
          method: 'GET',
          params: {
            name: prizeName,
            page: currentPage,
            count: currentPageSize
          }
        }).then(res => {
          this.setState({
            dataList: res.data,
            loading: false,
            total: res.pagination.total,
          })
        })
      }

      handleSearch = async (e: any) => {
        let prizeName = this.props.form.getFieldValue('prizeName');
        e.preventDefault();
        await this.props.dispatch({
          type: 'prizesList/setFussyForm',
          payload: {
            prizeName,
          },
        });

        const { currentPage, currentPageSize } = this.props.prizesList;

        this.getListData(prizeName, currentPage, currentPageSize);
      };

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        await this.props.dispatch({
          type: 'prizesList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        const { currentPage, currentPageSize } = this.props.prizesList;
        let prizeName = this.props.form.getFieldValue('prizeName');
        this.getListData(prizeName, currentPage, currentPageSize);
      };

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'prizesList/resetFussySearch',
        });
      };

      renderForm() {
        return this.renderSimpleForm();
      }

      renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { prizeName } = this.props.prizesList;
        return (
          <Form onSubmit={this.handleSearch.bind(this)} layout="inline">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="奖品名称">
                  {getFieldDecorator('prizeName', { initialValue: prizeName })(
                    <Input placeholder="请输入" />,
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
                </span>
              </Col>
            </Row>
          </Form>
        );
      }

      addPrize = () => {
        this.setState({
          visible: true,
        });
      };

      // 输入
      handleChangeInp = (type: string) => ({ target: { value } }) => {
        this.setState({ [type]: value });
      };

      getOSSData = () => {
        request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
          let { data } = res;
          console.log('data', data);
          this.setState({
            oss_data: {
              expire: data.expire,
              policy: data.policy,
              OSSAccessKeyId: data.accessid,
              success_action_status: 200, //让服务端返回200,不然，默认会返回204
              signature: data.signature,
              callback: data.callback,
              host: data.host,
              key: data.dir,
            },
          });
        });
      };

      transformFile = (file: any) => {
        const { oss_data } = this.state;
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        file.url = oss_data.key + filename;

        return file;
      };

      getExtraData = (file: any) => {
        const { oss_data } = this.state;
        return {
          key: file.url,
          policy: oss_data.policy,
          OSSAccessKeyId: oss_data.OSSAccessKeyId,
          success_action_status: 200, //让服务端返回200,不然，默认会返回204
          signature: oss_data.signature,
          callback: oss_data.callback,
          host: oss_data.host,
        };
      };

      beforeUpload = async () => {
        const { oss_data } = this.state;
        const expire = oss_data.expire * 1000;

        if (expire < Date.now()) {
          await this.getOSSData();
        }
        return true;
      };

      // 将图片转为base64
      getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      };

      // 上传图片
      imageChange = (info: any) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          this.getBase64(info.file.originFileObj, (imageUrl: any) =>
            this.setState(
              {
                imageUrl,
                cover_image: info.file.response.data.path,
                loading: false,
              },
              () => {
                console.log(this.state);
              },
            ),
          );
        }
      };

      handleOk = () => {
        const { prizeName, prizeNum, prizePrice, cover_image } = this.state;
        request('/api/v1/prize', {
          method: 'POST',
          data: {
            name: prizeName,
            stock: prizeNum,
            market_price: prizePrice,
            image: cover_image
          }
        }).then(res => {
          message.success(res.message);
          this.setState({
            visible: false,
            imageUrl: '',
            prizeName: '',
            prizeNum: '',
            prizePrice: '',
          })
          const {
            prizeName,
            currentPage,
            currentPageSize,
          } = this.props.prizesList;
          this.getListData(prizeName, currentPage, currentPageSize);
        })
      };

      handleCancel = () => {
        this.setState({
          visible: false,
          imageUrl: '',
          prizeName: '',
          prizeNum: '',
          prizePrice: '',
        });
      };

      handleDeletePrize = (record: any) => {
        let _this = this;
        confirm({
          title: '删除操作',
          content: '确定要删除该礼品吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request(`/api/v1/prize/${record.id}`, {
              method: 'DELETE',
            }).then(res => {
              if (res.status_code == 400) {
                message.error(res.message);
              } else {
                message.success(res.message);
              }

              const {
                prizeName,
                currentPage,
                currentPageSize,
              } = _this.props.prizesList;
              _this.getListData(prizeName, currentPage, currentPageSize);
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      handleEdit = (record: any) => {
        this.setState({
          editModal: true,
          editPrizeName: record.name,
          editPrizePrice: record.market_price,
          editPrizeNum: record.stock,
          record
        })
      }

      handleEditOk = () => {
        const { record, editPrizeNum, editPrizeName, editPrizePrice } = this.state;
        request(`/api/v1/prize/${record.id}`, {
          method: 'PUT',
          params: {
            name: editPrizeName,
            image: record.image,
            market_price: editPrizePrice,
            stock: editPrizeNum
          }
        }).then(res => {
          if (res.status_code == 400) {
            message.error(res.message);
          } else {
            message.success(res.message);
          }

          this.setState({
            editModal: false
          })

          const {
            prizeName,
            currentPage,
            currentPageSize,
          } = this.props.prizesList;
          this.getListData(prizeName, currentPage, currentPageSize);
        })
      }

      handleEditCancel = () => {
        this.setState({
          editModal: false
        })
      }

      // handleEditInp = (e: any) => {
      //   // console.log(e.target.value);
      //   this.setState({
      //     editPrizeNum: e.target.value
      //   })
      // }

      handleEditInp = (type: string) => ({ target: { value } }) => {
        this.setState({ [type]: value });
      };

      handlePoolsCount = (record: any) => {
        // console.log(record)
        request(`/api/v1/prize/pools/${record.id}`, {
          method: 'GET'
        }).then(res => {
          if (res.status_code == 200) {
            this.setState({
              showPoolsModal: true,
              poolsPrizeName: record.name,
              relatedPools: res.data
            })
          }
        })
      }

      handleZoomInImg = (record: any) => {
        this.setState({
          showImgModal: true,
          record
        })
      }

      render() {
        const {
          visible,
          imageUrl,
          ImgLoading,
          oss_data,
          prizeName,
          prizeNum,
          prizePrice,
          dataList,
          loading,
          total,
          editModal,
          editPrizeName,
          editPrizePrice,
          editPrizeNum,
          showPoolsModal,
          poolsPrizeName,
          relatedPools,
          showImgModal,
          record
        } = this.state;
        const { currentPage, currentPageSize } = this.props.prizesList;
        const uploadButton = (
          <div className={styles.uploadDefault}>
            <Icon type={ImgLoading ? 'loading' : 'plus'} />
            <div className={styles.upload_text}>上传奖品图片，尺寸：364*192</div>
          </div>
        );
        const uploadProps = {
          name: 'file',
          action: oss_data.host,
          onChange: this.imageChange,
          transformFile: this.transformFile,
          data: this.getExtraData,
          beforeUpload: this.beforeUpload,
        };

        const columns = [
          {
            title: '奖品图片',
            dataIndex: 'image',
            key: 'image',
            width: 200,
            render: (text: any, record: any) => (
              <span>
                <img src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/" + record.image} alt="" width="91px" height="48px" style={{ cursor: 'zoom-in' }} onClick={this.handleZoomInImg.bind(this, record)} />
              </span>
            ),
          },
          {
            title: '奖品名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '奖品价值',
            dataIndex: 'market_price',
            key: 'market_price',
          },
          {
            title: '奖品库存',
            dataIndex: 'stock',
            key: 'stock',
          },
          {
            title: '关联奖池',
            dataIndex: 'poolsCount',
            key: 'poolsCount',
            render: (text: any, record: any) => (
              <span>
                <a onClick={this.handlePoolsCount.bind(this, record)}>{record.poolsCount}</a>
              </span>
            ),
          },
          {
            title: '操作',
            key: 'operation',
            width: 200,
            render: (text: any, record: any) => (
              <span>
                <a onClick={this.handleEdit.bind(this, record)}>编辑库存</a>
                <Divider type="vertical" />
                <a onClick={this.handleDeletePrize.bind(this, record)}>删除礼品</a>
              </span>
            ),
          },
        ];
        return (
          <div className={styles.prizesList}>
            <Modal
              title="添加奖品"
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width="430px"
            >
              <div className={styles.add_layout}>
                <div className={styles.title}>奖品名称</div>
                <Input
                  size="small"
                  style={{ width: '264px', height: '30px' }}
                  value={prizeName}
                  onChange={this.handleChangeInp('prizeName')}
                />
              </div>
              <div className={styles.add_layout}>
                <div className={styles.title}>奖品库存</div>
                <Input
                  size="small"
                  style={{ width: '264px', height: '30px' }}
                  value={prizeNum}
                  onChange={this.handleChangeInp('prizeNum')}
                />
              </div>
              <div className={styles.add_layout}>
                <div className={styles.title}>奖品价值</div>
                <Input
                  size="small"
                  style={{ width: '264px', height: '30px' }}
                  value={prizePrice}
                  onChange={this.handleChangeInp('prizePrice')}
                />
              </div>
              <div className={styles.add_layout}>
                <div style={{ width: '364px', height: '192px' }}>
                  <Upload
                    style={{ width: '100%' }}
                    listType="picture-card"
                    showUploadList={false}
                    {...uploadProps}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: '364px', height: '192px' }}
                      />
                    ) : (
                        uploadButton
                      )}
                  </Upload>
                </div>
              </div>
            </Modal>

            <Modal
              title="编辑库存"
              visible={editModal}
              onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
              width="430px"
            >
              <div className={styles.add_layout}>
                <div className={styles.title}>奖品名称</div>
                {/* <div>{editPrizeName}</div> */}
                <Input
                  size="small"
                  style={{ width: '264px', height: '30px' }}
                  value={editPrizeName}
                  onChange={this.handleEditInp('editPrizeName')}
                />
              </div>
              <div className={styles.add_layout}>
                <div className={styles.title}>奖品价格</div>
                {/* <div>{editPrizePrice}</div> */}
                <Input
                  size="small"
                  style={{ width: '264px', height: '30px' }}
                  value={editPrizePrice}
                  onChange={this.handleEditInp('editPrizePrice')}
                />
              </div>
              <div className={styles.add_layout}>
                <div className={styles.title}>奖品库存</div>
                <Input
                  size="small"
                  style={{ width: '264px', height: '30px' }}
                  value={editPrizeNum}
                  onChange={this.handleEditInp('editPrizeNum')}
                />
              </div>
            </Modal>

            <Modal
              title="关联奖池"
              visible={showPoolsModal}
              closable={false}
              footer={(
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({
                      showPoolsModal: false
                    })
                  }}
                >
                  关闭
                </Button>
              )}
              width="430px"
            >
              <div>
                <div className={styles.add_layout}>
                  <div className={styles.title}>奖品名称</div>
                  <div>{poolsPrizeName}</div>
                </div>
                <div className={styles.add_layout_pools}>
                  <div className={styles.title}>关联奖池</div>
                  <div className={styles.related_pools}>
                    {
                      relatedPools.map((item: any, index: any) => (
                        <div>
                          {/* <span>{index + 1}. </span> */}
                          <span>{item.name}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </Modal>

            <Modal
              title="显示图片"
              visible={showImgModal}
              onCancel={() => {
                this.setState({
                  showImgModal: false
                })
              }}
              footer={false}
              width="430px"
            >
              <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/${record.image}`} width="100%" alt="" />
            </Modal>

            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Button
              type="primary"
              icon="plus"
              className={styles.addPrize}
              onClick={this.addPrize}
            >
              添加奖品
            </Button>

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
    },
  ),
);
