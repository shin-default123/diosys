import React, { useEffect, useState } from 'react';
import { Table, Card, Form, Input, Button, message, Popconfirm, Row, Col, Tag } from 'antd';
import { DeleteOutlined, PlusOutlined, SoundOutlined } from '@ant-design/icons';
import api from '../../api';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      message.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onFinish = async (values) => {
    try {
      await api.post('/announcements', {
          content: values.content,
          is_active: true
      });
      message.success('Announcement posted successfully');
      form.resetFields();
      fetchAnnouncements();
    } catch (error) {
      message.error('Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      message.success('Announcement deleted');
      fetchAnnouncements(); 
    } catch (error) {
      message.error('Failed to delete announcement');
    }
  };

  const columns = [
    {
      title: 'Announcement Content',
      dataIndex: 'content',
      key: 'content',
      render: (text) => <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
    },
    {
        title: 'Date Posted',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        render: (date) => date ? new Date(date).toLocaleDateString() : 'Just now'
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm title="Delete this announcement?" onConfirm={() => handleDelete(record.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        
        <Col xs={24} lg={16}>
          <Card 
            title={<span><SoundOutlined /> Active Announcements</span>} 
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Table 
              dataSource={announcements} 
              columns={columns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Post New Announcement" 
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item 
                name="content" 
                label="Message" 
                rules={[{ required: true, message: 'Please write an announcement' }]}
              >
                <Input.TextArea 
                    rows={6} 
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block style={{ background: '#1b5e20' }}>
                  Post Announcement
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default ManageAnnouncements;