import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Spin, Button, Input, DatePicker, notification } from 'antd';
// const { RangePicker } = DatePicker;
import moment from 'moment';
import request from '@/utils/request';
import { router } from 'umi';
function EditActivity(props: any) {
  const [a, setA] = useState(1);
  const [info, setInfo] = useState();
  const [startDate, setStart] = useState();
  const [endDate, setEnd] = useState();
  const [Loading, setLoading] = useState(false);
  const [condition_money, setMoney] = useState();
  const [daily_card, setDaily] = useState()


  useEffect(() => {
    // componentDidMount生命周期

    let id = props.location.query.id
    setLoading(true)
    request.get('/api/v1/activity/cardcollecting/' + id).then(res => {
      console.log(res)
      setLoading(false)
      setInfo(res.data)
      setMoney(res.data.condition_money)
      setDaily(res.data.daily_card)
      setStart(res.data.start_date)
      setEnd(res.data.end_date)
    })
  }, []);

  // 选择日期
  const selectDate = (time: any) => {
    setEnd(moment(time).format('YYYY-MM-DD'));
  };

  const handleInput = (type: string) => ({ target: { value } }) => {
    if(type == 'daily_card'){
      setDaily(value)
    }else if (type == 'condition_money'){
      setMoney(value)
    }
  };

  const confirm = () => {
    let id = props.location.query.id
    request.put('/api/v1/activity/cardcollecting/'+id,{
      data: {
        id,
        area_id: info.area_id,
        name: info.name,
        start_date: startDate,
        end_date: endDate,
        daily_card,
        condition_money
      }
    }).then(res => {
      console.log(res)
      if(res.status_code == 200){
        notification.success({
          message: res.message
        })
        router.goBack()
      }else{
        notification.error({
          message: res.message
        })
      }
    })
  }
  console.log(endDate)
  return (
    <div className={styles.page}>
      <Spin spinning={Loading}>
        <div className={styles.header}>集卡抽奖</div>
        {info ? <div className={styles.main}>
          <div className={styles.title}>修改活动基本信息</div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>活动名称</div>
            <div>{info.name}</div>
          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>活动时间</div>
            {/* <RangePicker size="small" onChange={selectDate} value={[moment(startDate), moment(endDate)]} /> */}
            {
              startDate ? (
                <div>
                  <DatePicker defaultValue={moment(startDate, 'YYYY-MM-DD')} disabled />
                  -
                  {
                    endDate ? <DatePicker defaultValue={moment(endDate, 'YYYY-MM-DD')} onChange={selectDate}/> : null
                  }

                </div>
              ) : null
            }

          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>设置活动区域</div>
            <div>{info.areaname}</div>
          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>派发条件</div>
            满
            <Input
              size="small"
              value={condition_money}
              style={{ width: '110px', marginLeft: '5px', marginRight: '5px' }}
              onChange={handleInput('condition_money')}
            />
            元
          </div>
          <div className={styles.item_layout}>
            <div className={styles.item_title}>派卡限制</div>
            <Input
              size="small"
              value={daily_card}
              style={{ width: '110px', marginRight: '5px' }}
              onChange={handleInput('daily_card')}
            />
            张/天
          </div>
        </div> : null}
        <div style={{ marginTop: 10 }}>
          <Button type="primary" style={{ marginRight: 30 }} onClick={confirm}>
            发布活动
          </Button>
          <Button type="danger" onClick={()=>router.goBack()}>取消</Button>
        </div>
      </Spin>
    </div>
  );
}

export default EditActivity;
