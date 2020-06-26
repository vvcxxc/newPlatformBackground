import React, {useEffect, useState} from 'react'
import styles from './index.less'
import {Table, Button, Icon, Modal} from 'antd'
import {getRuleList} from '@/services/rule';
interface Props {
  label?: string;
}

export default function Rule({label}: Props) {
  const [list, setList] = useState([]); // 请求到的列表
  const [is_show_select, setShowSelect] = useState(true)
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
        return <Icon type="delete" />;
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
      console.log(selectedRows)
    },
  };
  return (
    <div className={styles.rule_box}>
      <div className={styles.title_box}>
        <div>{label}</div>
        <div>
          <Button style={{marginRight: 20}}>添加</Button>
          <Button >自定义</Button>
        </div>
      </div>
      <div className={styles.rule_list}>
        <Table
          columns={rule_columns}
          dataSource={list}
        />
      </div>

      <Modal
        title="选择使用须知"
        visible={is_show_select}
        width={700}
      >
         <Table
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
        />
      </Modal>




    </div>
  )
}
