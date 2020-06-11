import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Card, Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal } from 'antd'
import { connect } from "dva";
import { router } from "umi";

export default class storeAuditOpearation extends Component {

    state = {
        storeName: "",
        storeAddress: "",
        detailAddress: "",
        storeNum: "",
        storeTel: "",
        storeEmail: "",
        bussinessType: "",
        storeImg: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591778757247&di=bc5b5d236c1afaa9ea1bd5e8f1ef9eda&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F248%2Fw650h398%2F20180319%2F2cb6-fyskeuc2249702.jpg",
        bussinessImg: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591778757247&di=bc5b5d236c1afaa9ea1bd5e8f1ef9eda&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F248%2Fw650h398%2F20180319%2F2cb6-fyskeuc2249702.jpg",
        registerNum: "",
        licenseName: "",
        legalPersonName: "",
        validity: "",
        IDName: "",
        IDNum: "",
        IDValidity: ""
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
            bussinessImg,
            registerNum,
            licenseName,
            legalPersonName,
            validity,
            IDName,
            IDNum,
            IDValidity
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
                        <Form.Item label="门牌号">
                            <Input value={storeNum} readOnly />
                        </Form.Item>
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
                            <img src={storeImg} width="150px" height="150px" />
                        </Form.Item>
                        <Form.Item label="环境照" wrapperCol={
                            {
                                xs: { span: 5 },
                                sm: { span: 5 },
                            }
                        }>
                            <img src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591778757247&di=bc5b5d236c1afaa9ea1bd5e8f1ef9eda&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F248%2Fw650h398%2F20180319%2F2cb6-fyskeuc2249702.jpg"} width="150px" height="150px" style={{ marginRight: '10px' }} />
                            <img src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591778757247&di=bc5b5d236c1afaa9ea1bd5e8f1ef9eda&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F248%2Fw650h398%2F20180319%2F2cb6-fyskeuc2249702.jpg"} width="150px" height="150px" />
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
                            <img src={bussinessImg} width="350px" height="180px" />
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
                            <img src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591778757247&di=bc5b5d236c1afaa9ea1bd5e8f1ef9eda&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F248%2Fw650h398%2F20180319%2F2cb6-fyskeuc2249702.jpg"} width="150px" height="150px" style={{ marginRight: '10px' }} />
                            <img src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591778757247&di=bc5b5d236c1afaa9ea1bd5e8f1ef9eda&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F248%2Fw650h398%2F20180319%2F2cb6-fyskeuc2249702.jpg"} width="150px" height="150px" style={{ marginRight: '10px' }} />
                            <img src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591778757247&di=bc5b5d236c1afaa9ea1bd5e8f1ef9eda&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn15%2F248%2Fw650h398%2F20180319%2F2cb6-fyskeuc2249702.jpg"} width="150px" height="150px" />
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
                    ></Form>
                </Card>
            </div >
        )
    }
}