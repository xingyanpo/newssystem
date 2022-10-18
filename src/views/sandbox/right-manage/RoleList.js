import { Table,Button,Modal,Tree } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {DeleteOutlined, EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
const {confirm} = Modal 

export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rightList,setRightList] = useState([])
  const [currentId,setCurrentId] = useState(0)
  const [currentRights,setCurrentRights] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger type="primary" icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)}></Button>

          <Button type="primary" icon={<EditOutlined /> } onClick={()=>{
            setIsModalOpen(true)
            setCurrentRights(item.rights)
            setCurrentId(item.id)
            }}></Button>
          </div>
      }
    }
  ]
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      setdataSource(res.data)
    })
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
  }, [])
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
      axios.delete(`http://localhost:5000/roles/${item.id}`)
  }
  const handleOk = () => {
    setIsModalOpen(false);
    setdataSource(dataSource.map((item)=> {
      if(item.id===currentId) {
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:5000/roles/${currentId}`,{
      rights: currentRights
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck = (checkKeys) => {
    setCurrentRights(checkKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
        checkable
        checkedKeys={currentRights}
        treeData={rightList}
        onCheck = {onCheck}
        checkStrictly = {true}
      />
      </Modal>
    </div>
  )
}
