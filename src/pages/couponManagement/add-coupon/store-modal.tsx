import React, { useEffect, useState } from 'react'
import { Modal, Table, Form, Input, Select, Row, Col, Button } from 'antd'
import styles from './index.less'
import {getBusinessList, getStoreList} from './service'
interface Props {
  visible: boolean; // 是否展示
  onChange: (id: number, store: any) =>any;
  onClose: ()=>any;
}

const { Option } = Select;
export default function StoreModal({ visible, onChange, onClose }: Props) {
  const [business_list, setBusinessList] = useState([])
  const [store_list, setStoreList] = useState([])
  const [business_id, setBusinessId] = useState()
  const [name, setName] = useState('')
  const [store_id, setStoreId] = useState(0)
  const [store_select_list, setStoreSelectList] = useState([])


  useEffect(()=>{
    getBusinessList().then(res => {
      if(res.data){
        setBusinessList(res.data)
      }
    })

    getStoreList({page: 1}).then(res => {
      if(res.data){
        setStoreList(res.data)
      }
    })
  }, [])





  const businessChange = (value: any) => {
    setBusinessId(value)
  }

  const inputChange = (e:any) => {
    setName(e.target.value)
  }

  const search = () => {
    getStoreList({store: name, business_district: business_id}).then(res => {
      setStoreList(res.data)
    })
  }

  const reset = () => {
    setName('')
    setBusinessId(undefined)
    getStoreList({page: 1}).then(res => {
      if(res.data){
        setStoreList(res.data)
      }
    })
  }

  const submit = () => {
    if(store_id){
      onChange(store_id,store_select_list)
    }
  }

  const close = () => {
    onClose()
  }

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setStoreId(selectedRows[0].id)
      setStoreSelectList(selectedRows)
    },
    type: 'radio'
  };

  const ownStoreColumns = [
    {
      title: '门店图片',
      dataIndex: 'facade_image',
      key: 'facade_image',
      render: (text: any, record: any) => {
        return <img src={record.facade_image} style={{width: 50, height: 50}} />
      }
    },
    {
      title: '门店名称',
      dataIndex: 'store_name',
      key: 'store_name',
    },
    {
      title: '地址',
      dataIndex: 'detailed_address',
      key: 'detailed_address',
    },
    {
      title: '联系人',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: '联系电话',
      dataIndex: 'contact_phone',
      key: 'contact_phone',
    },
    {
      title: '商圈',
      dataIndex: 'business_district_name',
      key: 'business_district_name',
    },
  ];




  return (
    <div>

      <Modal
        title="选择门店"
        visible={visible}
        onOk={submit}
        onCancel={close}
        // wrapClassName={styles.modal_box}
        width={1000}
      >
        <Form layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={20}>
            <Form.Item label='商家名称'>
              <Input value={name} onChange={inputChange}/>
            </Form.Item>
          </Col>
          <Col md={8} sm={20}>
            <Form.Item label='商圈'>
              <Select style={{width: 200}} onChange={businessChange} value={business_id}>
                {
                  business_list.map((item: any) => {
                  return <Option value={item.id} key={item.id}>{item.name}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col md={8} sm={20}>
            <Button type='primary' style={{marginRight: 30}} onClick={search}>搜索</Button>
            <Button onClick={reset}>重置</Button>
          </Col>

        </Row>
        </Form>
        <Table
          columns={ownStoreColumns}
          dataSource={store_list}
          rowSelection={rowSelection}
        />

      </Modal>
    </div>
  )
}
