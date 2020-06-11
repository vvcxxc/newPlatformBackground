import React, { useState } from 'react'
import styles from './index.less'
import { Input } from 'antd'
interface Props {
  label: string;
  value: any;
  onChange: (value: any) => any;
  placeholder?: string;
}
function InputBox ({label, value, onChange, placeholder}: Props ){
  const inputChange = ( e: any ) =>{
    onChange(e.target.value)
  }

  return (
    <div className={styles.inputBox}>
      <div className={styles.inputLabel}>{label}：</div>
      <Input
        value={value}
        style={{width: '600px'}}
        // size='small'
        onChange={inputChange}
        placeholder={placeholder}
      />
    </div>
  )
}
export default InputBox
