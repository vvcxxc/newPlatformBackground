import React, { Component } from 'react';
import styles from './index.less';
import { Spin, Table, Button } from 'antd';
import request from '@/utils/request';
import { router } from 'umi';
export default class ViewJackPot extends Component {
  state = {
    Loading: false, //loading
    info: {
    },
  };

  componentDidMount() {
    let id = this.props.location.query.id
    request.get('/api/v1/pools/' + id).then(res => {
      if (res.status_code == 200) {
        if (res.data.type == 2) {
          for (let i in res.data.objectPools.prize) {
            res.data.objectPools.prize[i].key = i
          }
        }
        this.setState({ info: res.data })
      }
    })
  }

  render() {
    const { Loading, info } = this.state;
    const columns = [
      {
        title: '编号',
        render: (a: any, b: any, index: number) => {
          return index + 1
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
        key: 'probability',
        render: (text: any) => {
          return text + '%'
        }
      },
    ];
    return (
      <div className={styles.page}>
        <Spin spinning={Loading}>
          <div className={styles.header}>查看活动奖池</div>
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
                  <div>已设置{info.cardPools ? info.cardPools.number : null}张</div>
                </div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>谢谢参与中奖率</div>
                  <div>{info.cardPools ? info.cardPools.not_win_probability : null}%</div>
                </div>
                <div className={styles.item_layout}>
                  <div className={styles.item_title}>每日卡券库存</div>
                  <div>{info.cardPools ? info.cardPools.daily_number : null}</div>
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
                      style={{ width: '550px' }}
                      dataSource={info.objectPools.prize}
                      columns={columns}
                      pagination={false}
                    />
                  </div>
                </div>
              </div>
            ) : null
          }

          <div className={styles.main}>
            <div className={styles.title}>抽奖活动信息</div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>应用的抽奖活动</div>
              <div>{info.activity_card_name}</div>
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>活动状态</div>
              <div>{
                info.activity_status == 0 ? '未生效' : (
                  info.activity_status == 1 ? '已开始' : (
                    info.activity_status == 2 ? '已结束' : (
                      info.activity_status == 3 ? '未关联' : ''
                    )
                  )
                )
              }</div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <Button type="danger" onClick={() => router.goBack()}>关闭</Button>
          </div>
        </Spin>
      </div>
    );
  }
}
