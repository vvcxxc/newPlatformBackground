import React, { useEffect, useState } from 'react'
import { Modal, Table, Form, Input, Select, Row, Col, Button, Tabs } from 'antd'
import styles from './index.less'
import { getGiftList } from './service'
import { stubArray } from 'lodash';
const { TabPane } = Tabs;

interface Props {
  visible: boolean; // 是否展示
  store: any; // 店铺信息
  onChange: (id: any, list: any) => any;
  onClose: ()=>any;
}

const { Option } = Select;
export default function GiftModal({ visible, store, onChange, onClose }: Props) {
  const [tab, setTab] = useState(1);
  const [gift_list, setList] = useState([]); // 礼品列表
  const [gift_id, setGiftId] = useState([]); // 礼品id列表
  const [gift_selected_list, setGiftSelectList] = useState([[],[],[]]);
  const [select_key, setKey] = useState([[], [], []]); // 三个tab table的key
  const [gift_type, setType] = useState(null); // 优惠券类型
  const [name, setName] = useState(''); // 名字
  const [params, setParams] = useState({is_terrace: 0}); // 请求参数
  const [gift_ids, setIds] = useState([[], [], []]); // 三个table的id

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState()

  useEffect(() => {
    if (store) {
      getGiftList({ store_id: store.id, is_terrace: 0, per_page: 2 }).then(res => {
        setList(res.data)
        setTotal(res.meta.pagination.total)
      })
    }

  }, [store])





  /**
     * 切换Tab
     */
  const handleChangeTabs = (key: number) => {
    setTab(key)
    setKey([[], [], []])
    let params = {}
    setName('')
    setType(null)
    setList([])
    setPage(1)
    if (key == 1) { // 获取我的礼品
      params = { store_id: store.id, is_terrace: 0 }
    } else if (key == 2) { // 获取商圈礼品
      params = { business_district_id: store.business_district_id, is_terrace: 0, store_id: store.id  }
    } else if (key == 3) {
      params = { is_terrace: 1 }
    }
    setParams(params)
    getGiftList(params).then(res => {
      setList(res.data)
      setTotal(res.meta.pagination.total)
    })
  }

  const couponChange = (value: number) => {
    setType(value)
  }

  const inputChange = (e: any) => {
    setName(e.target.value)
  }

  const search = () => {
    let data: any = { ...params }
    if (name || gift_type) {
      data.gift_name = name ? name : undefined;
      data.gift_type = gift_type ? gift_type : undefined;
      getGiftList(data).then(res => {
        setList(res.data)
        setTotal(res.meta.pagination.total)
      })
    }

  }

  const reset = () => {
    let params = {}
    setName('')
    setType(null)
    setKey([[], [], []])
    setGiftId([])
    setGiftSelectList([])
    if (tab == 1) { // 获取我的礼品
      params = { store_id: store.id, is_terrace: 0 }
    } else if (tab == 2) { // 获取商圈礼品
      params = { business_district_id: store.business_district_id, is_terrace: 0, store_id: store.id }
    } else if (tab == 3) {
      params = { is_terrace: 1 }
    }
    setParams(params)
    getGiftList(params).then(res => {
      setList(res.data)
      setTotal(res.meta.pagination.total)
    })
  }

  const submit = () => {
    let id = [...gift_ids[0],...gift_ids[1], ...gift_ids[2]]
    let list = [...gift_selected_list[0], ...gift_selected_list[1], ...gift_selected_list[2]]
    onChange(id,list)
  }


  const pageChange = (pagination: any) => {
    let {current } = pagination
    setPage(current)
    let params = {...params}
    if (tab == 1) { // 获取我的礼品
      params = { store_id: store.id, is_terrace: 0 }
    } else if (tab == 2) { // 获取商圈礼品
      params = { business_district_id: store.business_district_id, is_terrace: 0, store_id: store.id  }
    } else if (tab == 3) {
      params = { is_terrace: 1 }
    }
    params.page = current
    params.per_page = 2
    setKey([[],[],[]])
    setList([])
    getGiftList(params).then(res => {

      let list_gift = res.data
      let ids = gift_ids[tab-1]
      let arr:any = [];
      let key = [...select_key]
      for( let i in list_gift){
        for( let a in ids ){
          console.log(list_gift[i])
          if(list_gift[i].id == ids[a]){
            arr.push(i)
          }
        }
      }
      key[tab-1] = arr
      console.log(key)
      setKey(key)
      //  设置keys
      setTotal(res.meta.pagination.total)
      setList(res.data)
    })
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
      console.log(selectedRowKeys,'keys')
      if (selectedRows.length) {

        let id: any = [];
        let key = JSON.parse(JSON.stringify(select_key));
        let ids = JSON.parse(JSON.stringify(gift_ids));
        let select_list = JSON.parse(JSON.stringify(gift_selected_list));
        for (let i in selectedRows) {
          id.push(selectedRows[i].id)
          select_list[tab - 1].push(selectedRows[i])
        }
        setGiftSelectList(select_list)
        key[tab - 1] = selectedRowKeys
        setKey(key)
        ids[tab-1] = [...ids[tab-1],...id];
        setIds(ids)
      }
    },
    onSelect: (record: any, selected: boolean,) => {
      if(!selected){
        let ids: any = JSON.parse(JSON.stringify([...gift_ids]))
        let key: any = JSON.parse(JSON.stringify([...select_key]))
        let select_list = JSON.parse(JSON.stringify(gift_selected_list));
        ids[tab-1] = ids[tab-1].filter((res: any) => res != record.id)
        for(let i in gift_list){
          if(gift_list[i].id == record.id){
             key[tab-1] = key[tab-1].filter((res: any) => res != i)
          }
        }
        select_list = select_list.filter((res: any) => res.id != record.id)
        setKey(key)
        setIds(ids)
        setGiftSelectList(select_list)
        console.log(ids,key,record)
      }
    },
    onSelectAll: (selected: any, record: boolean,) => {
      if(!selected){
        let ids: any = JSON.parse(JSON.stringify([...gift_ids]))
        let key: any = JSON.parse(JSON.stringify([...select_key]));
        let select_list = JSON.parse(JSON.stringify(gift_selected_list));
        key[tab - 1] = []
        for(let i in gift_list){
          ids[tab-1] = ids[tab-1].filter((res: any) => res != gift_list[i].id)
          select_list[tab-1] = select_list[tab-1].filter((res: any) => res.id != gift_list[i].id)
        }
        setGiftSelectList(select_list)
        setKey(key)
        setIds(ids)
      }
    },
    getCheckboxProps: async (record: any) => {
      let key: any = select_key
      // console.log(gift_ids,record)
      for (let i in gift_list) {
        if (gift_ids[tab - 1].includes(gift_list[i].id)) {
          key[tab - 1].push(Number(i))
        }
      }
      let key1 = new Set([...key[tab - 1]])
      key[tab - 1] = [...key1]
      await setKey(key)
    },
    selectedRowKeys: tab == 1 ? select_key[0] : tab == 2 ? select_key[1] : tab == 3 ? select_key[2] : []
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
              <Input value={name} onChange={inputChange} />
            </Form.Item>
          </Col>
          <Col md={8} sm={20}>
            <Form.Item label='礼品类型'>
              <Select style={{ width: 200 }} onChange={couponChange} value={gift_type}>
                <Option value={1}>现金券</Option>
                <Option value={2}>商品券</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={8} sm={20}>
            <Button type='primary' style={{ marginRight: 30 }} onClick={search}>搜索</Button>
            <Button onClick={reset}>重置</Button>
          </Col>

        </Row>
      </Form>
      {
        gift_list.length ? (
        <Table
          columns={GiftList}
          dataSource={gift_list}
          rowSelection={rowSelection}
          onChange={pageChange}
          pagination={{
            current: page,
            pageSize: 2,
            total,
            showTotal: () => {
              return `共${total}条`;
            },
          }}
        />
        ) : null
      }

    </div>
  )

  return (
    <div>
      <Modal
        title="添加礼品"
        visible={visible}
        width={1000}
        onOk={submit}
        onCancel={()=> onClose()}
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
