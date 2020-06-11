import React, { Component } from 'react';
import styles from './index.less';
import { Spin, Input, Table, Button, notification } from 'antd';
import request from '@/utils/request';
import { router } from 'umi';
class EditJackPot extends Component {
  state = {
    Loading: false, //loading
    info: {},
    not_win_probability: '',
    daily_number: '',

    probability: [], //概率
    sort: [], // 排序
  };

  componentDidMount() {
    let id = this.props.location.query.id
    this.setState({ Loading: true })
    request.get('/api/v1/pools/' + id).then(res => {
      this.setState({ Loading: false })
      if (res.status_code == 200) {
        if (res.data.type == 2) {
          let probability = []
          let sort = []
          for (let i in res.data.objectPools.prize) {
            res.data.objectPools.prize[i].key = i
            probability.push(res.data.objectPools.prize[i].probability)
            sort.push(res.data.objectPools.prize[i].sort)
          }
          this.setState({ info: res.data, probability, sort })
        } else {
          this.setState({
            not_win_probability: res.data.cardPools.not_win_probability,
            daily_number: res.data.cardPools.daily_number,
            info: res.data
          })
        }
      }
    })
  }

  // 输入
  handleInput = (type: string) => ({ target: { value } }) => {
    if (type == 'not_win_probability') {
      if (value.includes('.')) {
        let arr = value.split('.')
        if (arr[1].length > 1) {
          return
        } else {
          if (arr[0] && arr[0] != '.') {
            this.setState({ [type]: value })
          }
        }
      } else {
        this.setState({ [type]: value })
      }
    } else {
      this.setState({ [type]: value })
    }
  }

  // 中奖率输入
  percentChange = (index: number) => ({ target: { value } }) => {
    let { probability } = this.state
    if (value.includes('.')) {
      let arr = value.split('.')
      if (arr[1].length > 1) {
        return
      } else {
        if (arr[0] && arr[0] != '.') {
          probability[index] = value
          this.setState({ probability })
        }
      }
    } else {
      probability[index] = value
      this.setState({ probability })
    }
  }

  // 排序输入
  sortChange = (index: number) => ({ target: { value } }) => {
    let { sort } = this.state
    sort[index] = Number(value)
    this.setState({ sort })
  }

  // 提交
  submit = () => {
    const { not_win_probability, daily_number, probability, info, sort } = this.state
    let data = {}
    if (info.type == 2) {
      let prize = info.objectPools.prize
      let object_prize_pool_id = []
      let activity_prize_id = []
      let sum = 0
      for (let i in prize) {
        object_prize_pool_id.push(prize[i].object_prize_pool_id)
        activity_prize_id.push(prize[i].activity_prize_id)
      }
      for (let i in probability) {
        sum = sum + Number(probability[i])
      }
      if (sum > 100) {
        notification.error({
          message: '总中奖率不能超过100%'
        })
        return
      }
      data = {
        type: info.type,
        object_prize_pool_id,
        probability,
        activity_prize_id,
        sort
      }
    } else {
      data = {
        type: info.type,
        not_win_probability,
        daily_number,
        card_id: info.cardPools.id,
      }
    }
    request.put('/api/v1/pools', { data }).then(res => {
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

  }

  render() {
    const { Loading, info, probability, sort } = this.state;
    const columns = [
      {
        title: '编号',
        render: (a: any, b: any, index: number) => {
          return (index + 1)
        }

      },
      {
        title: '礼品ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '礼品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '中奖率',
        dataIndex: 'probability',
        render: (text: any, record: object, index: number) => (
          <div>
            <Input className={styles.inputBox} type='number' onChange={this.percentChange(index)} value={probability[index]} placeholder="设置中奖率" />%
          </div>
        ),
      },
      {
        title: '排序',
        dataIndex: 'sort',
        render: (text: any, record: object, index: number) => (
          <div>
            <Input className={styles.inputBox} style={{ width: 70 }} onChange={this.sortChange(index)} type='number' value={sort[index]} placeholder="排序" />
          </div>
        ),
      }
    ];
    return (
      <div className={styles.page}>
        <Spin spinning={Loading}>
          <div className={styles.header}>编辑活动奖池</div>
          <div className={styles.main}>
            <div className={styles.title}>奖池配置</div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>奖池名称</div>
              <div>{info.name}</div>
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>奖品类型</div>
              <div>{info.type == 1 ? '线上卡券' : '实物奖品'}</div>
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>关联的营销活动</div>
              <div>{info.activity_name}</div>
            </div>
          </div>

          {
            info.type == 1 ? (
              <div className={styles.main}>
                <div className={styles.title}>线上卡券奖池</div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>关联活动</div>
                  <div>{info.activity_name}</div>
                </div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>礼品数量</div>
                  <div>已设置{info.cardPools.number}张</div>
                </div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>谢谢参与中奖率</div>
                  <Input
                    type="number"
                    onChange={this.handleInput('not_win_probability')}
                    value={this.state.not_win_probability}
                    size="small"
                    style={{ width: '170px', marginRight: 5 }}
                  />%
            </div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>每日卡券库存</div>
                  <Input
                    type="number"
                    onChange={this.handleInput('daily_number')}
                    value={this.state.daily_number}
                    size="small"
                    style={{ width: '170px', marginRight: 5 }}
                  />张
            </div>
              </div>
            ) : info.type == 2 ? (
              <div className={styles.main}>
                <div className={styles.title}>实物奖品奖池</div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>实物数量</div>
                  <div>已选择{info.objectPools.number}份</div>
                </div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>设置奖品中奖率</div>
                  <div>
                    <Table
                      size="small"
                      style={{ width: '750px' }}
                      dataSource={info.objectPools.prize}
                      columns={columns}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            ) : null
          }

          <div style={{ marginTop: 10 }}>
            <Button type="primary" style={{ marginRight: 30 }} onClick={this.submit}>
              发布活动
            </Button>
            <Button type="danger" onClick={() => router.goBack()}>取消</Button>
          </div>
        </Spin>
      </div>
    );
  }
}

export default EditJackPot;
