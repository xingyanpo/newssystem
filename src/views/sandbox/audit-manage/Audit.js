import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button,notification,Table } from 'antd'

export default function Audit() {
  const [dataSource, setdataSource] = useState([])
  const {roleId, username, region}  = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor'
    }
    axios.get('/news?auditState=1&_expand=category').then(res => {
      const list = res.data
      console.log(list)
      setdataSource(roleObj[roleId]==='superadmin'? list: [
        ...list.filter(item=>item.username === username),
        ...list.filter(item=> item.region === region && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [roleId, username, region])
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (title,item) => {
        return <a href={ `#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' onClick={()=>handleAudit(item, 2, 1)}>通过</Button>
          <Button danger onClick={()=>handleAudit(item, 3, 0)}>驳回</Button>
          </div>
      }
    },
  ];
  const handleAudit = (item, auditState, pulishState) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      pulishState
    }).then(res => {
      notification.info({
        message: `通知`,
         description:  `你可以在【审核管理 / 审核列表】中查看你的新闻审核状态`,
         placement: 'bottomRight'
      })
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>
    </div>
  )
}
