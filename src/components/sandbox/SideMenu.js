
import { Layout, Menu } from 'antd';
import {UserOutlined, ProfileOutlined} from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import SubMenu from 'antd/lib/menu/SubMenu';
import { withRouter } from 'react-router-dom';
const { Sider } = Layout;
function SideMenu(props) {
  const navIcons = {
    // 一级
    '/home': <ProfileOutlined />,
    "/user-manage": <ProfileOutlined />,
    "/right-manage": <ProfileOutlined />,
    "/news-manage": <ProfileOutlined />,
    "/audit-manage": <ProfileOutlined />,
    "/publish-manage": <ProfileOutlined />,
    // 二级
    '/user-manage/list': <UserOutlined />,
    '/right-manage/role/list': <UserOutlined />,
    '/right-manage/right/list': <UserOutlined />,
    '/news-manage/add': <UserOutlined />,
    '/news-manage/draft': <UserOutlined />,
    '/news-manage/category': <UserOutlined />,
    '/audit-manage/audit': <UserOutlined />,
    '/audit-manage/list': <UserOutlined />,
    '/publish-manage/unpublished': <UserOutlined />,
    '/publish-manage/published': <UserOutlined />,
    '/publish-manage/sunset': <UserOutlined />
  }
  
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={navIcons[item.key]} title={item.title}>
        { renderMenu(item.children) }
     </SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={navIcons[item.key]} title={item.title} onClick={() => {
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }
  const [menuList, setMenuList] = useState([])
  useEffect(() => {
    fetch('http://localhost:5000/rights?_embed=children').then(res => res.json()).then(res => {
      setMenuList(res)
    })
  }, [])
  const selectKeys = [props.location.pathname]
  const openKeys = ['/' + props.location.pathname.split('/')[1]]

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="sidemenu-title">Backstage Management System</div>
        <div style={{ flex: '1', overflow: 'auto' }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(menuList)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)