import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Layout } from 'antd';
const { Header } = Layout;


export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const changeButton = () => {
    setCollapsed(!collapsed)
  }
  return (
    <Header className="site-layout-background" style={{ padding: 0 }} >
      {collapsed?<MenuUnfoldOutlined onClick={changeButton}/>:<MenuFoldOutlined onClick={changeButton}/>}
    </Header>
  )
}
