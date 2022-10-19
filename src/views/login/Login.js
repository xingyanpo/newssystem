import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import './Login.css'
import axios from 'axios';

export default function Login(props) {
  const onFinish = (values) => {
    console.log(values)
    axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).
    then(res=> {
      console.log(res.data);
      if (res.data.length === 0) {
        message.error('用户名或密码不匹配')
      }else {
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        props.history.push('/')
      }
    })
  }
  return (
    <div style={{ backgroundColor: 'rgb(35, 39, 65)', height: '100%' }}>
      <div className='formContainer'>
        <div className='login-title'></div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
