import React, { useState, useEffect } from 'react';
import styles from './index.less';
import request from '@/utils/request';

function ViewActivity(Props: any) {
  const [info, setInfo] = useState({
    name: '',
    area_name: '',
    enlistTime: '',
    card_num: 0,
    cover_image: '',
    rules: [],
    introduce: ''
  });
  useEffect(() => {
    request('/api/v1/activity/recruit/' + Props.location.query.activity_id, { method: 'get' }).then(
      res => {
        setInfo(res.data);
      },
    );
  }, []);

  return (
    <div className={styles.viewPage}>
      <div className={styles.header}>活动招募信息</div>
      <div className={styles.add_layout}>
        <div className={styles.title}>活动名称</div>
        <div>{info.name}</div>
      </div>

      <div className={styles.add_layout}>
        <div className={styles.title}>活动区域</div>
        <div>{info.area_name}</div>
      </div>

      <div className={styles.add_layout}>
        <div className={styles.title}>招募时间</div>
        <div>{info.enlistTime}</div>
      </div>

      <div className={styles.add_layout}>
        <div className={styles.title}>卡券限制</div>
        <div>{info.card_num}</div>
      </div>

      <div className={styles.add_layout}>
        <div className={styles.title}>招募活动图</div>
        <img src={info.cover_image} className={styles.cover_image} />
      </div>

      <div className={styles.add_layout}>
        <div className={styles.title}>招募规则</div>
        <div className={styles.ruleList}>
          {/* <div>123</div> */}
          {info.rules.map((item: string, index: number) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </div>

      <div className={styles.add_layout}>
        <div className={styles.title}>活动简介</div>
        <div>{info.introduce}</div>
      </div>
    </div>
  );
}
export default ViewActivity;
