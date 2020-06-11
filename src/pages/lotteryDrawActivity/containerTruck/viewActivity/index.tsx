import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Spin, Table } from 'antd';
import request from '@/utils/request'
function ViewActivity(props: any) {
  const [info, SetInfo] = useState({
    basic: {
      name: '',
      areaname: '',
      start_date: '',
      end_date: '',
      condition_money: '',
      daily_card: 0
    },
    card: [],
    lucky: []
  });
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    let id = props.location.query.id
    setLoading(true)
    request.get('/api/v1/activity/cardcollecting/info', { params: { id } }).then(res => {
      if(res.data.lucky.length){
        for (let i in res.data.card){
          res.data.card[i].key = i
        }
      }
      SetInfo(res.data)
      setLoading(false)
    })
  }, []);

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '选择卡片',
      dataIndex: 'name',
    },
    {
      title: '卡片编号',
      dataIndex: 'number',
    },
  ];

  return (
    <div className={styles.page}>
      <Spin spinning={Loading}>
        <div className={styles.header}>集卡抽奖</div>
        <div className={styles.main}>
          <div className={styles.title}>活动基本信息</div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>活动名称</div>
            <div>{info.basic.name}</div>
          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>活动时间</div>
            <div>{info.basic.start_date}至{info.basic.end_date}</div>
          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>活动区域</div>
            <div>{info.basic.areaname}</div>
          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>派发条件</div>
            <div>满{info.basic.condition_money}元</div>
          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>派卡限制</div>
            <div>{info.basic.daily_card}张/天</div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.title}>活动卡片项目</div>
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            {
              info.card.length ? (
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={info.card}
                  style={{ width: '510px' }}
                  size="small"
                />
              ) : null
            }

          </div>

          {
            info.lucky.length ? info.lucky.map((item, key) => {
              return (
                <div key={key}>
                  <div className={styles.title}>抽奖条件信息</div>
                  <div className={styles.condition}>
                    <div className={styles.item_layout}>
                      <div className={styles.item_title}>抽奖条件</div>
              <div>{item.rule}</div>
                    </div>
                    <div className={styles.item_layout}>
                      <div className={styles.item_title}>关联卡片</div>
                      <div>{item.card}</div>
                    </div>
                    <div className={styles.item_layout}>
                      <div className={styles.item_title}>奖池设定</div>
              <div>{item.name}</div>
                    </div>
                  </div>
                </div>
              )
            }) : null
          }


        </div>
      </Spin>
    </div>
  );
}
export default ViewActivity;
