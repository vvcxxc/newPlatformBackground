import React, { Component } from 'react';
import styles from './index.less';
import { Typography, Input, Menu, Dropdown, Descriptions, Button, Table, Modal, Select, notification } from 'antd';
import TabList from './tabList';
import request from '@/utils/request';
const { Title } = Typography;
import { router } from 'umi';
const { Option } = Select

import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);



export default class AddJackPot extends Component {
  state = {
    dataSource: [],
    closeVisible: false,
    activityNum: '0',
    name: '',//活动名称
    menuCheck: undefined,//活动类型
    activityCheckid: undefined,
    activityCheckName: undefined,
    activityCheckArea_name: undefined,
    thanksParticipationPercent: '',//奖谢谢参与中奖率
    dailyInventory: '',//每日库存
    getLocation: '',//领取地点
    getAddress: '',//领取地址
    getValidity: '',//有效期
    giftIdGroup: [],
    giftIdPrecent: [],
    activityList: [],
    isFlag: false,
    originData: [],
    area_id: '',
    area_list: []
  };
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  componentDidMount() {
    request.get('/api/v1/pools/ActivityOptions').then(res => {
      if (res.status_code == 200) {
        this.setState({ activityList: res.data })
      } else {
        notification.open({ message: res.message });
      }
    }).catch(err => { console.log(err) })
  }

  handleMenuClick = (type: Number, e: any) => {
    this.setState({ menuCheck: type });
    if(type == 2){
      request.get('/api/common/area').then(res => {
        this.setState({ area_list: res.data });
      });
    }
  };
  handleActiviutyClick = (id: String | Number, Name: String, area_name: String, area_id: string | number,e: any) => {
    this.setState({ activityCheckid: id, activityCheckName: Name, activityCheckArea_name: area_name, area_id });
    request.get('/api/v1/pools/couponNum', {
      method: 'GET',
      params: { id: id },
    }).then(res => {
      if (res.status_code == 200) {
        this.setState({ activityNum: res.num })
      } else {
        notification.open({ message: res.message });
      }
    }).catch(err => { console.log(err) })
  };
  handleOk = () => {
    this.setState({
      closeVisible: false,
      isFlag: true,
      originData: this.state.dataSource
    });
  };
  handleCancel = () => {
    this.setState({
      closeVisible: false
    });
  };
  selectChange = (query: any) => {
    this.setState({
      giftIdGroup: query.selectedRowKeys,
      dataSource: query.returnItemList,
      isFlag: false,
    })
  };

    // 选择商圈
    selectArea = (value: string) => {
      this.setState({ area_id: value });
    };

  // 礼物概率以外的所有输入框里onChange
  inputChange = (type: string) => ({ target: { value } }) => {
    this.setState({ [type]: value });
  }

  // 礼物概率输入框里onChange
  giftChange = (index: Number | String, e: any) => {
    let tempPercent = this.state.giftIdPrecent;
    tempPercent[index] = e.target.value;
    this.setState({ giftIdPrecent: tempPercent })
  }
  sumbit = () => {
    const { name, area_id,menuCheck, activityCheckid, thanksParticipationPercent, dailyInventory, getLocation, getAddress, getValidity, giftIdGroup, giftIdPrecent } = this.state;
    let data;
    console.log(this.state)
    if (this.state.menuCheck == 1) {
      // '线上卡券'
      if (!name || !activityCheckid || !thanksParticipationPercent || !dailyInventory) {
        notification.open({ message: '信息未填写完整或未选择活动' });
        return;
      }
      data = {
        name, type: menuCheck, area_id,recruit_activity_id: activityCheckid, not_win_probability: thanksParticipationPercent, daily_number: dailyInventory,
      }
    } else if (this.state.menuCheck == 2) {


      if (!name || !getLocation || !getAddress || !getValidity) {
        notification.open({ message: '信息未填写完整' });
        return;
      } else if (giftIdGroup.length == 0) {
        notification.open({ message: '未选择奖品' });
        return;
      }
      let sort = [];
      for (let i = 0; i < giftIdGroup.length; i++) {
        if (!giftIdPrecent[i]) {
          notification.open({ message: '中奖率填写有误或未填写完整' });
          return;
        }
        sort[i] = i;
      }
      data = {
        name, type: menuCheck,area_id, object_name: getLocation, address: getAddress, expiry_day: getValidity, number: giftIdGroup.length, prize_id: giftIdGroup, probability: giftIdPrecent, sort
      }
    } else {
      notification.open({ message: '信息未填写完整或未选择活动' });
      return;
    }
    request('/api/v1/pools', {
      method: 'POST',
      data: data,
    }).then(res => {
      if (res.status_code == 201) {
        notification.success({ message: res.message });
        setTimeout(() => {
          router.goBack();
        }, 1500);
      } else {
        notification.open({ message: res.message });
      }
    }).catch(err => { console.log(err) })
  }
  moveRow = (dragIndex: number, hoverIndex: number) => {
    const { dataSource, giftIdPrecent } = this.state;
    let arr: any = [];
    for (let i in dataSource) {
      if (giftIdPrecent[i]) {
        let obj = {
          id: dataSource[i].id,
          precent: giftIdPrecent[i]
        }
        arr.push(obj)
      }
    }
    const dragRow = dataSource[dragIndex];
    let arr1: any = [];
    let arr2: any = [];
    this.setState(
      update(this.state, {
        dataSource: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      }), () => {
        console.log(this.state.dataSource)
        for (let i in this.state.dataSource) {
          for (let j in arr) {
            if (arr[j].id == this.state.dataSource[i].id) {
              arr1[i] = arr[j].precent
              arr2[i] = arr[j].id
            }
          }
        }
        this.setState({ giftIdPrecent: arr1, giftIdGroup: arr2 })
      }
    );
  };
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={this.handleMenuClick.bind(this, 1)}>
          线上卡券
        </Menu.Item>
        <Menu.Item key="2" onClick={this.handleMenuClick.bind(this, 2)}>
          实物奖品
        </Menu.Item>
      </Menu>
    );
    const activiuty = (
      <Menu>
        {
          this.state.activityList.map((item: any, index: any) => {
            return (

              <Menu.Item key={index} onClick={this.handleActiviutyClick.bind(this, item.id, item.name, item.area_name, item.area_id)}>
                {item.name}
              </Menu.Item>
            )
          })
        }
      </Menu>
    );
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '礼品ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '礼品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '中奖率',
        dataIndex: 'percent',
        render: (a, item, index) => (
          <div>
            <Input className={styles.inputBox} placeholder="设置中奖率" onChange={this.giftChange.bind(this, index)} />%
          </div>
        ),
      },
    ];

    const { area_list } = this.state

    return (
      <div className={styles.addJackPot}>
        <Title level={2}>新增活动奖池</Title>
        <div className={styles.addJackPotContent}>
          <Descriptions
            title="奖池配置"
            layout="horizontal"
            column={1}
            size={'small'}
            bordered={true}
          >
            <Descriptions.Item label="设置奖池名称">
              <Input placeholder="请设置奖池名称" onChange={this.inputChange('name')} />
            </Descriptions.Item>
            <Descriptions.Item label="选择奖品类型">
              <Dropdown.Button overlay={menu}>
                {!this.state.menuCheck
                  ? '选择奖品类型'
                  : this.state.menuCheck == 1
                    ? '线上卡券'
                    : '实物奖品'}
              </Dropdown.Button>
            </Descriptions.Item>
            {
              this.state.menuCheck == 1 ? (
                <Descriptions.Item label="选择关联营销活动">
                  <Dropdown.Button overlay={activiuty}>
                    {!this.state.activityCheckName ? '未选择活动' : this.state.activityCheckName}
                  </Dropdown.Button>
                </Descriptions.Item>
              ) : null
            }
            {
              this.state.menuCheck == 1  ? (
                <Descriptions.Item label="所属商圈">{!this.state.activityCheckArea_name ? '未选择活动' : this.state.activityCheckArea_name}</Descriptions.Item>
              ) : null
            }
            {
              this.state.menuCheck == 2 ? (
                <Descriptions.Item label="所属商圈">
                  <Select
                defaultValue="请选择商圈"
                style={{ width: 200 }}
                size="small"
                onChange={this.selectArea}
              >
                {area_list.length
                  ? area_list.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      );
                    })
                  : null}
              </Select>
                </Descriptions.Item>
              ) : null
            }
          </Descriptions>
        </div>
        {
          this.state.menuCheck == 1 ? (
            <div className={styles.addJackPotContent}>
              <Descriptions
                title="奖品子奖池（卡券）"
                layout="horizontal"
                column={1}
                size={'small'}
                bordered={true}
              >
                <Descriptions.Item label="关联活动">
                  {!this.state.activityCheckName ? '未选择活动' : this.state.activityCheckName}
                </Descriptions.Item>
                <Descriptions.Item label="奖品数量">已设置{this.state.activityNum}张 </Descriptions.Item>
                <Descriptions.Item label="谢谢参与中奖率">
                  <Input className={styles.inputBox} placeholder="请设置谢谢参与中奖率" onChange={this.inputChange('thanksParticipationPercent')} />
                </Descriptions.Item>
                <Descriptions.Item label="每日卡券库存">
                  <Input className={styles.inputBox} placeholder="请设置每日卡券库存" onChange={this.inputChange('dailyInventory')} />张
              </Descriptions.Item>
              </Descriptions>
            </div>
          ) : null
        }
        {
          this.state.menuCheck == 2 ? (
            <div className={styles.addJackPotContent}>
              <Descriptions
                title="奖品子奖池（实物）"
                layout="horizontal"
                column={1}
                size={'small'}
                bordered={true}
              >
                <Descriptions.Item label="领取地点">
                  <Input className={styles.inputBox} placeholder="请设置领取地点" onChange={this.inputChange('getLocation')} />
                </Descriptions.Item>
                <Descriptions.Item label="领取地址">
                  <Input placeholder="请设置领取地址" onChange={this.inputChange('getAddress')} />
                </Descriptions.Item>
                <Descriptions.Item label="领取有效期">
                  领券后
                <Input className={styles.inputBox} placeholder="领取有效期" onChange={this.inputChange('getValidity')} />
                  天有效
              </Descriptions.Item>
                <Descriptions.Item label="奖品数量">已选择{this.state.dataSource.length}份</Descriptions.Item>
                <Descriptions.Item label="选择实物">
                  <Button
                    type="link"
                    className={styles.showContentBtn}
                    onClick={() => {
                      this.setState({ closeVisible: true });
                    }}
                  >
                    点击选择奖品
                </Button>
                </Descriptions.Item>
                <Descriptions.Item label="设定奖品中奖率">
                  {
                    this.state.dataSource.length > 0 && this.state.isFlag ? <DndProvider backend={HTML5Backend}>
                      <Table
                        rowKey="id"
                        dataSource={this.state.dataSource}
                        components={this.components}
                        columns={columns}
                        pagination={false}
                        onRow={(record, index) => ({
                          index,
                          moveRow: this.moveRow,
                        })}
                      />
                    </DndProvider>
                      : this.state.originData.length > 0 && !this.state.isFlag ? <DndProvider backend={HTML5Backend}>
                        <Table
                          rowKey="id"
                          dataSource={this.state.originData}
                          components={this.components}
                          columns={columns}
                          pagination={false}
                          onRow={(record, index) => ({
                            index,
                            moveRow: this.moveRow,
                          })}
                        />
                      </DndProvider>
                        : null
                  }
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : null
        }
        <div className={styles.buttonList}>
          <Button type="primary" className={styles.btn} onClick={this.sumbit}>提交 </Button>
          <Button className={styles.btn}>取消</Button>
        </div>

        <Modal
          title="请选择奖池实物奖品"
          visible={this.state.closeVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={'800px'}
        >
          <TabList selectChange={this.selectChange} />
        </Modal>
      </div>
    );
  }
}
