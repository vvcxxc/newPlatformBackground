import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal, Divider, notification } from 'antd'
import { connect } from "dva";
import { router } from "umi";

const FormItem = Form.Item;

interface Props {
  form: any;
  dispatch: (opt: any) => any;
  useKnowList: any;
}

export default Form.create()(
  connect(({ useKnowList }: any) => ({ useKnowList }))(
    class useKnowList extends Component<Props>{

      state = {
        dataList: [],
        loading: false,
        total: 10,
        is_show: false,
        rule: ''
      }


      componentDidMount() {
        const { useKnow, currentPage, currentPageSize } = this.props.useKnowList;
        this.getListData(currentPage, currentPageSize, useKnow);
      }


      getListData = (currentPage: any, currentPageSize: any, useKnow: any) => {
        this.setState({
          loading: true,
        });
        request('/admin/couponDescription', {
          method: 'GET',
          params: {
            content: useKnow,
            page: currentPage,
            pre_page: currentPageSize
          }
        }).then(res => {
          this.setState({ dataList: res.data, loading: false, total: res.meta.pagination.total })
        })
      }

      onSearch = async (e: any) => {
        e.preventDefault();
        let useKnow = this.props.form.getFieldValue('useKnow');
        await this.props.dispatch({
          type: 'useKnowList/setSearchState',
          payload: {
            useKnow
          },
        });
        const { currentPage, currentPageSize } = this.props.useKnowList;
        this.getListData(currentPage, currentPageSize, useKnow);
      }

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        await this.props.dispatch({
          type: 'useKnowList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        const { currentPage, currentPageSize } = this.props.useKnowList;
        let useKnow = this.props.form.getFieldValue('useKnow');
        this.getListData(currentPage, currentPageSize, useKnow);
      }

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'useKnowList/resetFussySearch',
        });
      };

      addRule = () => {
        this.setState({ is_show: true })
      }

      handleOk = () => {
        const {rule} = this.state
        request.post('/admin/couponDescription',{data:{content: rule, is_show: 1, show_sort: 0}}).then(res => {
          if(res.data){
            notification.success({message: '添加成功'})
            this.setState({is_show: false})
            const { useKnow, currentPage, currentPageSize } = this.props.useKnowList;
            this.getListData(currentPage, currentPageSize, useKnow);
          }
        })
      }

      inputChange = (e: any) => {
        const value = e.target.value
        if(value.length <= 50){
          this.setState({rule: value})
        }
      }

      render() {
        const { getFieldDecorator } = this.props.form;
        const { dataList, loading, total, is_show } = this.state;
        const { currentPage, currentPageSize, useKnow } = this.props.useKnowList;
        const columns = [
          {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 100
          },
          {
            title: '使用须知',
            dataIndex: 'content',
            key: 'content',
            width: 100
          },
          {
            title: '状态',
            dataIndex: 'is_show',
            key: 'is_show',
            width: 100,
            render: (text: any, record: any) => (
              <span>{record.is_show == 1 ? "启用" : "禁用"}</span>
            )
          },
          {
            title: '操作',
            dataIndex: 'opearation',
            key: 'opearation',
            width: 100,
            render: (text: any, record: any) => (
              <div>
                <a>{record.is_show == 1 ? "禁用" : "启用"}</a>
                <Divider type="vertical" />
                <a>编辑</a>
              </div>
            )
          },
        ]
        return (
          <div>
            <div className={styles.tableListForm}>
              <Form layout="inline" onSubmit={this.onSearch.bind(this)}>
                <Row
                  gutter={{
                    md: 8,
                    lg: 24,
                    xl: 48,
                  }}
                >
                  <Col md={5} sm={20}>
                    <FormItem label='使用须知'>
                      {getFieldDecorator('useKnow', { initialValue: useKnow })(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={5} sm={26}>
                    <Button type="primary" htmlType="submit">
                      查询
                                    </Button>
                    <Button
                      style={{
                        marginLeft: 8,
                      }}
                      onClick={this.handleFormReset}
                    >
                      重置
                                    </Button>

                  </Col>
                  <Col md={5} sm={26}>
                    <Button
                      type="primary"
                      style={{
                        marginLeft: 8,
                      }}
                      onClick={this.addRule}
                    >
                      新增
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>

            <Table
              rowKey="id"
              columns={columns}
              dataSource={dataList}
              loading={loading}
              onChange={this.handleChange}
              pagination={{
                current: currentPage,
                defaultPageSize: currentPageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                total,
                showTotal: () => {
                  return `共${total}条`;
                },
              }}
            />

            <Modal
              title="添加使用须知"
              visible={this.state.is_show}
              onOk={this.handleOk}
              onCancel={()=> this.setState({is_show: false})}
            >
              <Input placeholder='最多50字' value={this.state.rule} onChange={this.inputChange} />
            </Modal>
          </div>
        )
      }
    }
  )
)
