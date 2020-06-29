import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal, Divider, notification, message } from 'antd'
import { connect } from "dva";
import { router } from "umi";

const FormItem = Form.Item;
const { confirm } = Modal;

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
        rule: '',

        is_edit_show: false,
        editRule: "",
        dataRecord: {}
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
        const { rule } = this.state
        request.post('/admin/couponDescription', { data: { content: rule, is_show: 1, show_sort: 0 } }).then(res => {
          if (res.data) {
            notification.success({ message: '添加成功' })
            this.setState({ is_show: false })
            const { useKnow, currentPage, currentPageSize } = this.props.useKnowList;
            this.getListData(currentPage, currentPageSize, useKnow);
          }
        })
      }

      handleEditOk = () => {
        const { editRule, dataRecord } = this.state
        request.put(`/admin/couponDescription/${dataRecord.id}`, { data: { content: editRule, is_show: 1, show_sort: 0 } }).then(res => {
          if (res.data) {
            notification.success({ message: '编辑成功' })
            this.setState({ is_edit_show: false, editRule: "" })
            const { useKnow, currentPage, currentPageSize } = this.props.useKnowList;
            this.getListData(currentPage, currentPageSize, useKnow);
          }
        })
      }

      inputChange = (e: any) => {
        const value = e.target.value
        if (value.length <= 50) {
          this.setState({ rule: value })
        }
      }

      inputEditChange = (e: any) => {
        const value = e.target.value
        if (value.length <= 50) {
          this.setState({ editRule: value })
        }
      }

      handleStatus = (record: any) => {
        console.log(record)
        let _this = this;
        let status = record.is_show == 1 ? "禁用" : "启用";
        confirm({
          title: '操作',
          content: `确定要该${status}须知吗?`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            request(`/admin/couponDescription/${record.id}`, {
              method: 'PUT',
              data: {
                content: record.content,
                is_show: record.is_show == 1 ? 0 : 1,
                show_sort: record.show_sort
              }
            }).then(res => {
              message.success('操作成功');
              const { useKnow, currentPage, currentPageSize } = _this.props.useKnowList;
              _this.getListData(currentPage, currentPageSize, useKnow);
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }


      handleEdit = (record: any) => {
        this.setState({ is_edit_show: true, dataRecord: record })
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
                <a onClick={this.handleStatus.bind(this, record)}>{record.is_show == 1 ? "禁用" : "启用"}</a>
                <Divider type="vertical" />
                <a onClick={this.handleEdit.bind(this, record)}>编辑</a>
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
              onCancel={() => this.setState({ is_show: false })}
            >
              <Input placeholder='最多50字' value={this.state.rule} onChange={this.inputChange} />
            </Modal>

            <Modal
              title="编辑使用须知"
              visible={this.state.is_edit_show}
              onOk={this.handleEditOk}
              onCancel={() => this.setState({ is_edit_show: false })}
            >
              <Input placeholder='最多50字' value={this.state.editRule} onChange={this.inputEditChange} />
            </Modal>
          </div >
        )
      }
    }
  )
)
