import React, { useEffect, useState } from 'react';
import { Table, Select, Form, Col, Row, Input, Button } from 'antd'
import styles from './index.less'
import { connect } from 'dva';
import {getBusinessList, getGiftList} from '../service'
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  form: any;
  dispatch: (opt: any) => any;
}


const GiftList: React.FC = ({businessGiftList, form, dispatch}: any) => {
  const [business_list, setBusinessList] = useState([])
  const [total, setTotal] = useState(0)
  const [gift_list, setList] = useState([])
  const { getFieldDecorator } = form;
  const {gift_name, store_name, gift_type, business_district_id, page} = businessGiftList
  useEffect(()=>{
    // 获取商圈列表
    getBusinessList().then(res => {
      setBusinessList(res.data)
    })
    // 获取礼品列表
    let data = {
      gift_type: gift_type ? gift_type : undefined,
      gift_name: gift_name ? gift_name : undefined,
      is_terrace: 0,
      business_district_id: business_district_id ? business_district_id : undefined,
      store_name: store_name ? store_name : undefined,
      page,
    }
    getList(data)

  },[])

  const getList = (data: any) => {
    getGiftList(data).then(res => {
      setList(res.data)
      setTotal(res.meta.pagination.total)
    })
  }


  const onSearch = (e: any) => {
    e.preventDefault();
    let gift_name = form.getFieldValue('gift_name');
    let store_name = form.getFieldValue('store_name');
    let gift_type = form.getFieldValue('gift_type');
    let business_district_id = form.getFieldValue('business_district_id');
    let data = {
      gift_type: gift_type ? gift_type : undefined,
      gift_name: gift_name ? gift_name : undefined,
      is_terrace: 0,
      business_district_id: business_district_id ? business_district_id : undefined,
      store_name: store_name ? store_name : undefined,
      page: 1,
    }
    dispatch({
      type: 'businessGiftList/setDate',
      payload: {
        gift_name,
        store_name,
        gift_type,
        business_district_id,
      }
    })
    getList(data)
  }
  const handleFormReset = () => {
    form.resetFields();
    dispatch({type: 'businessGiftList/reset'})
    let data = {
      page: 1,
      is_terrace: 0
    }
    getList(data)
  }

  const handleChange = (e) => {
    console.log(e)
    let page = e.current;
    let data = {
      gift_type: gift_type ? gift_type : undefined,
      gift_name: gift_name ? gift_name : undefined,
      is_terrace: 0,
      business_district_id: business_district_id ? business_district_id : undefined,
      store_name: store_name ? store_name : undefined,
      page,
    }
    dispatch({
      type: 'businessGiftList/setDate',
      payload: {
        page
      }
    })
    getList(data)
  }

  const goto = (id: number) => {
    router.push('/giftManagement/gift-details?id=' + id)
  }


  const giftColumns = [
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
      title: '使用门槛',
      dataIndex: 'use_min_price',
      key: 'use_min_price',
      align: 'center'
    },
    {
      title: '总库存(个)',
      dataIndex: 'total_repertory_num',
      key: 'total_repertory_num',
      align: 'center'
    },
    {
      title: '剩余数量(个)',
      dataIndex: 'total_surplus_num',
      key: 'total_surplus_num',
      align: 'center'
    },
    {
      title: '发放限制(人/个)',
      dataIndex: 'each_num',
      key: 'each_num',
      align: 'center'
    },
    {
      title: '有效期(天)',
      dataIndex: 'validity_day',
      key: 'validity_day',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'index',
      render: (text: any, record: any) => {
        return <a onClick={()=> goto(record.id)}>查看详情</a>
      }
    }
  ]

  return (
    <div>
      <div className={styles.page}>
        <Form layout="inline" onSubmit={onSearch}>
          <Row
            gutter={{
              md: 8,
              lg: 24,
              xl: 48,
            }}
          >
            <Col md={5} sm={20}>
              <FormItem label='礼品名称'>
              {
                getFieldDecorator('gift_name', {initialValue: gift_name})(
                  <Input />
                )
              }

              </FormItem>
            </Col>
            <Col md={5} sm={20}>
              <FormItem label='礼品类型'>
              {
                getFieldDecorator('gift_type', {initialValue: gift_type})(
                  <Select style={{width: 150}} >
                  <Option value={0}>全部</Option>
                  <Option value={1}>现金券</Option>
                  <Option value={2}>商品券</Option>
                </Select>
                )
              }


              </FormItem>
            </Col>
            <Col md={4} sm={20}>
              <FormItem label='商圈'>
              {
                getFieldDecorator('business_district_id', {initialValue: business_district_id})(
                  <Select style={{width: 150}}>
                  {
                    business_list.map(res => {
                      return (
                      <Option value={res.id} key={res.id}>{res.name}</Option>
                      )
                    })
                  }
                </Select>
                )
              }

              </FormItem>
            </Col>
            <Col md={5} sm={20}>
              <FormItem label='商家'>
              {
                getFieldDecorator('store_name', {initialValue: store_name})(
                  <Input/>
                )
              }
              </FormItem>
            </Col>

          </Row>
          <Row>
          <Col md={5} sm={20}>
              <Button type='primary' htmlType="submit" style={{marginRight: 50}}>搜索</Button>
              <Button onClick={handleFormReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <div style={{background: '#fff'}}>
        <Table
          dataSource={gift_list}
          columns={giftColumns}
          onChange={handleChange}
          pagination={{
            current: page,
            defaultPageSize: 15,
            showSizeChanger: false,
            showQuickJumper: false,
            total,
            showTotal: () => {
                return `共${total}条`;
            },
        }}
        />
        </div>

      </div>
    </div>
  )
}


export default Form.create()(
  connect(({ businessGiftList }: any) => ({ businessGiftList }))(
    GiftList
  ))
