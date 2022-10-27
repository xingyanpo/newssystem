import { Table,Button,Modal, notification} from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {DeleteOutlined, EditOutlined,ExclamationCircleOutlined,UploadOutlined} from '@ant-design/icons'
const {confirm} = Modal 

export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
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
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger type="primary" icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)}></Button>
          <Button icon={<EditOutlined/> } onClick={()=>{
            props.history.push(`/news-manage/update/${item.id}`)
          }}></Button>
          <Button type="primary" icon={<UploadOutlined /> } onClick={()=>handleCheck(item.id)}></Button>
          </div>
      }
    }
  ]
  const {username} = JSON.parse(localStorage.getItem('token'))

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {auditState: 1}).then(res=> {
      props.history.push('/audit-manage/list')

        notification.info({
            message: `通知`,
            description:
              `您可以到审核列表中查看您的新闻`,
            placement:"bottomRight"
        });
    })
  }
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username])

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        
      },
    });
  }
  const deleteMethod = (item) => {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/news/${item.id}`)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      
    </div>
  )
}
