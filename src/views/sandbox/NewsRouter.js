import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Audit from './audit-manage/Audit'
import AuditList from './audit-manage/AuditList'
import Home from './home/Home'
import NewsAdd from './news-manage/NewsAdd'
import NewsCategory from './news-manage/NewsCategory'
import NewsDraft from './news-manage/NewsDraft'
import Nopermission from './nopermission/Nopermission'
import Published from './publish-manage/Published'
import Sunset from './publish-manage/Sunset'
import Unpublished from './publish-manage/Unpublished'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import UserList from './user-manage/UserList'

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
  '/publish-manage/sunset': Sunset
}

export default function NewsRouter() {
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(()=>{
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(res=> {
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && item.pagepermisson
  }
  const {role: {rights}} = JSON.parse(localStorage.getItem('token'))
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  return (
    <Switch>
      {
        BackRouteList.map(item => 
          {
            if (checkRoute(item) && checkUserPermission(item)) {
              return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact/>
            } else {
              return null
            }
          }
          )
      }

      <Redirect from='/' to={'/home'} exact /> {/* exact 精确匹配 */}
      {BackRouteList.length > 0 && <Route path={'*'} component={Nopermission} />}
    </Switch>
  )
}
