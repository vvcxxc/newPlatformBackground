import React, { Component } from 'react';
import styles from './index.less';
import { Input, DatePicker, Select, Spin, Table, Icon, Button, notification } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
import request from '@/utils/request';
import moment from 'moment';
import { router } from 'umi';
class AddActivity extends Component {
  state = {
    Loading: false, // 页面loading
    area_list: [], // 商圈
    condition: [{}], // 条件数量
    area_id: '', // 商圈id
    card_list: [], // 卡片列表
    start_date: '', // 开始时间
    end_date: '', // 结束时间
    name: '', // 活动名字
    condition_money: '', // 条件时间
    daily_card: '', // 每天派卡限制
    luck_draw: [], // 抽奖条件
    have_access: [[],[]], // 奖池
  };
  componentDidMount() {
    request.get('/api/common/area').then(res => {
      this.setState({ area_list: res.data });
    });
    this.getCard();
  }

  // 获取奖池和抽奖条件
  getCondition = (area_id: any) => {
    request
      .get('/api/v1/activity/cardcollecting/luckyDrawCondition', {
        params: {
          area_id,
        },
      })
      .then(res => {
        this.setState({ luck_draw: res.data.luck_draw });
      });
  };

  // 获取卡片
  getCard = () => {
    request.get('/api/v1/activity/cardcollecting/activityCard').then(res => {
      this.setState({ card_list: res.data });
    });
  };

  addCondition = () => {
    const { condition } = this.state;
    if (condition.length <= 1) {
      this.setState({ condition: [...condition, {}] });
    }
  };

  // 抽奖条件的选择
  selectItem = (type: string, index: number) => (value: any) => {
    const { condition, area_id } = this.state;
    condition[index][type] = value;
    this.setState({ condition });
    if(type == 'condition'){
      this.getJackpot(area_id, value, index)
    }
  };

  // input输出
  inputChange = (type: string) => ({ target: { value } }) => {
    let money = /^\d*(\.?\d{0,2})/g;//金额限制
    switch (type) {
      case 'condition_money':
        this.setState({ [type]: value.match(money)[0] });
        break;

      default:
        this.setState({ [type]: value });
        break;
    }

  };

  // 选择日期
  selectDate = (time: any) => {
    this.setState({
      start_date: moment(time[0]).format('YYYY-MM-DD'),
      end_date: moment(time[1]).format('YYYY-MM-DD'),
    });
  };
  // 选择商圈
  selectArea = (value: string) => {
    this.setState({ area_id: value });
    this.getCondition(value)
  };

  // 获取抽奖条件的奖池
  getJackpot = (area_id: string,card_type: string, index: number) => {
    console.log(area_id,card_type,index)
    let { have_access } = this.state
    request
    .get('/api/v1/activity/cardcollecting/luckyDrawCondition', {
      params: {
        area_id,
        card_type
      },
    })
    .then(res => {
      if(index == 0){
        have_access[0] = res.data.have_access
      }else{
        have_access[1] = res.data.have_access
      }
      this.setState({have_access})
    });

  }

  submit = () => {
    const {
      name,
      card_list,
      condition_money,
      start_date,
      end_date,
      area_id,
      daily_card,
      condition,
    } = this.state;

    let card_info = [];
    if (card_list.length) {
      for (let i in card_list) {
        card_info.push(card_list[i].id);
      }
    }

    if (condition_money && Number(condition_money) <= 0 || !condition_money) {
      notification.error({
        message: '派发条件须大于0元',
      });
      return;
    }
    if (daily_card && Number(daily_card) <= 0 || !daily_card ) {
      notification.error({
        message: '派卡限制须大于0元',
      });
      return;
    }
    if (Object.keys(condition[0]).length <= 1) {
      notification.error({
        message: '请选择抽奖条件',
      });
      return;
    }
    if (condition.length > 1) {
      if(Object.keys(condition[0]).length <= 1 || Object.keys(condition[0]).length <= 1){
        notification.error({
          message: '请选择抽奖条件',
        });
        return;
      }
      if (condition[0].condition == condition[1].condition) {
        notification.error({
          message: '抽奖条件不能相同',
        });
        return;
      }
      if (condition[0].jackpot == condition[1].jackpot) {
        notification.error({
          message: '奖池不能相同',
        });
        return;
      }
    }
    if (name && condition_money && start_date && end_date && area_id && daily_card && condition) {
      request
        .post('/api/v1/activity/cardcollecting', {
          data: {
            name,
            start_date,
            end_date,
            area_id,
            condition_money,
            daily_card,
            card_info: JSON.stringify(card_info),
            factor: JSON.stringify(condition),
          },
        })
        .then(res => {
          if(res.status_code == 201){
            notification.success({
              message: res.message
            })
            router.goBack()
          }else{
            notification.error({
              message: res.message
            })
          }
        });
    } else {
      notification.error({
        message: '请填写完整',
      });
    }
  };

  render() {
    const {
      Loading,
      area_list,
      condition,
      card_list,
      have_access,
      luck_draw,
      area_id,
      condition_money
    } = this.state;
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '选择卡片',
        dataIndex: 'name',
        key: 'name',
        // render: (text, record: any) => (
        //   <span>
        //     <Select defaultValue='请选择卡片' style={{ width: 150 }}>
        //       {/* <Option value='1'>1</Option> */}
        //       {
        //         record.card.length ? record.card.map((item: any, index: number) => {
        //           return <Option value={item} key={index}>{item}</Option>
        //         }) : null
        //       }
        //     </Select>
        //   </span>
        // )
      },
      {
        title: '卡片编号',
        dataIndex: 'number',
        key: 'number',
      },
    ];
    // 抽奖条件
    const conditionList = condition.map((item, index) => {
      return (
        <div key={index}>
          <div className={styles.title}>
            设置抽奖条件{index + 1}
            {index ? <Icon type="close-circle" onClick={
              () => {
              let meta = this.state.condition
                meta.length = meta.length-1
                this.setState({ condition: meta})
            }} /> : null}
          </div>
          <div className={styles.condition}>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>抽奖条件</div>
              <Select
                defaultValue="请选择抽奖条件"
                style={{ width: 200 }}
                size="small"
                onChange={this.selectItem('condition', index)}
              >
                {luck_draw.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>奖池设定</div>
              <Select
                defaultValue="请选择奖池"
                style={{ width: 200 }}
                size="small"
                onChange={this.selectItem('jackpot', index)}
              >
                {have_access.length ? have_access[index].map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                }) : null}
              </Select>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className={styles.page}>
        <Spin spinning={Loading}>
          <div className={styles.header}>集卡抽奖</div>

          <div className={styles.main}>
            <div className={styles.title}>配置活动基本信息</div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>设置活动名称</div>
              <Input size="small" style={{ width: '390px' }} onChange={this.inputChange('name')} />
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>设置活动时间</div>
              <RangePicker size="small" onChange={this.selectDate} />
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>选择活动区域</div>
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
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>派发条件</div>
              满
              <Input
                size="small"
                value={condition_money}
                style={{ width: '110px', marginLeft: '5px', marginRight: '5px' }}
                onChange={this.inputChange('condition_money')}
              />
              元
            </div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>派卡限制</div>
              <Input
                size="small"
                style={{ width: '110px', marginRight: '5px' }}
                onChange={this.inputChange('daily_card')}
              />
              张/天
            </div>
          </div>

          <div className={styles.main}>
            <div className={styles.title}>配置活动卡片信息</div>
            <div className={styles.item_layout}>
              <div className={styles.item_title}>设置卡数量</div>
              {/* <Select defaultValue="请选择卡片数量" style={{ width: 200 }} size="small">
                <Option value="1">1</Option>
              </Select> */}
              <div>{card_list.length}</div>
            </div>
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <Table
                pagination={false}
                columns={columns}
                dataSource={card_list}
                style={{ width: '510px' }}
                size="small"
              />
            </div>

            {/* 抽奖条件 */}
            {area_id ? (
              <div>
                {conditionList}
                <div className={styles.addCondition} onClick={this.addCondition}>
                  <Icon
                    type="plus-circle"
                    theme="filled"
                    style={{ paddingRight: 5, fontSize: 18 }}
                  />
                  添加抽奖条件
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 10 }}>
            <Button type="primary" style={{ marginRight: 30 }} onClick={this.submit}>
              发布活动
            </Button>
            <Button type="danger" onClick={()=>{router.goBack()}}>取消</Button>
          </div>
        </Spin>
      </div>
    );
  }
}

export default AddActivity;
