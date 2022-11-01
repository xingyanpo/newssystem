import { notification } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

function usePublish(type) {
  const [dataSource, setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username, type])

  const handleSunset = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`/news/${id}`, {
      'publishState': 3
    }).then(() => {
      notification.info({
        message: '通知',
        description: `你可以到【发布管理 / 已下线】中查看你的新闻`,
        placement: 'bottomRight'
      })
    })
  }
  const handlePublish = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`/news/${id}`, {
      'publishState': 2,
      'publishTime': Date.now()
    }).then(() => {
      notification.info({
        message: '通知',
        description: `你可以到【发布管理 / 已发布】中查看你的新闻`,
        placement: 'bottomRight'
      })
    })
  }
  const handleDelete = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id))
    axios.delete(`/news/${id}`).then(() => {
      notification.info({
        message: '通知',
        description: `你已经删除了已下线的新闻`,
        placement: 'bottomRight'
      })
    })
  }

  return {
    dataSource,
    handleSunset,
    handlePublish,
    handleDelete
  }
}

export default usePublish