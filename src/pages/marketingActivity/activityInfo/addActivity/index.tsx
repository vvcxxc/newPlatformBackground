import React, { Component } from 'react';
import styles from './index.less';
import {
  Input,
  Select,
  DatePicker,
  Upload,
  Icon,
  List,
  Button,
  notification,
  Spin,
  Table,
} from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
let dragingIndex = -1;

const { Option } = Select;
const { RangePicker } = DatePicker;
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import { router } from 'umi';
import request from '@/utils/request';

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

export default class AddActivity extends Component {
  state = {
    imageUrl: '',
    loading: false, // 图片加载
    rules: [], // 规则
    name: '', // 活动名称
    num: 0, // 卡券限制
    brief: '', // 简介
    cover_image: '', // 活动图片
    area_id: '', // 区域id
    start_date: '', // 开始时间
    end_date: '', // 结束时间
    area_list: [], // 商圈
    Loading: true, // 页面loading
    oss_data: {}, // oss参数
    value: '', // 输入的规则
  };

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  componentDidMount() {
    request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
      let { data } = res;
      console.log('data', data);
      this.setState({
        oss_data: {
          policy: data.policy,
          OSSAccessKeyId: data.accessid,
          success_action_status: 200, //让服务端返回200,不然，默认会返回204
          signature: data.signature,
          callback: data.callback,
          host: data.host,
          key: data.dir + this.randomString(32) + '.png',
        },
      });
    });
    request('/api/common/area', { method: 'get' })
      .then(res => {
        this.setState({ area_list: res.data, Loading: false });
      })
      .catch(() => {
        this.setState({ Loading: false });
      });
  }

  // 选择商圈
  selectArea = (value: string) => {
    this.setState({ area_id: value });
  };

  // 选择日期
  selectDate = (time: any) => {
    this.setState({
      start_date: moment(time[0]).format('YYYY-MM-DD'),
      end_date: moment(time[1]).format('YYYY-MM-DD'),
    });
  };

  // 将图片转为base64
  getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  /**随机数 */
  randomString = (len: any) => {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  };

  // 上传图片
  imageChange = (info: any) => {
    console.log(info)
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          cover_image: info.file.response.data.path,
          loading: false,
        }),
      );
    }
  };

  // 使用须知删除操作
  deleteItem = (index: number) => {
    console.log(index);
    let { rules } = this.state;
    let list: Array<any> = [];
    rules.forEach((item, idx) => {
      if (idx != index) {
        list.push(rules[idx]);
      }
    });
    this.setState({ rules: list });
  };

  // 添加使用规则
  addRules = () => {
    const { value, rules } = this.state;
    let a = {
      name: value,
      index: 1,
    };
    rules.push(a);
    this.setState({ rules, value: '' });
  };

  // 输入
  inputChange = (type: string) => ({ target: { value } }) => {

    if(type == 'num'){
      if(value< 0){
        this.setState({ [type]: 0 });
      }else{
        this.setState({ [type]: value });
      }
    }else{
      this.setState({ [type]: value });
    }
  };

  // 发布活动
  submit = () => {
    const { name, num, brief, cover_image, start_date, end_date, rules, area_id } = this.state;
    if (brief.length > 35) {
      notification.error({
        message: '活动简介请不要超过35字',
      });
      return;
    }
    if (name && num && brief && cover_image && start_date && end_date && rules && area_id) {
      let a = [];
      for (let i in rules) {
        a.push(rules[i].name);
      }
      this.setState({ Loading: true });
      request('/api/v1/activity/recruit', {
        method: 'post',
        data: {
          name,
          area_id,
          start_date,
          end_date,
          card_num: num,
          cover_image,
          rules: a,
          introduce: brief,
        },
      })
        .then(res => {
          this.setState({ Loading: false });
          if (res.status_code == 201) {
            notification.success({
              message: res.message,
            });
            router.goBack();
          } else {
            notification.error({
              message: res.message,
            });
          }
        })
        .catch(() => {
          this.setState({ Loading: false });
        });
    } else {
      notification.error({
        message: '请将信息填写完整',
      });
    }
  };

  // 拖拽测试
  moveRow = (dragIndex: number, hoverIndex: number) => {
    const { rules } = this.state;
    const dragRow = rules[dragIndex];

    this.setState(
      update(this.state, {
        rules: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      }),
    );
  };

  render() {
    const columns = [
      {
        title: '规则',
        dataIndex: 'name',
        key: 'name',
        width: '300px',
      },
      {
        title: '操作',
        dataIndex: 'index',
        key: 'index',
        render: (text: any, record: any, index: number) => {
          return <Icon type="delete" onClick={this.deleteItem.bind(this, index)} />;
        },
        width: '10px',
      },
    ];
    const { imageUrl, rules, area_list, Loading, oss_data, value, num } = this.state;
    const uploadButton = (
      <div className={styles.uploadDefault}>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
      <div className={styles.addPage}>
        <Spin spinning={Loading}>
          <div className={styles.header}>配置活动招募设置</div>
          {/* 活动名称 */}
          <div className={styles.add_layout}>
            <div className={styles.title}>设置活动名称</div>
            <Input size="small" style={{ width: '650px' }} onChange={this.inputChange('name')} />
          </div>
          {/* 活动区域 */}
          <div className={styles.add_layout}>
            <div className={styles.title}>设置活动区域</div>
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
          {/* 活动时间 */}
          <div className={styles.add_layout}>
            <div className={styles.title}>活动招募时间</div>
            <RangePicker size="small" onChange={this.selectDate} locale={locale} />
          </div>
          {/* 卡券限制 */}
          <div className={styles.add_layout}>
            <div className={styles.title}>商家卡券限制</div>
            最多
            <Input
              size="small"
              onChange={this.inputChange('num')}
              style={{ width: '100px', margin: '0 5px' }}
              type="number"
              value={num}
            />
            张
          </div>
          {/* 上传图片 */}
          <div className={styles.add_layout}>
            <div className={styles.title}>设置招募图片</div>
            <div style={{ width: '248px', height: '122px' }}>
              <Upload
                style={{ width: '248px', height: '122px' }}
                listType="picture-card"
                showUploadList={false}
                onChange={this.imageChange}
                data={oss_data}
                action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '248px', height: '122px' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </div>
          </div>
          {/* 招募规则 */}
          <div className={styles.add_layout}>
            <div className={styles.title}>设置招募规则</div>
            <div className={styles.ruleList}>
              <DndProvider backend={HTML5Backend}>
                <Table
                  columns={columns}
                  dataSource={rules}
                  components={this.components}
                  pagination={false}
                  size="small"
                  showHeader={false}
                  onRow={(record, index) => ({
                    index,
                    moveRow: this.moveRow,
                  })}
                />
              </DndProvider>
              <div className={styles.addRule}>
                <Input
                  style={{ width: '90%' }}
                  value={value}
                  onChange={this.inputChange('value')}
                />
                <Button size="default" onClick={this.addRules}>
                  添加
                </Button>
              </div>
            </div>
          </div>
          {/* 活动简介 */}
          <div className={styles.add_layout}>
            <div className={styles.title}>输入活动简介</div>
            <Input size="small" style={{ width: '650px' }} onChange={this.inputChange('brief')} />
          </div>
          {/* 按钮 */}
          <div className={styles.Buttons}>
            <Button
              style={{ marginRight: '100px', width: '100px' }}
              type="primary"
              onClick={this.submit}
            >
              发布活动
            </Button>
            <Button
              style={{ marginRight: '40px', width: '100px' }}
              onClick={() => {
                router.goBack();
              }}
            >
              取消
            </Button>
          </div>
        </Spin>
      </div>
    );
  }
}
