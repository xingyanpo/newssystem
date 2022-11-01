import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Home from '../../views/sandbox/home/Home'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import NewPreview from '../../views/sandbox/news-manage/NewPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import { Spin } from 'antd'
import { connect } from 'react-redux'

const LocalRouterMap = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': RightList,
  '/news-manage/add': NewsAdd,
  '/news-manage/draft': NewsDraft,
  '/news-manage/category': NewsCategory,
  '/audit-manage/audit': Audit,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset,
  "/news-manage/preview/:id": NewPreview,
  "/news-manage/update/:id": NewsUpdate
}

function NewsRouter(props) {
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res => {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  return (
    <Spin size='large' spinning={props.isLoading}>
      <Switch>
        {
          BackRouteList.map(item => {
            if (checkRoute(item) && checkUserPermission(item)) {
              return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
            } else {
              return null
            }
          }
          )
        }
        <Redirect from='/' to={'/home'} exact /> {/* exact 精确匹配 */}
        {BackRouteList.length > 0 && <Route path={'*'} component={Nopermission} />}
      </Switch>
    </Spin>
  )
}
const mapStateToProps = ({LoadingReducer: {isLoading}}) => {
  return {
    isLoading
  }
}
export default connect(mapStateToProps)(NewsRouter)