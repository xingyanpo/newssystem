import React, { useEffect, useRef, useState } from 'react'
import style from './News.module.css'
import { Button, PageHeader, Steps, Form, Input,Select, message, notification } from 'antd';
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps
const {Option} = Select

export default function NewsAdd(props) {
  const [current, setCurrnet] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const NewsFrom = useRef(null)
  const [formInfo,setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const User = JSON.parse(localStorage.getItem('token'))

  const handlePrevious = () => {
    setCurrnet(current - 1)
  }
  const handleNext = () => {
    if (current === 0) {
      NewsFrom.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrnet(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (content==='' || content.trim() === '<p></p>'){
        message.error('新闻内容不能为空')
      }else {
        setCurrnet(current + 1)
      }
    }
  }

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  };

  useEffect(() => {
    axios.get('news').then(res=> {
      setCategoryList(res.data)
    })
  }, [])
  
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      'content': content,
      'region': User.region ? User.region : '全球',
      'author': User.name,
      'roleId': User.roleId,
      'auditState': auditState,
      'publishState': 0,
      'createTime': Date.now(),
      'star': 0,
      'view': 0,
      'publishTime': 0
    }).then(res=> {
      props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `你可以到${auditState===0? '草稿箱': '审核列表'}中查看你的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="标题、分类" />
        <Step title="内容" description="主体内容" />
        <Step title="提交" description="保存草稿或提交审核" />
      </Steps>

      <div style={{marginTop: '50px'}}>
        <div className={current === 0 ? '' : style.hidden}>
          <Form {...layout} name="control-ref" ref={NewsFrom}>
            <Form.Item name="title" label="新闻标题" rules={[{ required: true ,message: 'Please input your username!'}]}>
              <Input />
            </Form.Item>
            <Form.Item name="categoryId" label="新闻分类" rules={[{ required: true ,message: 'Please input your username!'}]}>
              <Select>
                {
                  categoryList.map(item => 
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                    )
                }
              </Select>
            </Form.Item>

          </Form>
        </div>
        <div className={current === 1 ? '' : style.hidden}>
          <NewsEditor getContent={(value)=> {
            setContent(value)
          }}/>
        </div>
        <div className={current === 2 ? '' : style.hidden}>
          333
        </div>
      </div>
      <div style={{margin: '20px 0'}}>
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
        {current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>}
        {current === 2 && <span><Button type='primary' onClick={()=>{
          handleSave(0)
        }}>保存草稿</Button><Button type='danger' onClick={()=>{
          handleSave(1)
        }}>提交审核</Button></span>}
      </div>
    </div>
  )
}
