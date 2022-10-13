import React, {useEffect, useState} from 'react'
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import { Table, Tag, Button,Modal, Switch,Popover } from 'antd'
import axios from 'axios';
const {confirm} = Modal 
export default function RightList() {
  const [dataSource, setdataSource] = useState([
  ])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <div><Tag color='orange'>{key}</Tag></div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger type="primary" icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)}></Button>

          <Popover content={<div style={{textAlign: 'center'}}><Switch checked={item.pagepermisson === 1} onChange={()=>switchMethod(item)}></Switch></div>} title="页面配置项" trigger={item.pagepermisson === undefined? '': 'click' }>
           <Button type="primary" icon={<EditOutlined />} disabled={item.pagepermisson === undefined}></Button>
          </Popover>  
          </div>
      }
    },
  ];

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
    console.log(item)
    // 当前页面同步状态 + 后端同步
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }else {
      console.log('二级')
      let list = dataSource.filter(data =>data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach(item => {
        if(item.children.length === 0){
          item.children =''
        }
      })
      setdataSource(list)
    })
  }, [])

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setdataSource([...dataSource])
    if(item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }else {
        axios.patch(`http://localhost:5000/children/${item.id}`, {
          pagepermisson: item.pagepermisson
        })
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}/>;
    </div>
  )
}
