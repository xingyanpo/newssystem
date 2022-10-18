import React, { useEffect, useRef, useState } from 'react'
import UserForm from '../../../components/user-manage/UserForm';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios';
import RoleList from '../right-manage/RoleList';
const { confirm } = Modal

export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [region, setRegion] = useState([])
  const [role, setRole] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isUpdateDisabled, setIsUpadateDisabled] = useState(false)
  const [current, setCurrent] = useState(0)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger type="primary" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default}></Button>

          <Button type="primary" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)}></Button>
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
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }

  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      const list = res.data
      setdataSource(list)
    })
    axios.get('http://localhost:5000/regions').then(res => {
      const list = res.data
      setRegion(list)
    })
    axios.get('http://localhost:5000/roles').then(res => {
      const list = res.data
      setRole(list)
    })
  }, [])
  const addFormOk = () => {
    addForm.current.validateFields().then(value => {
      setIsOpen(false)
      axios.post(`http://localhost:5000/users`, {
        ...value,
        'roleState': true,
        'default': false
      }).then(res => {
        console.log(res.data)
        setdataSource([
          ...dataSource,
          {
            ...res.data,
            role: RoleList.filter(item => item.id === value.roleId)[0]
          }
        ])
      })
    })
      .catch(err => {
        console.log(err)
      })
  }
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const handleUpdate = async (item) => {
    await setIsUpdateOpen(true)
    if (item.roleId === 1) {
      setIsUpadateDisabled(true)
    } else {
      setIsUpadateDisabled(false)
    }
    updateForm.current.setFieldsValue(item)
    setCurrent(item)
  }
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      setIsUpdateOpen(false)
      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: role.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpadateDisabled(!isUpdateDisabled)
      axios.patch(`http://localhost:5000/users/${current.id}`,value)
    })
  }


  return (
    <div>
      <Button onClick={() => {
        setIsOpen(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />

      <Modal
        open={isOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsOpen(false)
        }}
        onOk={() => {
          addFormOk()
        }}>
        <UserForm region={region} role={role} isOpen={isOpen} ref={addForm}></UserForm>
      </Modal>

      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateOpen(false)
        }}
        onOk={() => {
          updateFormOk()
        }}>
        <UserForm region={region} role={role} isOpen={isOpen} ref={updateForm} isUpdateDisabled={isUpdateDisabled}></UserForm>
      </Modal>
    </div>
  )
}
