import React from 'react'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import {connect} from 'react-redux'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
const { Header } = Layout;


function TopHeader(props) {
  const changeButton = () => {
    props.changeCollapsed()
  }
  const {role: {roleName}, username} = JSON.parse(localStorage.getItem('token')) 
  const menu = (
    <Menu>
      <Menu.Item>
        {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={() => {
        localStorage.removeItem('token')
        props.history.replace('login')
      }}>退出</Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: 0 }} >
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeButton} /> : <MenuFoldOutlined onClick={changeButton} />}

      <div style={{ float: "right" ,marginRight:'10px'}}>
        <span>欢迎<span style={{color: '#1890ff'}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({CollApsedReducer: {isCollapsed}}) => {
  return {
    isCollapsed
  }
}
const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collapsed',
      // payload
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))