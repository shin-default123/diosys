import React, { useEffect, useState } from 'react';
import { Table, Card, Form, Input, Button, message, Popconfirm, Row, Col } from 'antd';
import { DeleteOutlined, PlusOutlined, BankOutlined } from '@ant-design/icons';
import api from '../../api'; 

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await api.get('/schools'); 
      setSchools(response.data);
    } catch (error) {
      message.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const onFinish = async (values) => {
    try {
      await api.post('/schools', values);
      message.success('School added successfully');
      form.resetFields();
      fetchSchools();
    } catch (error) {
      message.error('Failed to add school');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/schools/${id}`);
      message.success('School deleted');
      fetchSchools();
    } catch (error) {
      message.error('Failed to delete school');
    }
  };

  const columns = [
    {
      title: 'School Name',
      dataIndex: 'name',
      key: 'name',
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
        <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
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
            title={<span><BankOutlined /> Current Schools</span>} 
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Table 
              dataSource={schools} 
              columns={columns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 8 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Add New School" 
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item 
                name="name" 
                label="School Name" 
                rules={[{ required: true, message: 'Please enter school name' }]}
              >
                <Input placeholder="e.g. Father Saturnino Urios University" />
              </Form.Item>

              <Form.Item 
                name="location" 
                label="Location (Optional)"
              >
                <Input placeholder="e.g. Butuan City" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block style={{ background: '#1b5e20' }}>
                  Add School
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default ManageSchools;