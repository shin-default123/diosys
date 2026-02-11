import React, { useEffect, useState } from 'react';
import { Table, Card, Form, Input, Button, message, Popconfirm, Row, Col } from 'antd';
import { DeleteOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import api from '../../api'; 

const ManageParish = () => {
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchParishes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/parishes');
      setParishes(response.data);
    } catch (error) {
      message.error('Failed to load parishes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParishes();
  }, []);

  const onFinish = async (values) => {
    try {
      await api.post('/parishes', values);
      message.success('Parish added successfully');
      form.resetFields();
      fetchParishes(); 
    } catch (error) {
      message.error('Failed to add parish');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/parishes/${id}`);
      message.success('Parish deleted');
      fetchParishes(); 
    } catch (error) {
      message.error('Failed to delete parish');
    }
  };

  // Table Columns
  const columns = [
    {
      title: 'Parish Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
        title: 'Priest',
        dataIndex: 'priest',
        key: 'priest',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Delete this parish?" onConfirm={() => handleDelete(record.id)}>
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
            title={<span><HomeOutlined /> Current Parishes</span>} 
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Table 
              dataSource={parishes} 
              columns={columns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 6 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Add New Parish" 
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item 
                name="name" 
                label="Parish Name" 
                rules={[{ required: true, message: 'Please enter parish name' }]}
              >
                <Input placeholder="e.g. St. James the Great Parish" />
              </Form.Item>

              <Form.Item 
                name="priest" 
                label="Priest (Optional)"
              >
                <Input placeholder="e.g. Fr. Juan dela Cruz" />
              </Form.Item>

              <Form.Item 
                name="location" 
                label="Location (Optional)"
              >
                <Input placeholder="e.g. Buenavista" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block style={{ background: '#1b5e20' }}>
                  Add Parish
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default ManageParish;