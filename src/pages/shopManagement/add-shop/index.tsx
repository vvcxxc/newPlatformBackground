import React, { Component } from "react";
import styles from './index.less'
import request from '@/utils/request';
import { Row, Col, Form, Input, DatePicker, Button, Select, Table, Modal, Upload, Icon, Card, Radio, Cascader } from 'antd'
import { connect } from "dva";
import { router } from "umi";
import moment from 'moment'
import { Map, Marker, MouseTool } from 'react-amap';
import Item from "antd/lib/list/Item";

const { Option } = Select;

export default class AddShop extends Component {

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
                            _this.setState({ location: [x, y] })
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
                if (status === 'complete' && result.info === 'OK') {
                    // result为对应的地理位置详细信息
                    let address = result.regeocode.formattedAddress;
                    let provinceName = result.regeocode.addressComponent.province;
                    let cityName = result.regeocode.addressComponent.city;
                    let districtName = result.regeocode.addressComponent.district;
                    this.setState({ storeAddress: provinceName + cityName + districtName + address }, () => {
                        let list = this.state.city_list;

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



    state = {
        categoryDatas: [],
        businessDatas: [],
        categoryDatasId: undefined,
        businessDatasId: undefined,

        mapShow: false,

        storeName: "",
        storeAddress: "",
        storeDetailAddress: "",
        storeTelephone: "",
        storeEmail: "",


        oss_data: {},
        oss_data_data: {},

        loadingStoreHead: false,
        imageUrlStoreHead: "",
        cover_image_StoreHead: "",

        loadingEnvironmentalFirst: false,
        imageUrlEnvironmentalFirst: "",
        cover_image_EnvironmentalFirst: "",


        loadingEnvironmentalSecond: false,
        imageUrlEnvironmentalSecond: "",
        cover_image_EnvironmentalSecond: "",

        loadingSale: false,
        imageUrlSale: "",
        cover_image_Sale: "",

        registerNum: "",
        saleName: "",
        saleOwn: "",
        SaleValidate: 0,
        SaleValidateString: '',

        loadingIDFirst: false,
        imageUrlIDFirst: "",
        cover_image_IDFirst: "",

        loadingIDSecond: false,
        imageUrlIDSecond: "",
        cover_image_IDSecond: "",

        loadingIDThird: false,
        imageUrlIDThird: "",
        cover_image_IDThird: "",

        userName: "",
        userIDCard: "",
        userIDValidate: 0,
        userIDValidateString: '',

        city_list: [],
        provinceID: 0,
        cityID: 0,
        districtID: 0,
        location: [0, 0]
    }

    componentDidMount() {
        request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
            let { data } = res;
            this.setState({
                oss_data_data: data,
                oss_data: {
                    policy: data.policy,
                    OSSAccessKeyId: data.accessid,
                    success_action_status: 200, //让服务端返回200,不然，默认会返回204
                    signature: data.signature,
                    callback: data.callback,
                    host: data.host,
                    key: data.dir + this.randomString(32) + '.png',
                },
            }, () => {
            });
        });
        this.getCity();
        this.getType();
    }
    getCity = () => {
        request.get('/json/regions').then(res => {
            let list = JSON.stringify(res.data)
            let a = list.replace(/name/g, "label")
            let b = a.replace(/id/g, "value")
            let c = b.replace(/city/g, "children")
            let d = c.replace(/district/g, "children")
            this.setState({ city_list: JSON.parse(d) })
        })
    }
    getType = () => {
        request.get('/admin/business/list/all', {
            method: 'GET'
        }).then(res => {
            this.setState({
                businessDatas: res.data
            })
        })
        request('/admin/store/category', {
            method: 'GET'
        }).then(res => {
            this.setState({
                categoryDatas: res.data
            })
        })
    }
    handleChange = (type, e) => {
        this.setState({
            [type]: e.target.value
        })
    }

    // 将图片转为base64
    getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

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


    // 上传门头图片
    imageChangeStoreHead = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingStoreHead: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrlStoreHead: imageUrl,
                    cover_image_StoreHead: info.file.response.data.path,
                    loadingStoreHead: false,
                }),
            );
        }
    };
    // 上传门头图片前
    beforeUploadStoreHead = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data_data.policy,
                OSSAccessKeyId: this.state.oss_data_data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data_data.signature,
                callback: this.state.oss_data_data.callback,
                host: this.state.oss_data_data.host,
                key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
            }
        })
    }


    // 上传环境图片1
    imageChangeEnvironmentalFirst = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingEnvironmentalFirst: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrlEnvironmentalFirst: imageUrl,
                    cover_image_EnvironmentalFirst: info.file.response.data.path,
                    loadingEnvironmentalFirst: false,
                }),
            );
        }
    };
    // 上传环境图片1前
    beforeUploadEnvironmentalFirst = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data_data.policy,
                OSSAccessKeyId: this.state.oss_data_data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data_data.signature,
                callback: this.state.oss_data_data.callback,
                host: this.state.oss_data_data.host,
                key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
            }
        })
    }


    // 上传环境图片2
    imageChangeEnvironmentalSecond = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingEnvironmentalSecond: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrlEnvironmentalSecond: imageUrl,
                    cover_image_EnvironmentalSecond: info.file.response.data.path,
                    loadingEnvironmentalSecond: false,
                }),
            );
        }
    };
    // 上传环境图片2前
    beforeUploadEnvironmentalSecond = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data_data.policy,
                OSSAccessKeyId: this.state.oss_data_data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data_data.signature,
                callback: this.state.oss_data_data.callback,
                host: this.state.oss_data_data.host,
                key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
            }
        })
    }

    // 上传营业执照
    imageChangeSale = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingSale: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrlSale: imageUrl,
                    cover_image_Sale: info.file.response.data.path,
                    loadingSale: false,
                }),
            );
        }
    };
    // 上传环境图片2前
    beforeUploadSale = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data_data.policy,
                OSSAccessKeyId: this.state.oss_data_data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data_data.signature,
                callback: this.state.oss_data_data.callback,
                host: this.state.oss_data_data.host,
                key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
            }
        })
    }

    handleChangeSaleValidate = (e) => {
        this.setState({
            SaleValidate: e.target.value
        })
    }

    handleChangeSaleDate = (query: any) => {
        this.setState({
            SaleValidateString: moment(query).format('YYYY-MM-DD')
        })
    }

    // 上传身份证图片1
    imageChangeIDFirst = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingIDFirst: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrlIDFirst: imageUrl,
                    cover_image_IDFirst: info.file.response.data.path,
                    loadingIDFirst: false,
                }),
            );
        }
    };

    //上传身份证图片1前
    beforeUploadIDFirst = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data_data.policy,
                OSSAccessKeyId: this.state.oss_data_data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data_data.signature,
                callback: this.state.oss_data_data.callback,
                host: this.state.oss_data_data.host,
                key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
            }
        })
    }

    // 上传身份证图片2
    imageChangeIDSecond = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingIDSecond: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrlIDSecond: imageUrl,
                    cover_image_IDSecond: info.file.response.data.path,
                    loadingIDSecond: false,
                }),
            );
        }
    };

    //上传身份证图片2前
    beforeUploadIDSecond = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data_data.policy,
                OSSAccessKeyId: this.state.oss_data_data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data_data.signature,
                callback: this.state.oss_data_data.callback,
                host: this.state.oss_data_data.host,
                key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
            }
        })
    }

    // 上传身份证图片3
    imageChangeIDThird = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingIDThird: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrlIDThird: imageUrl,
                    cover_image_IDThird: info.file.response.data.path,
                    loadingIDThird: false,
                }),
            );
        }
    };

    //上传身份证图片3前
    beforeUploadIDThird = () => {
        this.setState({
            oss_data: {
                policy: this.state.oss_data_data.policy,
                OSSAccessKeyId: this.state.oss_data_data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: this.state.oss_data_data.signature,
                callback: this.state.oss_data_data.callback,
                host: this.state.oss_data_data.host,
                key: this.state.oss_data_data.dir + this.randomString(32) + '.png',
            }
        })
    }

    handleChangeIDValidate = (e) => {
        this.setState({
            userIDValidate: e.target.value
        })
    }

    handleChangeIDDate = (query: any) => {
        this.setState({
            userIDValidateString: moment(query).format('YYYY-MM-DD')
        })
    }

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

    sumbit = () => {
        console.log(this.state);

        const {
            storeName,
            storeAddress,
            storeDetailAddress,
            storeTelephone,
            storeEmail,
            categoryDatasId,
            businessDatasId,

            cover_image_StoreHead,
            cover_image_EnvironmentalFirst,
            cover_image_EnvironmentalSecond,
            cover_image_Sale,
            registerNum,
            saleName,
            saleOwn,
            SaleValidate,//0永久 1选择
            SaleValidateString,
            cover_image_IDFirst,
            cover_image_IDSecond,
            cover_image_IDThird,
            userName,
            userIDCard,
            userIDValidate,//0永久 1选择
            userIDValidateString,

            provinceID,
            cityID,
            districtID,
            location,
        } = this.state;



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
            storeDetailAddress,
            storeTelephone,
            storeEmail,
            oss_data,
            imageUrlStoreHead,
            imageUrlEnvironmentalFirst,
            imageUrlEnvironmentalSecond,
            imageUrlSale,
            registerNum,
            saleName,
            saleOwn,
            SaleValidate,
            imageUrlIDFirst,
            imageUrlIDSecond,
            imageUrlIDThird,
            userName,
            userIDCard,
            userIDValidate
        } = this.state;
        const uploadButtonStoreHead = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingStoreHead ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonEnvironmentalFirst = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingEnvironmentalFirst ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonEnvironmentalSecond = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingEnvironmentalSecond ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonSale = (
            <div className={styles.uploadSale}>
                <Icon type={this.state.loadingSale ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonIDFirst = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingIDFirst ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonIDSecond = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingIDSecond ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const uploadButtonIDThird = (
            <div className={styles.uploadDefault}>
                <Icon type={this.state.loadingIDThird ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div>
                <Card title="添加门店" bordered={false} style={{ width: "100%" }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="门店名称">
                            <Input value={storeName} onChange={this.handleChange.bind(this, 'storeName')} />
                        </Form.Item>
                        <Form.Item label="门店地址">
                            <Input value={storeAddress} onChange={this.handleChange.bind(this, 'storeAddress')} />
                            <Button onClick={() => { this.setState({ mapShow: true }) }}>打开地图</Button>
                        </Form.Item>
                        <Form.Item label="详细地址">
                            <Input value={storeDetailAddress} onChange={this.handleChange.bind(this, 'storeDetailAddress')} />
                        </Form.Item>
                        <Form.Item label="门店电话">
                            <Input value={storeTelephone} onChange={this.handleChange.bind(this, 'storeTelephone')} />
                        </Form.Item>
                        <Form.Item label="邮箱">
                            <Input value={storeEmail} onChange={this.handleChange.bind(this, 'storeEmail')} />
                        </Form.Item>
                        <Form.Item label="经营品类">
                            <Select
                                placeholder="请选择"
                                onChange={(value: any, option: any) => this.setState({ categoryDatasId: value })}
                                value={this.state.categoryDatasId}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {
                                    this.state.categoryDatas.map((item: any, index: any) => {
                                        return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="所属商圈">
                            <Select
                                placeholder="请选择"
                                onChange={(value: any, option: any) => this.setState({ businessDatasId: value })}
                                value={this.state.businessDatasId}
                                style={{
                                    width: '100%',
                                }}
                            >
                                {
                                    this.state.businessDatas.map((item: any, index: any) => {
                                        return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="门头图片">
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                                    <Upload
                                        style={{ width: '150px', height: '150px' }}
                                        listType="picture-card"
                                        showUploadList={false}
                                        onChange={this.imageChangeStoreHead}
                                        data={oss_data}
                                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                        beforeUpload={this.beforeUploadStoreHead}
                                    >
                                        {imageUrlStoreHead ? (
                                            <img src={imageUrlStoreHead} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonStoreHead
                                            )}
                                    </Upload>
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item label="环境照">
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                                    <Upload
                                        style={{ width: '150px', height: '150px' }}
                                        listType="picture-card"
                                        showUploadList={false}
                                        onChange={this.imageChangeEnvironmentalFirst}
                                        data={oss_data}
                                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                        beforeUpload={this.beforeUploadEnvironmentalFirst}
                                    >
                                        {imageUrlEnvironmentalFirst ? (
                                            <img src={imageUrlEnvironmentalFirst} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonEnvironmentalFirst
                                            )}
                                    </Upload>
                                </div>
                                <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                                    <Upload
                                        style={{ width: '150px', height: '150px' }}
                                        listType="picture-card"
                                        showUploadList={false}
                                        onChange={this.imageChangeEnvironmentalSecond}
                                        data={oss_data}
                                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                        beforeUpload={this.beforeUploadEnvironmentalSecond}
                                    >
                                        {imageUrlEnvironmentalSecond ? (
                                            <img src={imageUrlEnvironmentalSecond} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonEnvironmentalSecond
                                            )}
                                    </Upload>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="营业执照备案" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="营业执照"></Form.Item>
                        <Form.Item wrapperCol={{ offset: 2 }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '450px', height: '200px', marginRight: '50px' }}>
                                    <Upload
                                        style={{ width: '450px', height: '200px' }}
                                        listType="picture-card"
                                        showUploadList={false}
                                        onChange={this.imageChangeSale}
                                        data={oss_data}
                                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                        beforeUpload={this.beforeUploadSale}
                                    >
                                        {imageUrlSale ? (
                                            <img src={imageUrlSale} alt="avatar" style={{ width: '450px', height: '200px' }} />
                                        ) : (
                                                uploadButtonSale
                                            )}
                                    </Upload>
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item label="注册号">
                            <Input value={registerNum} onChange={this.handleChange.bind(this, 'registerNum')} />
                        </Form.Item>
                        <Form.Item label="执照名称">
                            <Input value={saleName} onChange={this.handleChange.bind(this, 'saleName')} />
                        </Form.Item>
                        <Form.Item label="法人姓名">
                            <Input value={saleOwn} onChange={this.handleChange.bind(this, 'saleOwn')} />
                        </Form.Item>
                        <Form.Item label="有效期">
                            <Radio.Group value={SaleValidate} onChange={this.handleChangeSaleValidate}>
                                <Radio value={0}>永久有效</Radio>
                                <Radio value={1}>选择日期</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            SaleValidate == 1 ? (
                                <Form.Item wrapperCol={{ offset: 2 }}>
                                    <DatePicker onChange={this.handleChangeSaleDate} />
                                </Form.Item>
                            ) : ""
                        }
                    </Form>
                </Card>

                <Card title="法人身份证信息" bordered={false} style={{ width: "100%", marginTop: '20px' }}>
                    <Form {...formItemLayout}
                    >
                        <Form.Item label="身份证照片"></Form.Item>
                        <Form.Item wrapperCol={{ offset: 2 }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                                    <Upload
                                        style={{ width: '150px', height: '150px' }}
                                        listType="picture-card"
                                        showUploadList={false}
                                        onChange={this.imageChangeIDFirst}
                                        data={oss_data}
                                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                        beforeUpload={this.beforeUploadIDFirst}
                                    >
                                        {imageUrlIDFirst ? (
                                            <img src={imageUrlIDFirst} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonIDFirst
                                            )}
                                    </Upload>
                                </div>
                                <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                                    <Upload
                                        style={{ width: '150px', height: '150px' }}
                                        listType="picture-card"
                                        showUploadList={false}
                                        onChange={this.imageChangeIDSecond}
                                        data={oss_data}
                                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                        beforeUpload={this.beforeUploadIDSecond}
                                    >
                                        {imageUrlIDSecond ? (
                                            <img src={imageUrlIDSecond} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonIDSecond
                                            )}
                                    </Upload>
                                </div>
                                <div style={{ width: '150px', height: '150px', marginRight: '50px' }}>
                                    <Upload
                                        style={{ width: '150px', height: '150px' }}
                                        listType="picture-card"
                                        showUploadList={false}
                                        onChange={this.imageChangeIDThird}
                                        data={oss_data}
                                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                                        beforeUpload={this.beforeUploadIDThird}
                                    >
                                        {imageUrlIDThird ? (
                                            <img src={imageUrlIDThird} alt="avatar" style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                                uploadButtonIDThird
                                            )}
                                    </Upload>
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item label="姓名">
                            <Input value={userName} onChange={this.handleChange.bind(this, 'userName')} />
                        </Form.Item>
                        <Form.Item label="身份证号">
                            <Input value={userIDCard} onChange={this.handleChange.bind(this, 'userIDCard')} />
                        </Form.Item>
                        <Form.Item label="有效期">
                            <Radio.Group value={userIDValidate} onChange={this.handleChangeIDValidate}>
                                <Radio value={0}>永久有效</Radio>
                                <Radio value={1}>选择日期</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            userIDValidate == 1 ? (
                                <Form.Item wrapperCol={{ offset: 2 }}>
                                    <DatePicker onChange={this.handleChangeIDDate} />
                                </Form.Item>
                            ) : ""
                        }
                    </Form>
                </Card>

                <Button onClick={() => console.log(this.state)}>提交</Button>

                <Modal
                    className={styles.mapModal}
                    title="Basic Modal"
                    visible={this.state.mapShow}
                    onOk={() => { this.setState({ mapShow: false }) }}
                    onCancel={() => { this.setState({ mapShow: false }) }}
                >
                    <div className={styles.mapContent}>
                        <Cascader className={styles.mapContentInputL} options={this.state.city_list} onChange={this.handleChangeSelcetMap} />
                        <Input className={styles.mapContentInputR} type="text" value={this.state.storeAddress} onChange={(e: any) => { this.setState({ storeAddress: e.target.value }) }} />
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