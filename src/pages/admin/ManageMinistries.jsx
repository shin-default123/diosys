import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '../../api';

const { Option } = Select;
const { TextArea } = Input;

const ManageMinistries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchMinistries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ministries');
      setMinistries(response.data);
    } catch (error) {
      message.error('Failed to load ministries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await api.put(`/ministries/${editingId}`, values);
        message.success('Ministry updated');
      } else {
        await api.post('/ministries', values);
        message.success('Ministry added');
      }
      
      setIsModalOpen(false);
      fetchMinistries();
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ministries/${id}`);
      message.success('Ministry removed');
      fetchMinistries();
    } catch (error) {
      message.error('Failed to delete');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Ministry / Organization',
      key: 'name',
      render: (text, record) => (
        <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1b5e20' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: 'Coordinator',
      dataIndex: 'coordinator',
      key: 'coordinator',
      render: (text) => <span><UserOutlined /> {text}</span>
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (text) => text ? <span><ClockCircleOutlined /> {text}</span> : <span style={{color: '#ccc'}}>TBA</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
          <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ color: '#faad14' }} />
            <Popconfirm title="Remove ministry?" onConfirm={() => handleDelete(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
        <Card 
            title={<span><TeamOutlined /> Parish Ministries & Organizations</span>} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: '#1b5e20' }}>Add Ministry</Button>}
            bordered={false}
        >
            <Table dataSource={ministries} columns={columns} rowKey="id" loading={loading} />
        </Card>

        <Modal
            title={editingId ? "Edit Ministry" : "Add New Ministry"}
            open={isModalOpen}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
            okText="Save"
            okButtonProps={{ style: { background: '#1b5e20' } }}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Ministry Name" rules={[{ required: true }]}>
                    <Input placeholder="e.g. Youth Ministry" />
                </Form.Item>
                
                <Form.Item name="description" label="Description">
                    <TextArea rows={2} placeholder="Brief description of goals/activities" />
                </Form.Item>

                <Form.Item name="coordinator" label="Coordinator / Head" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} placeholder="e.g. Bro. Juan Dela Cruz" />
                </Form.Item>

                <Form.Item name="schedule" label="Regular Meeting Schedule">
                    <Input prefix={<ClockCircleOutlined />} placeholder="e.g. Every Sunday 3:00 PM" />
                </Form.Item>

                <Form.Item name="status" label="Status" initialValue="Active">
                    <Select>
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default ManageMinistries;