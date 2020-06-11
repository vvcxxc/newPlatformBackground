import React, { Component, useState, useEffect } from 'react'
import { Button, message  } from 'antd'
import request from '@/utils/request';
import styles from './index.less'
import route from 'mock/route';
import { router } from 'umi';

export default function SetNumber(Props: any) {

  const [zfb, setZfb] = useState({
    zfb_name: '',
  });

  const [wx, setWx] = useState({
    wx_name: '',
  });
  const [list, setId] = useState({
    id: '',
  });

  useEffect(() => {
    request.get('/api/v1/store/merchantNumber', {
      params: {
        supplierid: Props.location.query.id
        }
    }).then(res => {
      const { data, status_code } = res
      setWx({ wx_name: data.wechat_mch_id })
      setZfb({ zfb_name: data.alipay_mch_id })
      setId({ id:data.id})
    })
  }, []);

  const updateData = () => {
    request.post('/api/v1/store/updateMerchantNumber/' + list.id, {
     data: {
       wechat_mch_id: wx.wx_name,
       alipay_mch_id: zfb.zfb_name
     }
    }).then(res => {
      const { status_code } = res
      if (status_code == 200) {
        message.success(res.message)
      } else {
        message.error(res.message)
      }
   })
  }

  return (
    <main className={styles.store_audit}>
      <header>
        <span>门店审核/</span>
        <span>商户号设置</span>
      </header>

      <main>
        <div>商户号设置</div>
        <div className={styles.inputbox}>
          <span>微信商户号：</span>
          <input type="text"
            value={wx.wx_name}
            onChange={(e) => { setWx({ wx_name: e.target.value }) }} />
        </div>
        <div className={styles.inputbox}>
          <span>支付宝商户号：</span>
          <input type="text" value={zfb.zfb_name}
            onChange={(e) => { setZfb({ zfb_name: e.target.value }) }}
          />
        </div>
      </main>

      <footer>
        <div className={styles.buttonBox}>
          <Button type='primary' className={styles.confirm} onClick={updateData}>确定</Button>
          <Button className={styles.confirm} onClick={()=>router.goBack()}>取消</Button>
        </div>
      </footer>
    </main>
  )
}
