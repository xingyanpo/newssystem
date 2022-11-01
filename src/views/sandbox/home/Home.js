import { Card, Col, List, Avatar, Row, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [allList, setAllList] = useState([])
  const [visible, setVisible] = useState(false)
  const [piechart, setPiechart] = useState(null)

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setViewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setStarList(res.data)
    })
  }, [])

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  const ref = useRef()
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      setAllList(res.data)
      renderBarView(_.groupBy(res.data, item => item.category.title))
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj) => {
    var myChart = echarts.init(ref.current);
    // 绘制图表
    myChart.setOption({
      title: {
        text: '分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: { rotate: '45', interval: 0 }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    });
    window.onresize = () => {
      myChart.resize()
    }
  }

  const pieRef = useRef()
  const renderPieView = (obj) => {
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for(var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    } 
    var myChart;
    if (!piechart) {
      myChart = echarts.init(pieRef.current);
      setPiechart(myChart)
    } else {
      myChart = piechart
    }
    var option;

    option = {
      title: {
        text: '当前用户分类图示',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={24}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                size="small"
                dataSource={viewList}
                renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                size="small"
                dataSource={starList}
                renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={() => {
                  (async () => {
                    await setVisible(true)
                    renderPieView()
                  })()
                }} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <div>
                    <b>{region ? region : '全球'}</b>
                    <span style={{ paddingLeft: '5px' }}>{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Drawer width='500px' title="个人分类" placement="right" closable={true} onClose={() => {
        setVisible(false)
      }} open={visible}>
        <div ref={pieRef} style={{ width: '100%', height: '600px', marginTop: '50px' }}></div>
      </Drawer>

      <div ref={ref} style={{ width: '100%', height: '600px', marginTop: '50px' }}></div>
    </div>
  )
}
