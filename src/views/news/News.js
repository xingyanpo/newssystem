import axios from 'axios'
import React, { useEffect, useState} from 'react'
import { PageHeader, Card, Col, Row  } from 'antd';

export default function News() {
  const [list, setList] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/news?publishState=2&_expand=category').then(res => {

    })
  }, [])
  return (
    <div>
      <PageHeader title="新闻" subTitle="查看新闻" ></PageHeader>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
