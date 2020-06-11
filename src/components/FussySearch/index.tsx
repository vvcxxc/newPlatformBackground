import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  ID: any;
  activityName: any;
  storeName: any;
  status: any;
  expandForm: Boolean;
  handleSearch: () => void;
  handleFormReset: () => void;
  toggleForm: () => void;
}

export default Form.create()(
  connect(({ cardManage }: any) => cardManage)(
    class FussySearch extends Component<Props> {
      handleSearch = async (e: any) => {
        let ID = this.props.form.getFieldValue('ID');
        let storeName = this.props.form.getFieldValue('storeName');
        let activityName = this.props.form.getFieldValue('activityName');
        let status = this.props.form.getFieldValue('status');
        e.preventDefault();
        await this.props.dispatch({
          type: 'cardManage/setFussyForm',
          payload: {
            ID,
            storeName,
            activityName,
            status,
          },
        });
        this.props.handleSearch && this.props.handleSearch();
      };
      handleFormReset = async () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'cardManage/resetFussySearch',
        });
        this.props.handleFormReset && this.props.handleFormReset();
      };
      toggleForm = async () => {
        await this.props.dispatch({
          type: 'cardManage/switchExpandForm',
        });
        this.props.toggleForm && this.props.toggleForm();
      };

      renderForm() {
        const { expandForm } = this.props;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
      }

      renderAdvancedForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { ID, activityName, storeName, status } = this.props;
        return (
          <Form onSubmit={this.handleSearch.bind(this)} layout="inline" ref="fussy_search_form">
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="ID">
                  {getFieldDecorator('ID', { initialValue: ID })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="活动名称">
                  {getFieldDecorator('activityName', { initialValue: activityName })(
                    <Input placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row
              gutter={{
                md: 8,
                lg: 24,
                xl: 48,
              }}
            >
              <Col md={8} sm={24}>
                <FormItem label="商圈名称">
                  {getFieldDecorator('storeName', { initialValue: storeName })(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="0">关闭</Option>
                      <Option value="1">运行中</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="活动状态">
                  {getFieldDecorator('status', { initialValue: status })(
                    <Select
                      placeholder="请选择"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="0">关闭</Option>
                      <Option value="1">运行中</Option>
                    </Select>,
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
                  <a
                    style={{
                      marginLeft: 8,
                    }}
                    onClick={this.toggleForm}
                  >
                    收起 <Icon type="up" />
                  </a>
                </span>
              </Col>
            </Row>
          </Form>
        );
      }

      renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const { ID, activityName } = this.props;
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
                <FormItem label="ID">
                  {getFieldDecorator('ID', { initialValue: ID })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="活动名称">
                  {getFieldDecorator('activityName', { initialValue: activityName })(
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
                  <a
                    style={{
                      marginLeft: 8,
                    }}
                    onClick={this.toggleForm}
                  >
                    展开 <Icon type="down" />
                  </a>
                </span>
              </Col>
            </Row>
          </Form>
        );
      }

      render() {
        return <div className={styles.tableListForm}>{this.renderForm()}</div>;
      }
    },
  ),
);
