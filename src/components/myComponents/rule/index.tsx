import React, {useEffect, useState} from 'react'
import styles from './index.less'
import {Table, Button, Icon, Modal, Input} from 'antd'
import {getRuleList} from '@/services/rule';
interface Props {
  label?: string;
  onChange: (content: any) => any
}

export default function Rule({label, onChange}: Props) {
  const [list, setList] = useState([]); // 请求到的列表
  const [is_show_select, setShowSelect] = useState(false);
  const [is_show_add, setShowAdd] = useState(false)
  const [select_key, setKey] = useState([])
  const [select_rows, setSelectRows] = useState([])
  const [content, setContent] = useState('');

  const [index, setIndex] = useState(1000); // 自定义须知的下标
  const [rule_list, setRuleList] = useState([]); // onChange传回去的列表
  const [add_list, setAddList] = useState([]); // 自定义添加的列表

  useEffect(()=> {
    getRuleList({}).then((res: any) => {
      if(res.data){
        setList(res.data)
      }
    })
  },[])

  const rule_columns = [
    {
      title: '序号',
      dataIndex: 'index',
    },
    {
      title: '内容',
      dataIndex: 'content',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (text: any, record: any, index: number) => {
        return <Icon type="delete" onClick={()=> handleDelete(record)}/>;
      },
      align: 'center'
    }
  ]
  const columns = [
      {
        title: '内容',
        dataIndex: 'content',
        align: 'center'
      },
  ]
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRows(selectedRows)
      setKey(selectedRowKeys)
    },
    selectedRowKeys: select_key
  };
  const submit = () => {
    let arr: any = []
    for(let i in select_rows){
      arr.push(select_rows[i])
    }
    for(let i in add_list){
      arr.push(add_list[i])
    }
    for(let i in arr){
      arr[i].index = Number(i)+1
    }
    setRuleList(arr)
    onChange(arr)
    close()
  }

  const onAdd = () => {
    let add = [...add_list]
    let list = {
      id: index,
      content,
      is_add: true
    }
    add.push(list)
    setAddList(add)

    let arr: any = []
    for(let i in select_rows){
      arr.push(select_rows[i])
    }
    for(let i in add){
      arr.push(add[i])
    }
    for(let i in arr){
      arr[i].index = Number(i)+1
    }
    setContent('')
    setRuleList(arr)
    onChange(arr)
    close()
  }

  const handleDelete = (item: any) => {
    let arr = rule_list.filter((res: any)=> res.id != item.id)
    if(item.is_add){
      let add = add_list.filter((res: any)=> res.id != item.id)
      setAddList(add)
    }else {
      let select = select_rows.filter((res: any)=> res.id != item.id)

      let index = ''
      for(let i in select_key){
        if(select_rows[i].id == item.id){
          index = i
        }
      }
      let key = select_key.filter((res)=> res != index);
      setKey(key)
      setSelectRows(select)
    }
    for(let i in arr){
      arr[i].index = Number(i)+1
    }
    setRuleList(arr)
  }

  const close = () => {
    setShowSelect(false)
    setShowAdd(false)
  }


  return (
    <div className={styles.rule_box}>
      <div className={styles.title_box}>
        <div>{label}</div>
        <div>
          <Button style={{marginRight: 20}} onClick={()=> setShowSelect(true)}>添加</Button>
          <Button onClick={()=> setShowAdd(true)}>自定义</Button>
        </div>
      </div>
      <div className={styles.rule_list}>
        <Table
          columns={rule_columns}
          dataSource={rule_list}
          pagination={false}
        />
      </div>

      <Modal
        title="选择使用须知"
        visible={is_show_select}
        width={700}
        onOk={submit}
        onCancel={close}
      >
         <Table
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
        />
      </Modal>

      <Modal
        title="自定义使用须知"
        visible={is_show_add}
        width={700}
        onOk={onAdd}
        onCancel={close}
      >
         <Input value={content} onChange={(e)=> setContent(e.target.value)} />
      </Modal>



    </div>
  )
}
