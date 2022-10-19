import { Layout } from 'antd'
import './NewsSandBox.css'
import React, { useEffect } from 'react'
import SideMenu from '../components/sandbox/SideMenu'
import TopHeader from '../components/sandbox/TopHeader'
import NewsRouter from './sandbox/NewsRouter'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const { Content } = Layout;

export default function NewsSandBox() {
  NProgress.start()
  useEffect(()=> {
    NProgress.done()
  })
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
            overflow:'auto'
          }}>
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
