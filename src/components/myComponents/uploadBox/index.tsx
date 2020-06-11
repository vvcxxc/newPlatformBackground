import React, { useState, useEffect } from 'react'
import styles from './index.less'
import { Upload, Icon, Modal } from 'antd'
import request from '@/utils/request';
interface Props {
  imgUrl?: string;
  onChange: (path: string) => any;
  title?: string;
  style?: object;
}

/**
 *
 * @param onChange 回调函数返回图片地址
 * @param imgUrl 图片渲染地址（可传可不传）
 * @param title 图片标题
 */
function UploadBox(props: Props) {
  const [imgLoading, setLoading] = useState(false)
  const [imageUrl, setImgUrl] = useState()
  const [previewVisible, setVisible] = useState(false)
  const [previewImage, setPreview] = useState('')
  const [fileList, setFile] = useState([])
  useEffect(() => {
    let data = localStorage.getItem('oss_data')
    if (!data) {
      request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
        let { data } = res;
        localStorage.setItem('oss_data', JSON.stringify(data))
      });
    }
  }, [])

  useEffect(()=> {
    if(props.imgUrl){
      setFile([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/' + props.imgUrl,
      }])
    }
  },[props.imgUrl])

  // 随机数
  const randomString = (len: any) => {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  };

  const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result)
      };
      reader.onerror = error => reject(error);
    });
  }

  const imageChange = (info: any) => {
    let fileList = [...info.fileList];
    if (info.file.status === 'uploading') {
      setLoading(true)
      // return;
    }
    if (info.file.status === 'done') {
      console.log(412412123)
      // let imageUrl = await getBase64(info.file.originFileObj)
      setLoading(false)
      // setImgUrl(info.fileList)
      setFile(fileList)
      props.onChange(info.file.response.data.path)
    }
    setFile(fileList)
  };

  const getData = (file: any) => {
    let res = localStorage.getItem('oss_data')
    if (res) {
      let data = JSON.parse(res)
      let data1 = {
        policy: data.policy,
        OSSAccessKeyId: data.accessid,
        success_action_status: 200, //让服务端返回200,不然，默认会返回204
        signature: data.signature,
        callback: data.callback,
        host: data.host,
        key: data.dir + randomString(32) + '.png',
      }
      return data1
    }
    return
  }


  const uploadButton = (
    <div className={styles.uploadDefault}>
      <Icon type={imgLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">上传图片</div>
    </div>
  );

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setVisible(true)
    setPreview(file.url || file.preview)

  };

  const handleCancel = () => setVisible(false);
  const handleRemove = () => {
    setFile([])
  }

  // const fileList = [{
  //   uid: '-1',
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/'+props.imgUrl,
  // },]

  return (
    <div style={props.style ? props.style : undefined}>
      <Upload
        className={styles.upload}
        listType="picture-card"
        // showUploadList={false}
        fileList={fileList}
        onChange={imageChange}
        showUploadList={{ showDownloadIcon: false }}
        data={getData}
        onPreview={handlePreview}
        onRemove={handleRemove}
        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
      >
        {/* {props.imgUrl ?  (
          <img
            src={'http://tmwl.oss-cn-shenzhen.aliyuncs.com/'+props.imgUrl}
            alt="avatar"
            style={{ width: '84px', height: '84px' }}
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            style={{ width: '84px', height: '84px' }}

          />
        ) : (
            uploadButton
          )} */}
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {
        props.title ? <div className={styles.title}>{props.title}</div> : null
      }
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>

    </div>
  )
}

export default UploadBox
