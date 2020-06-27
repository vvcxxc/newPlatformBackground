import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Card, Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal, Radio, Checkbox, Upload, Icon, message, Cascader } from 'antd'
import { connect } from "dva";
import { router } from "umi";
import moment from 'moment';
import { Map, Marker, MouseTool } from 'react-amap';
import { add } from "lodash";

const { Option } = Select;

export default class storeAuditOpearation extends Component {

    geocoder: any;

    events = {
        created: (instance: any) => {
            const _this = this
            instance.plugin('AMap.Geolocation', function () {
                let geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(14, 130),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                instance.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.plugin('AMap.PlaceSearch')
                AMap.plugin('AMap.Geocoder', () => {
                    _this.geocoder = new AMap.Geocoder({
                        city: "010"//城市，默认：“全国”
                    })
                })
                geolocation.getCurrentPosition()
                AMap.plugin('AMap.CitySearch', function () {
                    var citySearch = new AMap.CitySearch()
                    citySearch.getLocalCity(function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            // 查询成功，result即为当前所在城市信息
                            let r1 = result.rectangle.split(';')[0];
                            let r2 = result.rectangle.split(';')[1];
                            let x = (Number(r1.split(',')[0]) + Number(r2.split(',')[0])) / 2;
                            let y = (Number(r1.split(',')[1]) + Number(r2.split(',')[1])) / 2;
                        }
                    })
                })

            });
        },
        click: (e: any) => {
            let location = {
                latitude: e.lnglat.lat,
                longitude: e.lnglat.lng,
            }
            this.setState({ location })
            this.geocoder.getAddress([location.longitude, location.latitude], (status: string, result: any) => {
                console.log(result)
                if (status === 'complete' && result.info === 'OK') {
                    // result为对应的地理位置详细信息
                    let address = result.regeocode.formattedAddress;
                    this.setState({
                        map_address: address,
                        provinceName: result.regeocode.addressComponent.province,
                        cityName: result.regeocode.addressComponent.city,
                        districtName: result.regeocode.addressComponent.district
                    }, () => {
                        // console.log(this.state.all_city)
                        let list = this.state.all_city;
                        let provinceName = this.state.provinceName;
                        let cityName = this.state.cityName;
                        let districtName = this.state.districtName;
                        for (let i in list) {
                            if (list[i].name == provinceName) {
                                this.setState({
                                    provinceID: list[i].id
                                })
                                let city = list[i].city;
                                for (let a in city) {
                                    if (city[a].name == cityName) {
                                        this.setState({
                                            cityID: city[a].id
                                        })
                                    }
                                    let county = city[a].district;
                                    for (let b in county) {
                                        if (county[b].name == districtName) {
                                            this.setState({
                                                districtID: county[b].id
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            })
        }
    };

    handleChangeSelcetMap = (e, v) => {
        let address = "";
        v.forEach(item => {
            address += item.label;
        })
        console.log(address);
        this.geocoder = new AMap.Geocoder({});
        this.geocoder.getLocation(address, (status, result) => {
            console.log(status, result)
            if (status === 'complete') {
                this.setState({
                    location: {
                        longitude: result.geocodes[0].location.lng,
                        latitude: result.geocodes[0].location.lat,
                        provinceName: result.geocodes[0].addressComponent.province,
                        cityName: result.geocodes[0].addressComponent.city,
                        districtName: result.geocodes[0].addressComponent.district
                    },
                    map_address: ""
                })
            }

        })
    }

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
        storeFailSeason: "",
        licenseMsgFail: false,
        licenseFailSeason: "",
        IDMsgFail: false,
        IDFailSeason: "",

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
        isSelcetDateID: 1,

        storeType: null,


        city_list: [],
        city_id: [],
        map_address: '',
        location: {
            longitude: "",
            latitude: ""
        },
        mapShow: false,


        provinceID: 0,
        provinceName: "",
        cityID: 0,
        cityName: "",
        districtID: 0,
        districtName: "",
        all_city: [],

    }


    getCity = () => {
        request.get('/json/regions').then(res => {
            let list = JSON.stringify(res.data)
            let a = list.replace(/name/g, "label")
            let b = a.replace(/id/g, "value")
            let c = b.replace(/city/g, "children")
            let d = c.replace(/district/g, "children")
            this.setState({ city_list: JSON.parse(d) })
            this.setState({ all_city: res.data })
        })
    }

    handleChangeIsDefault = (e) => {
        this.setState({
            isDefault: e.target.value,
            storeMsgFail: false,
            licenseMsgFail: false,
            IDMsgFail: false,
            storeType: null
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
                location: { longitude: res.data.lng, latitude: res.data.lat },
                provinceID: res.data.province_id,
                cityID: res.data.city_id,
                districtID: res.data.county_id,
            })
        })

        this.getCity();
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
            IDValidity,
            storeMsgFail,
            licenseMsgFail,
            IDMsgFail,
            storeFailSeason,
            licenseFailSeason,
            IDFailSeason,
            storeType,
            storeName,
            storeAddress,
            detailAddress,
            storeTel,
            storeEmail,
            bussinessType,
            storeImg,
            environmental_photo,
            bussinessImg,
            registerNum,
            licenseName,
            legalPersonName,
            identity_card_positive_image,
            identity_card_opposite_image,
            identity_card_handheld_image,
            IDName,
            IDNum,
            location,
            provinceID,
            cityID,
            districtID
        } = this.state;
        if (storeName == "" || storeAddress == "" || detailAddress == "" || storeTel == "" || storeEmail == "" || bussinessType == ""
            || storeImg == "" || environmental_photo.length != 2 || bussinessImg == "" || registerNum == "" || licenseName == "" || legalPersonName == ""
            || identity_card_positive_image == "" || identity_card_opposite_image == "" || identity_card_handheld_image == "" || IDName == "" || IDNum == ""
        ) {
            message.error('请填写完整资料'); return;
        }
        if (isSelcetDateLicense == 1 && validity == "") {
            message.error('请选择营业执照有效期'); return;
        }
        if (isSelcetDateID == 1 && IDValidity == "") {
            message.error('请选择身份证有效期'); return;
        }
        if (isDefault == null) {
            message.error('请选择审核结果'); return;
        }
        if (isDefault == 0) {
            if (!storeMsgFail && !licenseMsgFail && !IDMsgFail) {
                message.error('请选择失败类型'); return;
            }
            if (storeMsgFail && storeFailSeason == "") {
                message.error('请填写失败原因'); return;
            }
            if (licenseMsgFail && licenseFailSeason == "") {
                message.error('请填写失败原因'); return;
            }
            if (IDMsgFail && IDFailSeason == "") {
                message.error('请填写失败原因'); return;
            }
        }
        if (isDefault == 1) {
            if (storeType == null) {
                message.error('请选择商圈'); return;
            }
        }

        let data = {
            store_name: storeName,
            store_address: storeAddress,
            lng: location.longitude,
            lat: location.latitude,
            store_address_info: detailAddress,
            store_telephone: storeTel,
            email: storeEmail,
            category_id: bussinessType,
            door_photo: storeImg,
            environmental_photo,
            business_license_photo: bussinessImg,
            registration_number: registerNum,
            license_name: licenseName,
            legal_person_name: legalPersonName,
            is_license_long_time: isSelcetDateLicense == 1 ? 0 : 1,
            identity_card_positive_image,
            identity_card_opposite_image,
            identity_card_handheld_image,
            identity_name: IDName,
            identity_card: IDNum,
            is_identity_card_long_time: isSelcetDateID == 1 ? 0 : 1,
            examine_type: isDefault == 1 ? 3 : 4,
            province_id: provinceID,
            city_id: cityID,
            county_id: districtID
        }
        if (isSelcetDateLicense == 1) {
            data.license_valid_until = validity;
        }
        if (isSelcetDateID == 1) {
            data.identity_card_valid_until = IDValidity;
        }
        if (isDefault == 1) {
            data.business_districts_id = storeType;
            data.store_type = 3;
            data.business_type = 3;
            data.identity_type = 3;
        } else if (isDefault == 0) {
            if (storeMsgFail) {
                data.store_type = 4;
                data.store_remarks = storeFailSeason;
            } else {
                data.store_type = 3;
            }

            if (licenseMsgFail) {
                data.business_type = 4;
                data.business_remarks = licenseFailSeason;
            } else {
                data.business_type = 3;
            }

            if (IDMsgFail) {
                data.identity_type = 4;
                data.identity_remarks = IDFailSeason;
            } else {
                data.identity_type = 3;
            }

        }
        const id = this.props.location.query.id;
        request(`/admin/store/audit/${id}`, {
            method: 'PUT',
            data,
        }).then(res => {
            message.success("操作成功")
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 8 },
                sm: { span: 8 },
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
            isSelcetDateID,
            storeFailSeason,
            licenseFailSeason,
            IDFailSeason
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
                            <div style={{ display: 'flex' }}>
                                <Input value={storeAddress} onChange={this.handleChangeInp.bind(this, 'storeAddress')} />
                                <Button onClick={() => { this.setState({ mapShow: true }) }}>打开地图</Button>
                            </div>
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
                                        onChange={(v) => { this.setState({ storeType: v }) }}
                                    >
                                        {
                                            bussinessDatas.map(item => (
                                                <Option value={item.id}>{item.name}</Option>
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
                                        <Checkbox style={{ flex: 1 }} onChange={(e) => this.setState({ storeMsgFail: e.target.checked, storeFailSeason: "" })}>门店信息</Checkbox>
                                        {
                                            storeMsgFail ? (
                                                <div style={{ flex: 2, display: 'flex', alignItems: 'center' }} >
                                                    <span style={{ flex: 1 }}>失败原因</span>
                                                    <Input style={{ flex: 3 }} placeholder="Basic usage" value={storeFailSeason} onChange={this.handleChangeInp.bind(this, 'storeFailSeason')} />
                                                </div>
                                            ) : ""
                                        }
                                    </div>
                                    <br />
                                    <div style={{ display: 'flex' }}>
                                        <Checkbox style={{ flex: 1 }} onChange={(e) => this.setState({ licenseMsgFail: e.target.checked, licenseFailSeason: "" })}>营业执照信息</Checkbox>
                                        {
                                            licenseMsgFail ? (
                                                <div style={{ flex: 2, display: 'flex', alignItems: 'center' }} >
                                                    <span style={{ flex: 1 }}>失败原因</span>
                                                    <Input style={{ flex: 3 }} placeholder="Basic usage" value={licenseFailSeason} onChange={this.handleChangeInp.bind(this, 'licenseFailSeason')} />
                                                </div>
                                            ) : ""
                                        }
                                    </div>
                                    <br />
                                    <div style={{ display: 'flex' }}>
                                        <Checkbox style={{ flex: 1 }} onChange={(e) => this.setState({ IDMsgFail: e.target.checked, IDFailSeason: "" })}>法人身份证信息</Checkbox>
                                        {
                                            IDMsgFail ? (
                                                <div style={{ flex: 2, display: 'flex', alignItems: 'center' }} >
                                                    <span style={{ flex: 1 }}>失败原因</span>
                                                    <Input style={{ flex: 3 }} placeholder="Basic usage" value={IDFailSeason} onChange={this.handleChangeInp.bind(this, 'IDFailSeason')} />
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


                <Modal
                    className={styles.mapModal}
                    title="Basic Modal"
                    visible={this.state.mapShow}
                    onOk={() => { this.setState({ mapShow: false, storeAddress: this.state.map_address }) }}
                    onCancel={() => { this.setState({ mapShow: false }) }}
                >
                    <div className={styles.mapContent}>
                        <Cascader className={styles.mapContentInputL} options={this.state.city_list} onChange={this.handleChangeSelcetMap} />
                        <Input className={styles.mapContentInputR} type="text" value={this.state.map_address} onChange={(e: any) => { this.setState({ map_address: e.target.value }) }} />
                        <div className={styles.mapArea}>
                            <Map version={'1.4.15'} center={this.state.location} events={this.events} amapkey={'47d12b3485d7ded218b0d369e2ddd1ea'} zoom={12}  >
                                <Marker position={this.state.location} />
                            </Map>
                        </div>
                    </div>
                </Modal>
            </div >
        )
    }
}