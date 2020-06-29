import React, { Component } from 'react'
import { Breadcrumb, Table, Modal, InputNumber, notification } from 'antd'
import { getGiftDetails, getGiftUseList, changeGiftNum } from '../service'
import styles from './index.less'
import e from 'express'

export default class GiftDetails extends Component {
  state = {
    visible: false,
    confirmLoading: false,
    id: '',
    gift_type: null,
    gift_name: '',
    gift_original_money: '',
    gift_money: '',
    status: '',
    total_repertory_num: '',
    total_give_num: '',
    total_surplus_num: 0,
    each_num: '',
    delivery_type: null,
    delivery_pay_type: null,
    use_description: '',
    rule_description: '',
    gift_detail: '',
    created_at: '',
    gift_image: '',
    dataList: [],
    loading: false,
    total: 30,
    currentPage: 0,
    currentPageSize: 0,
    add_repertory_num: 0
  }
  componentDidMount() {
    getGiftDetails(this.props.location.query.id).then((res: any) => {
      if (res.data) {
        this.setState({
          ...this.state,
          ...res.data
        })
      } else {
        notification.open({
          message: '请求失败',
          description: res.message
        });
      }
    })
    this.getGiftUseData(1, 10)
  }

  handleOk = () => {
    this.setState({ confirmLoading: true });
    changeGiftNum(this.props.location.query.id, this.state.add_repertory_num).then(res => {
      if (res.status_code == 200) {
        let add = Number(this.state.total_surplus_num) + Number(this.state.add_repertory_num);
        console.log('add', add)
        this.setState({ total_surplus_num: add, loading: false, visible: false, confirmLoading: false })
      } else {
        this.setState({ visible: false, confirmLoading: false })
        notification.open({
          message: '请求失败',
          description: res.message
        });
      }
    }).catch((err) => {
      this.setState({ visible: false, confirmLoading: false })
    })
  };

  handleChange = async (pagination: any, filters: any, sorter: any) => {
    let that = this, currentPage = pagination.current, currentPageSize = pagination.pageSize;
    this.setState({ currentPage, currentPageSize }, () => {
      that.getGiftUseData(currentPage, currentPageSize)
    })
  }

  getGiftUseData = (page: string | number, count: string | number) => {
    this.setState({ loading: true });
    getGiftUseList(this.props.location.query.id, page, count).then(res => {
      if (res.data) {
        this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
      } else {
        notification.open({
          message: '请求失败',
          description: res.message
        });
      }
    })
  }

  onChangeNumber = (value: any) => {
    this.setState({ add_repertory_num: value })
  }

  showLog = (id: any) => {
    console.log(id)
  }

  render() {
    const { dataList, loading, total, currentPage, currentPageSize, gift_name, gift_type, delivery_type, gift_original_money, total_repertory_num, gift_image, gift_money, gift_detail, rule_description, use_description, total_surplus_num, delivery_pay_type, each_num } = this.state;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '商家名称',
        dataIndex: 'supplier',
        key: 'supplier',
        render: (text: any, record: any) => (<span>{record.binging_store.name}</span>)//测试，不一定可以
      },
      {
        title: '绑定类型',
        dataIndex: 'binding_point_type',
        key: 'binding_point_type',
        render: (text: any, record: any) => (<span>{record.binding_point_type == 1 ? '拼团活动' : (record.binding_point_type == 2 ? '增值活动' : (record.binding_point_type == 3 ? '优惠券' : ''))}</span>)//1拼团活动2增值活动3优惠券
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text: any, record: any) => (<span>{record.status == 1 ? '正常' : (record.status == 2 ? '关闭' : '')}</span>)//1拼团活动2增值活动3优惠券
      },
      {
        title: '赠送的阶段',
        dataIndex: 'give_stage',
        key: 'give_stage',
        render: (text: any, record: any) => (<span>{
          (record.binding_point_type == 1 && record.give_stage == 1) ? '开团' : (
            (record.binding_point_type == 1 && record.give_stage == 2) ? '参团' : (
              (record.binding_point_type == 1 && record.give_stage == 3) ? '成团' : (
                ((record.binding_point_type == 1 && record.give_stage == 4) || (record.binding_point_type == 2 && record.give_stage == 3) || (record.binding_point_type == 3 && record.give_stage == 2)) ? '成交' : (
                  ((record.binding_point_type == 2 && record.give_stage == 1) || (record.binding_point_type == 3 && record.give_stage == 1)) ? '购买' : (
                    (record.binding_point_type == 2 && record.give_stage == 2) ? '助力' : ''
                  )
                )
              )))
        }</span>)//1拼团活动2增值活动3优惠券
      },
      {
        title: '活动名称',
        dataIndex: 'binding',
        key: 'binding',
        render: (text: any, record: any) => (<span>{record.binding.name}</span>)//测试，应该可以
      },
      {
        title: '领用数量',
        dataIndex: 'repertory_num',
        key: 'repertory_num',
      },
      {
        title: '剩余库存',
        dataIndex: 'surplus_num',
        key: 'surplus_num',
      },
      {
        title: '已派发数量',
        dataIndex: 'give_num',
        key: 'give_num',
      },
      {
        title: '已获得数量',
        dataIndex: 'obtain_num',
        key: 'obtain_num',
      },
      // {
      //   title: '已核销数量',
      //   dataIndex: 'cancel_num',
      //   key: 'cancel_num',
      // },
      {
        title: '领用时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      // {
      //   title: '操作',
      //   dataIndex: 'id',
      //   key: 'id',
      //   render: (text: any, record: any) => (<a onClick={this.showLog.bind(this, record.id)}>配送记录</a>)
      // },
    ];
    return (
      <div className={styles.details_page}>
        <Breadcrumb>
          <Breadcrumb.Item>礼品管理</Breadcrumb.Item>
          <Breadcrumb.Item>礼品详情</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <div className={styles.layout_box}>
            <div className={styles.block}>
              <div className={styles.block_item}>
                <div className={styles.item_label}>礼品类型：</div>
                <div className={styles.item_main}>{gift_type == 1 ? '现金券' : gift_type == 2 ? '商品券' : gift_type == 3 ? '实物券' : null}</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>礼品价格：</div>
                <div className={styles.item_main}>{gift_money}元</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>配送方式：</div>
                <div className={styles.item_main}>{delivery_type == 1 ? '快递' : null}</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>礼品图片：</div>
                <div className={styles.item_main}><img className={styles.item_main_img} src={'http://oss.tdianyi.com/' + gift_image} /></div>
              </div>
            </div>

            <div className={styles.block}>
              <div className={styles.block_item}>
                <div className={styles.item_label}>礼品名称：</div>
                <div className={styles.item_main}>{gift_name}</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>礼品数量：</div>
                <div className={styles.item_main}>{total_repertory_num}个</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>邮费：</div>
                <div className={styles.item_main}>{delivery_pay_type == 1 ? '平台承担' : ''}</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>使用规则：</div>
                <div className={styles.item_main}>
                  {
                    rule_description && JSON.parse(rule_description).length ? JSON.parse(rule_description).map((item: any, index: any) => {
                      return (
                        <div key={index} >{item}</div>
                      )
                    }) : null
                  }
                </div>
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.block_item}>
                <div className={styles.item_label}>展示价格：</div>
                <div className={styles.item_main}>{gift_original_money}</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>发放方式：</div>
                <div className={styles.item_main}>1份/{each_num}个</div>
              </div>
              <div className={styles.block_item}>
                <div className={styles.item_label}>使用说明：</div>
                <div className={styles.item_main}>{use_description}</div>
              </div>
            </div>
          </div>
          {/* <div className={styles.layout_box}>
            <div className={styles.block}>
              <div className={styles.block_item}>
                <div className={styles.item_label}>多图详情：</div>
                <div className={styles.item_main}>
                  <div className={styles.item_main_phone}>
                    <div dangerouslySetInnerHTML={{ __html: gift_detail }} />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className={styles.layout_box_column}>
            <div className={styles.block}>
              <div className={styles.block_item}>
                <div className={styles.item_label}>使用记录：</div>
              </div>
            </div>
            <div className={styles.block}>
              <div className={styles.block_item_column}>
                <div className={styles.item_label_row}>
                  <div className={styles.remaining_num}>礼品剩余数量：{total_surplus_num}个</div>
                  <div className={styles.remaining_btn} onClick={() => { this.setState({ visible: true }) }}>添加库存</div>
                </div>
                <div className={styles.item_labe_table}>
                  {
                    dataList ? <Table
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
                  /> : null
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="请输入添加库存数"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={() => { !this.state.confirmLoading && this.setState({ visible: false }) }}
        >
          <InputNumber min={0} defaultValue={0} onChange={this.onChangeNumber} />
        </Modal>
      </div>
    )
  }
}
