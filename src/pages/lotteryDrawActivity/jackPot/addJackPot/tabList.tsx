import React, { Component } from 'react';
import { Table, notification } from 'antd';
import request from '@/utils/request';
import { router } from 'umi';
interface Props {
  selectChange?: any;
}
export default class TabList extends Component<Props> {
  state = {
    loading: false,
    page: 1,
    giftList: [],
    pagination: {
      count: 0,
      current_page: 1,
      total: 0,
      total_pages: 0
    },
    haveReadPageItem: [],
    returnItemList: []
  };
  componentDidMount() {
    this.getData(1, 10);
  }
  getData = (page: Number, count: Number) => {
    this.setState({ loading: true });
    let url = "/api/v1/pools/ActivityPrizes";
    request(url, {
      method: 'get',
      params: { page, count },
    })
      .then(res => {
        this.setState({ loading: false });
        if (res.status_code == 200) {
          this.setState({ giftList: res.data, pagination: res.pagination, page: page })
        } else {
          notification.open({ message: res.message });
        }
      })
      .catch(err => { this.setState({ loading: false }); });
  }
  changePage = (selectedRowKeys: any, selectedRows: any) => {
    this.getData(selectedRowKeys.current, selectedRowKeys.pageSize);
  }


  render() {
    const columns = [
      // {
      //   title: '编号',
      //   dataIndex: 'id',
      //   align: 'center'
      // },
      {
        title: '礼品id',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
      },
      {
        title: '礼品名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '礼品库存',
        dataIndex: 'stock',
        key: 'stock',
        align: 'center'
      },
      {
        title: '商品价值',
        dataIndex: 'market_price',
        key: 'market_price',
        align: 'center',
        render: (text: Number | String) => <div>{text}元</div>,
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        let haveReadPageItem: any = this.state.haveReadPageItem;
        haveReadPageItem[this.state.page] = selectedRows;
        let returnItemList: any = [];

        for (let i = 1; i < haveReadPageItem.length; i++) {
          for (let j = 0; j < haveReadPageItem[i].length; j++) {
            returnItemList.push(haveReadPageItem[i][j])
          }
        }
        this.setState({ haveReadPageItem: haveReadPageItem, returnItemList: returnItemList })
        let query = { selectedRowKeys, returnItemList }
        this.props.selectChange && this.props.selectChange(query)
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };


    return (
      <Table
        rowSelection={rowSelection}
        rowKey="id"
        columns={columns}
        loading={this.state.loading}
        dataSource={this.state.giftList}
        onChange={this.changePage}
        pagination={{
          total: this.state.pagination.total, //总条数
          showTotal: () => {
            return `共${this.state.pagination.total}条`; //总条数
          },
        }}
      />
    );
  }
}
