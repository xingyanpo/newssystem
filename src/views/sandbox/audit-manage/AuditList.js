import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button,notification,Table,Tag } from 'antd'

export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      const list = res.data
      setDataSource(list)
    })
  }, [username])
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['草稿箱', '审核中', '已通过', '未通过']
        return <div><Tag color={colorList[auditState]}>{auditList[auditState]}</Tag></div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {item.auditState === 1 && <Button type="primary" onClick={()=>handleRervert(item)}>撤销</Button>}
          {item.auditState === 2 && <Button type="primary" onClick={()=>handlePublish(item)}>发布</Button>}
          {item.auditState === 3 && <Button type="primary" onClick={()=>handleUpdate(item)}>更新</Button>}
          </div>
      }
    },
  ];
  const handleRervert = (item) => {
    setDataSource(dataSource.filter(data=>data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: '通知',
        description: `你可以到草稿箱中查看`,
        placement: 'bottomRight'
      })
    })
  }
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      'publishState': 2
    }).then(res => {
      props.history.push('/publish-manage/published')
      notification.info({
        message: '通知',
        description: `你可以到【发布管理 / 已发布】中查看你的新闻`,
        placement: 'bottomRight'
      })
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}} rowKey={item => item.id}/>;
    </div>
  )
}
