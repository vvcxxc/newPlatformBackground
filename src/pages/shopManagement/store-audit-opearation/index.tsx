import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Card, Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal, Radio, Checkbox, Upload, Icon, message } from 'antd'
import { connect } from "dva";
import { router } from "umi";
import moment from 'moment';

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

        bussinessDatas: [],

        categoryDatas: [],

        oss_data: {},
        loadingStore: false,

        loadingEnvironmentalPhotoOne: false,

        loadingEnvironmentalPhotoTwo: false,

        loadingLicense: false,

        loadingIDPositive: false,

        loadingIDOpposite: false,

        loadingIDHandheld: false,

        isSelcetDateLicense: 1,
        isSelcetDateID: 1

    }

    handleChangeIsDefault = (e) => {
        this.setState({
            isDefault: e.target.value,
            storeMsgFail: false,
            licenseMsgFail: false,
            IDMsgFail: false,
        })
    }

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

    // 将图片转为base64
    getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    componentDidMount = async () => {

        request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
            let { data } = res;
            this.setState({
                oss_data: {
                    policy: data.policy,
                    OSSAccessKeyId: data.accessid,
                    success_action_status: 200, //让服务端返回200,不然，默认会返回204
                    signature: data.signature,
                    callback: data.callback,
                    host: data.host,
                    key: data.dir,
                },
            }, () => {
                console.log(this.state)
            });
        });

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


        await request('/admin/store/category', {
            method: 'GET',
            params: {}
        }).then(res => {
            this.setState({
                categoryDatas: res.data
            })
        })

        const id = this.props.location.query.id;
        request(`/admin/store/examines/${id}`, {
            method: 'GET',
        }).then(res => {
            this.state.categoryDatas.forEach(item => {
                if (item.id == res.data.category_id) {
                    this.setState({
                        bussinessType: item.id
                    })
                }
            })
            this.setState({
                storeName: res.data.store_name,
                storeAddress: res.data.store_address,
                detailAddress: res.data.store_address_info,
                storeTel: res.data.store_telephone,
                storeEmail: res.data.email,
                // bussinessType: res.data.category_id,
                storeImg: res.data.door_photo,
                environmental_photo: res.data.environmental_photo,
                bussinessImg: res.data.business_license_photo,
                registerNum: res.data.registration_number,
                licenseName: res.data.license_name,
                legalPersonName: res.data.legal_person_name,
                validity: res.data.license_valid_until,
                isSelcetDateLicense: res.data.is_license_long_time == 1 ? 0 : 1,
                identity_card_positive_image: res.data.identity_card_positive_image,
                identity_card_opposite_image: res.data.identity_card_opposite_image,
                identity_card_handheld_image: res.data.identity_card_handheld_image,
                IDName: res.data.identity_name,
                IDNum: res.data.identity_card,
                IDValidity: res.data.identity_card_valid_until,
                isSelcetDateID: res.data.is_identity_card_long_time == 1 ? 0 : 1,
            })
        })
    }


    handleChangeInp = (type, e) => {
        this.setState({
            [type]: e.target.value
        }, () => {
            console.log(this.state)
        })
    }

    handleChangeSelectCategory = (e) => {
        this.setState({
            bussinessType: e
        })
    }

    // 上传门头照
    imageChangeStore = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingStore: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    storeImg: info.file.response.data.path,
                    loadingStore: false,
                }),
            );
        }
    };
    // 上传门头照前
    beforeUploadStoreImg = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data.policy,
                OSSAccessKeyId: this.state.oss_data.OSSAccessKeyId,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data.signature,
                callback: this.state.oss_data.callback,
                host: this.state.oss_data.host,
                key: this.state.oss_data.key + this.randomString(32) + '.png',
            }
        })
    }

    // 上传环境照1
    imageChangeEnvironmentalPhotoOne = (info: any) => {
        let temp = this.state.environmental_photo;
        if (info.file.status === 'uploading') {
            this.setState({ loadingEnvironmentalPhotoOne: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl => {
                temp[0] = info.file.response.data.path;
                this.setState({
                    environmental_photo: temp
                })
            }
            );
        }
    };
    // 上传环境照1前
    beforeUploadEnvironmentalPhotoOne = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data.policy,
                OSSAccessKeyId: this.state.oss_data.OSSAccessKeyId,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data.signature,
                callback: this.state.oss_data.callback,
                host: this.state.oss_data.host,
                key: this.state.oss_data.key + this.randomString(32) + '.png',
            }
        })
    }

    // 上传环境照2
    imageChangeEnvironmentalPhotoTwo = (info: any) => {
        let temp = this.state.environmental_photo;
        if (info.file.status === 'uploading') {
            this.setState({ loadingEnvironmentalPhotoTwo: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl => {
                temp[1] = info.file.response.data.path;
                this.setState({
                    environmental_photo: temp
                })
            }
            );
        }
    };
    // 上传环境照2前
    beforeUploadEnvironmentalPhotoTwo = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data.policy,
                OSSAccessKeyId: this.state.oss_data.OSSAccessKeyId,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data.signature,
                callback: this.state.oss_data.callback,
                host: this.state.oss_data.host,
                key: this.state.oss_data.key + this.randomString(32) + '.png',
            }
        })
    }



    // 上传营业执照
    imageChangeLicense = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingLicense: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    bussinessImg: info.file.response.data.path,
                    loadingLicense: false,
                }),
            );
        }
    };
    // 上传门头照前
    beforeUploadLicense = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data.policy,
                OSSAccessKeyId: this.state.oss_data.OSSAccessKeyId,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data.signature,
                callback: this.state.oss_data.callback,
                host: this.state.oss_data.host,
                key: this.state.oss_data.key + this.randomString(32) + '.png',
            }
        })
    }


    // 上传身份证正面
    imageChangeIDPositive = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingIDPositive: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    identity_card_positive_image: info.file.response.data.path,
                    loadingIDPositive: false,
                }),
            );
        }
    };
    // 上传身份证正面前
    beforeUploadIDPositive = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data.policy,
                OSSAccessKeyId: this.state.oss_data.OSSAccessKeyId,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data.signature,
                callback: this.state.oss_data.callback,
                host: this.state.oss_data.host,
                key: this.state.oss_data.key + this.randomString(32) + '.png',
            }
        })
    }


    // 上传身份证反面
    imageChangeIDOpposite = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingIDOpposite: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    identity_card_opposite_image: info.file.response.data.path,
                    loadingIDOpposite: false,
                }),
            );
        }
    };

    // 上传身份证反面前
    beforeUploadIDOpposite = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data.policy,
                OSSAccessKeyId: this.state.oss_data.OSSAccessKeyId,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data.signature,
                callback: this.state.oss_data.callback,
                host: this.state.oss_data.host,
                key: this.state.oss_data.key + this.randomString(32) + '.png',
            }
        })
    }


    // 上传身份证手持面
    imageChangeIDHandheld = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingIDHandheld: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    identity_card_handheld_image: info.file.response.data.path,
                    loadingIDHandheld: false,
                }),
            );
        }
    };

    // 上传身份证手持前
    beforeUploadIDHandheld = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data.policy,
                OSSAccessKeyId: this.state.oss_data.OSSAccessKeyId,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data.signature,
                callback: this.state.oss_data.callback,
                host: this.state.oss_data.host,
                key: this.state.oss_data.key + this.randomString(32) + '.png',
            }
        })
    }

    handleSelectDateLicense = (e) => {
        this.setState({
            isSelcetDateLicense: e.target.value
        })
    }

    handleSelectLicenseValidity = (date, dateString) => {
        this.setState({
            validity: dateString
        })
    }


    handleSelectDateID = (e) => {
        this.setState({
            isSelcetDateID: e.target.value
        })
    }

    handleSelectIDValidity = (date, dateString) => {
        this.setState({
            IDValidity: dateString
        })
    }

    handleSubmit = () => {
        console.log(this.state);
        const {
            isDefault,
            isSelcetDateLicense,
            validity,
            isSelcetDateID,
            IDValidity
        } = this.state;
        if (!isDefault) {
            message.error('请选择审核结果'); return;
        }
        if (isSelcetDateLicense == 1 && validity == "") {
            message.error('请选择营业执照有效期'); return;
        }
        if (isSelcetDateID == 1 && IDValidity == "") {
            message.error('请选择身份证有效期'); return;
        }
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
            bussinessDatas,
            categoryDatas,
            oss_data,
            isSelcetDateLicense,
            isSelcetDateID
        } = this.state;
        const uploadButtonStoreImg = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingStore ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonEnvironmentalPhotoOne = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingEnvironmentalPhotoOne ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonEnvironmentalPhotoTwo = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingEnvironmentalPhotoTwo ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonLicense = (
            <div className={styles.uploadDefaultLicense}>
                <Icon type={this.state.loadingLicense ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonIDPositive = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingIDPositive ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonIDOpposite = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingIDOpposite ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonIDHandheld = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingIDHandheld ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div>
                <Card title="门店信息" bordered={false} style={{ width: "100%" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="门店名称">
                            <Input value={storeName} onChange={this.handleChangeInp.bind(this, 'storeName')} />
                        </Form.Item>
                        <Form.Item label="门店地址">
                            <Input value={storeAddress} onChange={this.handleChangeInp.bind(this, 'storeAddress')} />
                        </Form.Item>
                        <Form.Item label="详细地址">
                            <Input value={detailAddress} onChange={this.handleChangeInp.bind(this, 'detailAddress')} />
                        </Form.Item>
                        {/* <Form.Item label="门牌号">
                            <Input value={storeNum} readOnly />
                        </Form.Item> */}
                        <Form.Item label="门店电话">
                            <Input value={storeTel} onChange={this.handleChangeInp.bind(this, 'storeTel')} />
                        </Form.Item>
                        <Form.Item label="邮箱">
                            <Input value={storeEmail} onChange={this.handleChangeInp.bind(this, 'storeEmail')} />
                        </Form.Item>
                        <Form.Item label="经营品类">
                            {/* <Input value={bussinessType} onChange={this.handleChangeInp.bind(this, 'bussinessType')} /> */}
                            <Select
                                placeholder="请选择"
                                style={{
                                    width: '100%',
                                }}
                                onChange={this.handleChangeSelectCategory}
                                value={bussinessType}
                            >
                                {
                                    categoryDatas.map(item => (
                                        <Option value={item.id}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="门头图片">
                            {/* <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + storeImg} width="150px" height="150px" /> */}
                            <Upload
                                style={{ width: '150px', height: '150px' }}
                                listType="picture-card"
                                showUploadList={false}
                                onChange={this.imageChangeStore}
                                data={oss_data}
                                action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                beforeUpload={this.beforeUploadStoreImg}
                            >
                                {storeImg ? (
                                    <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + storeImg} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                ) : (
                                        uploadButtonStoreImg
                                    )}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="环境照" wrapperCol={
                            {
                                xs: { span: 6 },
                                sm: { span: 6 },
                            }
                        }>
                            {/* {
                                environmental_photo.map(item => (
                                    <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + item} alt="" width="150" height="150" style={{ marginRight: 10 }} />
                                ))
                            } */}
                            <div style={{ display: 'flex' }}>
                                <Upload
                                    style={{ width: '150px', height: '150px' }}
                                    listType="picture-card"
                                    showUploadList={false}
                                    onChange={this.imageChangeEnvironmentalPhotoOne}
                                    data={oss_data}
                                    action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                    beforeUpload={this.beforeUploadEnvironmentalPhotoOne}
                                >
                                    {
                                        environmental_photo ? (
                                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + environmental_photo[0]} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonEnvironmentalPhotoOne
                                            )
                                    }
                                </Upload>
                                <Upload
                                    style={{ width: '150px', height: '150px' }}
                                    listType="picture-card"
                                    showUploadList={false}
                                    onChange={this.imageChangeEnvironmentalPhotoTwo}
                                    data={oss_data}
                                    action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                    beforeUpload={this.beforeUploadEnvironmentalPhotoTwo}
                                >
                                    {
                                        environmental_photo ? (
                                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + environmental_photo[1]} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonEnvironmentalPhotoTwo
                                            )
                                    }
                                </Upload>
                            </div>
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
                            {/* <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + bussinessImg} width="350px" height="180px" /> */}
                            <Upload
                                style={{ width: '350px', height: '180px' }}
                                listType="picture-card"
                                showUploadList={false}
                                onChange={this.imageChangeLicense}
                                data={oss_data}
                                action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                beforeUpload={this.beforeUploadLicense}
                            >
                                {bussinessImg ? (
                                    <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + bussinessImg} alt="avatar" style={{ width: '350px', height: '180px' }} />
                                ) : (
                                        uploadButtonLicense
                                    )}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="注册号">
                            <Input value={registerNum} onChange={this.handleChangeInp.bind(this, 'registerNum')} />
                        </Form.Item>
                        <Form.Item label="执照名称">
                            <Input value={licenseName} onChange={this.handleChangeInp.bind(this, 'licenseName')} />
                        </Form.Item>
                        <Form.Item label="法人姓名">
                            <Input value={legalPersonName} onChange={this.handleChangeInp.bind(this, 'legalPersonName')} />
                        </Form.Item>
                        <Form.Item label="有效期">
                            {/* <Input value={validity} onChange={this.handleChangeInp.bind(this, 'validity')} /> */}
                            <Radio.Group value={isSelcetDateLicense} onChange={this.handleSelectDateLicense}>
                                <Radio value={1}>选择日期</Radio>
                                <Radio value={0}>长期有效</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            isSelcetDateLicense ? (
                                <Form.Item label="请选择">
                                    <DatePicker value={moment(validity, 'YYYY-MM-DD')} onChange={this.handleSelectLicenseValidity} />
                                </Form.Item>
                            ) : ""
                        }
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
                            {/* <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_positive_image} width="150px" height="150px" style={{ marginRight: '10px' }} />
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_opposite_image} width="150px" height="150px" style={{ marginRight: '10px' }} />
                            <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_handheld_image} width="150px" height="150px" /> */}
                            <div style={{ display: 'flex' }}>
                                <Upload
                                    style={{ width: '150px', height: '150px' }}
                                    listType="picture-card"
                                    showUploadList={false}
                                    onChange={this.imageChangeIDPositive}
                                    data={oss_data}
                                    action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                    beforeUpload={this.beforeUploadIDPositive}
                                >
                                    {identity_card_positive_image ? (
                                        <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_positive_image} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                    ) : (
                                            uploadButtonIDPositive
                                        )}
                                </Upload>
                                <Upload
                                    style={{ width: '150px', height: '150px' }}
                                    listType="picture-card"
                                    showUploadList={false}
                                    onChange={this.imageChangeIDOpposite}
                                    data={oss_data}
                                    action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                    beforeUpload={this.beforeUploadIDOpposite}
                                >
                                    {identity_card_opposite_image ? (
                                        <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_opposite_image} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                    ) : (
                                            uploadButtonIDOpposite
                                        )}
                                </Upload>
                                <Upload
                                    style={{ width: '150px', height: '150px' }}
                                    listType="picture-card"
                                    showUploadList={false}
                                    onChange={this.imageChangeIDHandheld}
                                    data={oss_data}
                                    action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                    beforeUpload={this.beforeUploadIDHandheld}
                                >
                                    {identity_card_handheld_image ? (
                                        <img src={`http://tmwl.oss-cn-shenzhen.aliyuncs.com/` + identity_card_handheld_image} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                    ) : (
                                            uploadButtonIDHandheld
                                        )}
                                </Upload>
                            </div>
                        </Form.Item>
                        <Form.Item label="姓名">
                            <Input value={IDName} onChange={this.handleChangeInp.bind(this, 'IDName')} />
                        </Form.Item>
                        <Form.Item label="身份证号">
                            <Input value={IDNum} onChange={this.handleChangeInp.bind(this, 'IDNum')} />
                        </Form.Item>
                        {/* <Form.Item label="有效期">
                            <Input value={IDValidity} onChange={this.handleChangeInp.bind(this, 'IDValidity')} />
                        </Form.Item> */}
                        <Form.Item label="有效期">
                            <Radio.Group value={isSelcetDateID} onChange={this.handleSelectDateID}>
                                <Radio value={1}>选择日期</Radio>
                                <Radio value={0}>长期有效</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            isSelcetDateID ? (
                                <Form.Item label="请选择">
                                    <DatePicker value={moment(IDValidity, 'YYYY-MM-DD')} onChange={this.handleSelectIDValidity} />
                                </Form.Item>
                            ) : ""
                        }
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
                        <Form.Item wrapperCol={{ offset: 2 }}>
                            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div >
        )
    }
}