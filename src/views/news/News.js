import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List } from 'antd';
import _ from 'lodash'

export default function News() {
  const [list, setList] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/news?publishState=2&_expand=category').then(res => {
      setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
    })
  }, [])
  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <PageHeader title="新闻" subTitle="查看新闻" ></PageHeader>
      <div className="site-card-wrapper" style={{ width: '95%', margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          {
            list.map(item =>
              <Col span={8} key={item[0]}>
                <Card title={item[0]} bordered={false} hoverable={true}>
                  <List size='small' dataSource={item[1]} pagination={{ pageSize: 3 }} renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>} />
                </Card>
              </Col>
            )
          }
        </Row>

      </div>
    </div>
  )
}
