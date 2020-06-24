import React, { useEffect, useState } from 'react'
import { Modal, Table, Form, Input, Select, Row, Col, Button, Tabs } from 'antd'
import styles from './index.less'
import { getGiftList } from './service'
const { TabPane } = Tabs;

interface Props {
  visible: boolean; // 是否展示
  store: any; // 店铺信息
}

const { Option } = Select;
export default function GiftModal({ visible, store }: Props) {
  const [tab, setTab] = useState(1)
  const [gift_list, setList] = useState([])

  useEffect(() => {
    if (store) {
      getGiftList({ store_id: store.store_id }).then(res => {
        console.log(res)
        setList(res.data)
      })
    }

  }, [store])





  /**
     * 切换Tab
     */
  const handleChangeTabs = (key: number) => {
    console.log(key);
    setTab(key)
  }

  const couponChange = (value: number) => {

  }

  const GiftList = [
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
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log()
    },
    getCheckboxProps: (record: any) => {
      console.log(record,'rec')
      return {
        defaultChecked: record.id == 2 // 配置默认勾选的列
    }
    },
  };

  const list = (
    <div>
      <Form layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={20}>
            <Form.Item label='礼品名称'>
              <Input />
            </Form.Item>
          </Col>
          <Col md={8} sm={20}>
            <Form.Item label='礼品类型'>
              <Select style={{ width: 200 }} onChange={couponChange}>
                <Option value={1}>现金券</Option>
                <Option value={2}>商品券</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={8} sm={20}>
            <Button type='primary' style={{ marginRight: 30 }}>搜索</Button>
            <Button>重置</Button>
          </Col>

        </Row>
      </Form>
      <Table
        columns={GiftList}
        dataSource={gift_list}
        rowSelection={rowSelection}
      />
    </div>
  )

  return (
    <div>
      <Modal
        title="添加礼品"
        visible={visible}
        width={1000}
      >
        <Tabs defaultActiveKey="1" onChange={handleChangeTabs}>
          <TabPane tab="我的礼品" key="1">
            {list}
          </TabPane>
          <TabPane tab="商圈礼品" key="2">
            {list}
          </TabPane>
          <TabPane tab="平台礼品" key="3">
            {list}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}
