import React, { Component } from 'react';
import {
  Table,
  Button,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Select,
  ConfigProvider,
  Divider,
  notification,
  Modal,
} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'dva';
import styles from './index.less';
import router from 'umi/router';
import request from '@/utils/request';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  form: any;
  dispatch: (opt: any) => any;
  cardList: any;
}

export default Form.create()(
  connect(({ cardList }: any) => ({ cardList }))(
    class CardList extends Component<Props> {
      state = {
        dataList: [],
        loading: false,
        total: 0,
      };

      componentDidMount() {
        // console.log(this.props);
        const {
          cardName,
          cardNumber,
          currentPage,
          currentPageSize,
        } = this.props.cardList;
        this.getListData(cardName, cardNumber, currentPage, currentPageSize);
      }

      handleSearch = async (e: any) => {
        // let activityStatus = this.props.form.getFieldValue('activityStatus');
        let cardNumber = this.props.form.getFieldValue('cardNumber');
        let cardName = this.props.form.getFieldValue('cardName');
        e.preventDefault();
        await this.props.dispatch({
          type: 'cardList/setFussyForm',
          payload: {
            cardNumber,
            cardName,
          },
        });

        const { currentPage, currentPageSize } = this.props.cardList;
        this.getListData(cardName, cardNumber, currentPage, currentPageSize);

        // this.getListData(activityName, activityStatus, status, currentPage, currentPageSize);
      };

      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'cardList/resetFussySearch',
        });
      };

      renderForm() {
        return this.renderSimpleForm();
      }

      renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { cardName, cardNumber } = this.props.cardList;
        return (
          <Form onSubmit={this.handleSearch.bind(this)} layout="inline">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="卡片名称">
                  {getFieldDecorator('cardName', { initialValue: cardName })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              {/* <Col md={8} sm={24}>
                <FormItem label="活动状态">
                  {getFieldDecorator('activityStatus', { initialValue: activityStatus })(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="0">未生效</Option>
                      <Option value="1">招募中</Option>
                      <Option value="2">已结束</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col> */}
              <Col md={8} sm={24}>
                <FormItem label="卡片编号">
                  {getFieldDecorator('cardNumber', { initialValue: cardNumber })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
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
                </span>
              </Col>
            </Row>
          </Form>
        );
      }

      getListData = (cardName: string, cardNumber: string, currentPage: any, currentPageSize: any) => {
        this.setState({
          loading: true,
        });
        request('/api/v1/activity/cardcollecting/activityCard', {
          method: 'GET',
          params: {
            name: cardName,
            number: cardNumber
          }
        }).then(res => {
          this.setState({
            dataList: res.data,
            loading: false,
            // total: res.pagination.total,
          })
        })
      }

      addCard = () => {

      }

      handleChange = async (pagination: any, filters: any, sorter: any) => {
        await this.props.dispatch({
          type: 'cardList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });
        const { currentPage, currentPageSize } = this.props.cardList;
        let cardName = this.props.form.getFieldValue('cardName');
        // let activityStatus = this.props.form.getFieldValue('activityStatus');
        let cardNumber = this.props.form.getFieldValue('cardNumber');
        this.getListData(cardName, cardNumber, currentPage, currentPageSize);
        // this.getListData(activityName, storeName, status, currentPage, currentPageSize);
      };

      render() {
        const { dataList, loading, total } = this.state;
        const { currentPage, currentPageSize } = this.props.cardList;
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '卡片名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '卡片编号',
            dataIndex: 'number',
            key: 'number',
          },
        ]
        return (
          <div>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/* <Button
              type="primary"
              icon="plus"
              className={styles.addCard}
              onClick={this.addCard}
            >
              添加活动卡片
            </Button> */}
            <Table
              rowKey="id"
              columns={columns}
              dataSource={dataList}
              loading={loading}
              onChange={this.handleChange}
              pagination={false}
            // pagination={{
            //   current: currentPage,
            //   defaultPageSize: currentPageSize,
            //   showSizeChanger: true,
            //   showQuickJumper: true,
            //   total,
            //   showTotal: () => {
            //     return `共${total}条`;
            //   },
            // }}
            />
          </div>
        );
      }
    },
  ),
);
