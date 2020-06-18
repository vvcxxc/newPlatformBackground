import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal } from 'antd'
import { connect } from "dva";
import { router } from "umi";

const FormItem = Form.Item;

interface Props {
  form: any;
  dispatch: (opt: any) => any;
  shopCategoryList: any;
}

export default Form.create()(
  connect(({ shopCategoryList }: any) => ({ shopCategoryList }))(
    class shopCategoryList extends Component<Props>{

      state = {
        dataList: [],
        loading: false,
        total: 10,
      }


      onSearch = async (e: any) => {
        e.preventDefault();
        let categoryName = this.props.form.getFieldValue('categoryName');
        await this.props.dispatch({
          type: 'shopCategoryList/setSearchState',
          payload: {
            categoryName,
          },
        });
        // const { currentPage, currentPageSize } = this.props.shopCategoryList;
        console.log(this.props)
      }

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'shopCategoryList/resetFussySearch',
        });
      };

      handleAdd = () => {
        router.push('/shopManagement/add-cate')
      }

      render() {
        const { getFieldDecorator } = this.props.form;
        const { dataList, loading, total } = this.state;
        const { currentPage, currentPageSize, categoryName } = this.props.shopCategoryList;
        const columns = [
          {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 100
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
                    <FormItem label='分类名称'>
                      {getFieldDecorator('categoryName', { initialValue: categoryName })(
                        <Input placeholder="请输入" />,
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
                  <Col>
                    <Button
                      type="primary"
                      style={{
                        marginLeft: 8,
                      }}
                      onClick={this.handleAdd}
                    >
                      添加
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
              // onChange={this.handleChange}
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
          </div>
        )
      }
    }
  )
)
