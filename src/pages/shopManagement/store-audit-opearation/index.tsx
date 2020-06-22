import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Card, Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal, Radio, Checkbox } from 'antd'
import { connect } from "dva";
import { router } from "umi";

const { Option } = Select;

export default class storeAuditOpearation extends Component {

    state = {
        storeName: "",
        storeAddress: "",
        detailAddress: "",
        storeNum: "",
        storeTel: "",
        storeEmail: "",
        bussinessType: "",
        storeImg: "",
        environmental_photo: [],
        bussinessImg: "",
        registerNum: "",
        licenseName: "",
        legalPersonName: "",
        validity: "",
        identity_card_positive_image: "",
        identity_card_opposite_image: "",
        identity_card_handheld_image: "",
        IDName: "",
        IDNum: "",
        IDValidity: "",
        isDefault: null,

        storeMsgFail: false,
        licenseMsgFail: false,
        IDMsgFail: false,

        bussinessDatas: []
    }

    handleChangeIsDefault = (e) => {
        this.setState({
            isDefault: e.target.value,
            storeMsgFail: false,
            licenseMsgFail: false,
            IDMsgFail: false,
        })
    }

    componentDidMount() {

        request('/admin/business', {
            method: 'GET',
            params: {
                pre_page: 9999
            }
        }).then(res => {
            this.setState({
                bussinessDatas: res.data
            })
        })

        const id = this.props.location.query.id;
        request(`/admin/store/examines/${id}`, {
            method: 'GET',
        }).then(res => {
            this.setState({
                storeName: res.data.store_name,
                storeAddress: res.data.store_address,
                detailAddress: res.data.store_address_info,
                storeTel: res.data.store_telephone,
                storeEmail: res.data.email,
                bussinessType: res.data.category_id,
                storeImg: res.data.door_photo,
                environmental_photo: res.data.environmental_photo,
                bussinessImg: res.data.business_license_photo,
                registerNum: res.data.registration_number,
                licenseName: res.data.license_name,
                legalPersonName: res.data.legal_person_name,
                validity: res.data.license_valid_until,
                identity_card_positive_image: res.data.identity_card_positive_image,
                identity_card_opposite_image: res.data.identity_card_opposite_image,
                identity_card_handheld_image: res.data.identity_card_handheld_image,
                IDName: res.data.identity_name,
                IDNum: res.data.identity_card,
                IDValidity: res.data.identity_card_valid_until
            })
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
        };
        const {
            storeName,
            storeAddress,
            detailAddress,
            storeNum,
            storeTel,
            storeEmail,
            bussinessType,
            storeImg,
            environmental_photo,
            bussinessImg,
            registerNum,
            licenseName,
            legalPersonName,
            validity,
            identity_card_positive_image,
            identity_card_opposite_image,
            identity_card_handheld_image,
            IDName,
            IDNum,
            IDValidity,
            isDefault,
            storeMsgFail,
            licenseMsgFail,
            IDMsgFail,
            bussinessDatas
        } = this.state;
        return (
            <div>
                <Card title="门店信息" bordered={false} style={{ width: "100%" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="门店名称">
                            <Input value={storeName} readOnly />
                        </Form.Item>
                        <Form.Item label="门店地址">
                            <Input value={storeAddress} readOnly />
                        </Form.Item>
                        <Form.Item label="详细地址">
                            <Input value={detailAddress} readOnly />
                        </Form.Item>
                        {/* <Form.Item label="门牌号">
                            <Input value={storeNum} readOnly />
                        </Form.Item> */}
                        <Form.Item label="门店电话">
                            <Input value={storeTel} readOnly />
                        </Form.Item>
                        <Form.Item label="邮箱">
                            <Input value={storeEmail} readOnly />
                        </Form.Item>
                        <Form.Item label="经营品类">
                            <Input value={bussinessType} readOnly />
                        </Form.Item>
                        <Form.Item label="门头图片">
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + storeImg} width="150px" height="150px" />
                        </Form.Item>
                        <Form.Item label="环境照" wrapperCol={
                            {
                                xs: { span: 8 },
                                sm: { span: 8 },
                            }
                        }>
                            {
                                environmental_photo.map(item => (
                                    <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + item} alt="" width="150" height="150" style={{ marginRight: 10 }} />
                                ))
                            }
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="营业执照备案" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="营业执照" wrapperCol={
                            {
                                xs: { span: 6 },
                                sm: { span: 6 },
                            }
                        }>
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + bussinessImg} width="350px" height="180px" />
                        </Form.Item>
                        <Form.Item label="注册号">
                            <Input value={registerNum} readOnly />
                        </Form.Item>
                        <Form.Item label="执照名称">
                            <Input value={licenseName} readOnly />
                        </Form.Item>
                        <Form.Item label="法人姓名">
                            <Input value={legalPersonName} readOnly />
                        </Form.Item>
                        <Form.Item label="有效期">
                            <Input value={validity} readOnly />
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="法人身份证信息" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="身份证照片" wrapperCol={
                            {
                                xs: { span: 8 },
                                sm: { span: 8 },
                            }
                        }>
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_positive_image} width="150px" height="150px" style={{ marginRight: '10px' }} />
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_opposite_image} width="150px" height="150px" style={{ marginRight: '10px' }} />
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_handheld_image} width="150px" height="150px" />
                        </Form.Item>
                        <Form.Item label="姓名">
                            <Input value={IDName} readOnly />
                        </Form.Item>
                        <Form.Item label="身份证号">
                            <Input value={IDNum} readOnly />
                        </Form.Item>
                        <Form.Item label="有效期">
                            <Input value={IDValidity} readOnly />
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="门店审核" bordered={false} style={{ width: "100%", marginTop: "20px" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="审核结果">
                            <Radio.Group value={isDefault} onChange={this.handleChangeIsDefault}>
                                <Radio value={1}>通过</Radio>
                                <Radio value={0}>不通过</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            isDefault == 1 ? (
                                <Form.Item label="商圈">
                                    <Select
                                        placeholder="请选择"
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        {
                                            bussinessDatas.map(item => (
                                                <Option value={item.name}>{item.name}</Option>
                                            ))
                                        }
                                    </Select>,
                                </Form.Item>
                            ) : isDefault == 0 ? (
                                <Form.Item label="失败类型" wrapperCol={
                                    {
                                        xs: { span: 8 },
                                        sm: { span: 8 },
                                    }
                                }>
                                    <div style={{ display: 'flex' }}>
                                        <Checkbox style={{ flex: 1 }} onChange={(e) => this.setState({ storeMsgFail: e.target.checked })}>门店信息</Checkbox>
                                        {
                                            storeMsgFail ? (
                                                <div style={{ flex: 2, display: 'flex', alignItems: 'center' }} >
                                                    <span style={{ flex: 1 }}>失败原因</span>
                                                    <Input style={{ flex: 3 }} placeholder="Basic usage" />
                                                </div>
                                            ) : ""
                                        }
                                    </div>
                                    <br />
                                    <div style={{ display: 'flex' }}>
                                        <Checkbox style={{ flex: 1 }} onChange={(e) => this.setState({ licenseMsgFail: e.target.checked })}>营业执照信息</Checkbox>
                                        {
                                            licenseMsgFail ? (
                                                <div style={{ flex: 2, display: 'flex', alignItems: 'center' }} >
                                                    <span style={{ flex: 1 }}>失败原因</span>
                                                    <Input style={{ flex: 3 }} placeholder="Basic usage" />
                                                </div>
                                            ) : ""
                                        }
                                    </div>
                                    <br />
                                    <div style={{ display: 'flex' }}>
                                        <Checkbox style={{ flex: 1 }} onChange={(e) => this.setState({ IDMsgFail: e.target.checked })}>法人身份证信息</Checkbox>
                                        {
                                            IDMsgFail ? (
                                                <div style={{ flex: 2, display: 'flex', alignItems: 'center' }} >
                                                    <span style={{ flex: 1 }}>失败原因</span>
                                                    <Input style={{ flex: 3 }} placeholder="Basic usage" />
                                                </div>
                                            ) : ""
                                        }
                                    </div>
                                </Form.Item>
                            ) : ""
                        }
                    </Form>
                </Card>
            </div >
        )
    }
}