import React, { Component } from 'react'
import { Button, Input, Table, Icon } from 'antd'
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import styles from './index.less'
let dragingIndex = -1;
interface Props {
  label?: string;
  value: any;
  onChange: (value: any) => any;
}
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

export default class ruleBox extends Component<Props> {
  state = {
    rule: [],
    value: ''
  }
  components = {
    body: {
      row: DragableBodyRow,
    },
  };
  componentWillReceiveProps(next){
    if(next.value != this.props.value){
      let rule = []
      for (let i in next.value){
        let a = {
          name: next.value[i],
          index: i
        }
        rule.push(a)
      }
      this.setState({rule})
    }
  }


   // 拖拽测试
   moveRow = (dragIndex: number, hoverIndex: number) => {
    const { rule } = this.state;
    const dragRow = rule[dragIndex];

    this.setState(
      update(this.state, {
        rule: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      }),this.ruleChange
    );
  };

  // 添加使用规则
  addRules = () => {
    const { value, rule } = this.state;
    if(value.length){
      let a = {
        name: value,
        index: 1,
      };
      rule.push(a);
      this.setState({ rule, value: '' },this.ruleChange);
    }

  };

  // 使用须知删除操作
  deleteItem = (index: number) => {
    let { rule } = this.state;
    let list: Array<any> = [];
    rule.forEach((item, idx) => {
      if (idx != index) {
        list.push(rule[idx]);
      }
    });
    this.setState({ rule: list },this.ruleChange);
  };

  // 返回新数据
  ruleChange = () => {
    const {rule} = this.state;
    let a = []
    for (let i in rule) {
      a.push(rule[i].name);
    }
    this.props.onChange(a)
  }

  addRuleChange = ({ target: { value } }) => {
    console.log(value.length)
    // if(value.length){
      this.setState({ value });
    // }
  }

  render () {
    const { rule, value } = this.state

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
    return (
      <div>
        <div className={styles.layout}>
            <div className={styles.label}>{this.props.label}</div>
            <div className={styles.layout_main}>
              <div className={styles.ruleList}>
                <DndProvider backend={HTML5Backend}>
                  <Table
                    columns={columns}
                    dataSource={rule}
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
                    onChange={this.addRuleChange}
                  />
                  <Button size="default" onClick={this.addRules}>
                    添加
                  </Button>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}