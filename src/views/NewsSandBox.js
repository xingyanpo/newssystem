import { Layout } from 'antd'
import './NewsSandBox.css'
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import SideMenu from '../components/sandbox/SideMenu'
import TopHeader from '../components/sandbox/TopHeader'
import Home from './sandbox/home/Home'
import Nopermission from './sandbox/nopermission/Nopermission'
import RightList from './sandbox/right-manage/RightList'
import RoleList from './sandbox/right-manage/RoleList'
import UserList from './sandbox/user-manage/UserList'
const { Content } = Layout;

export default function NewsSandBox() {
  return (
    <Layout>
      <SideMenu></SideMenu>

      <Layout className="site-layout">
        <TopHeader></TopHeader>

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}>
        <Switch>
          <Route path={'/home'} component={Home} />
          <Route path={'/user-manage/list'} component={UserList} />
          <Route path={'/right-manage/role/list'} component={RoleList} />
          <Route path={'/right-manage/right/list'} component={RightList} />
          <Redirect from='/' to={'/home'} exact /> {/* exact 精确匹配 */}
          <Route path={'*'} component={Nopermission} />
        </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
