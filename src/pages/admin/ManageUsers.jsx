import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../../api';

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await api.put(`/users/${editingId}`, values);
        message.success('User updated');
      } else {
        await api.post('/users', values);
        message.success('User created');
      }
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      message.success('User deleted');
      fetchUsers();
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
    form.setFieldsValue({ ...record, password: '' }); 
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
          <Tag color={role === 'Admin' ? 'gold' : 'blue'}>
              {role === 'Admin' ? <SafetyCertificateOutlined /> : <UserOutlined />} {role}
          </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ color: '#faad14' }} />
            <Popconfirm title="Delete this user?" onConfirm={() => handleDelete(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
        <Card 
            title={<span><UserOutlined /> System Users</span>} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: '#1b5e20' }}>Add New User</Button>}
            bordered={false}
        >
            <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />
        </Card>

        <Modal
            title={editingId ? "Edit User" : "Add New User"}
            open={isModalOpen}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
            okText="Save User"
            okButtonProps={{ style: { background: '#1b5e20' } }}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} />
                </Form.Item>
                
                <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item 
                    name="password" 
                    label={editingId ? "New Password (Leave blank to keep current)" : "Password"} 
                    rules={[{ required: !editingId, min: 6 }]} 
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="role" label="Access Role" initialValue="Staff" rules={[{ required: true }]}>
                    <Select>
                        <Option value="Admin">Admin (Full Access)</Option>
                        <Option value="Secretary">Secretary (Manage Records)</Option>
                        <Option value="Staff">Staff (View Only)</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default ManageUsers;