import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Popconfirm, message, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import api from '../../api';

const { Option } = Select;

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await api.put(`/employees/${editingId}`, values);
        message.success('Employee updated');
      } else {
        await api.post('/employees', values);
        message.success('Employee added');
      }
      
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      message.success('Employee removed');
      fetchEmployees();
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
      title: 'Name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#e6f7ff', padding: '8px', borderRadius: '50%', color: '#1890ff' }}>
                <UserOutlined />
            </div>
            <div>
                <div style={{ fontWeight: 'bold' }}>{record.first_name} {record.last_name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{record.role}</div>
            </div>
        </div>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (text, record) => (
        <div style={{ fontSize: '13px' }}>
            {record.phone && <div><PhoneOutlined /> {record.phone}</div>}
            {record.email && <div><MailOutlined /> {record.email}</div>}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
          let color = status === 'Active' ? 'green' : status === 'On Leave' ? 'orange' : 'red';
          return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ color: '#faad14' }} />
            <Popconfirm title="Remove employee?" onConfirm={() => handleDelete(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
        <Card 
            title={<span><TeamOutlined /> Employee Directory</span>} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: '#1b5e20' }}>Add Employee</Button>}
            bordered={false}
        >
            <Table dataSource={employees} columns={columns} rowKey="id" loading={loading} />
        </Card>

        <Modal
            title={editingId ? "Edit Employee" : "Add New Employee"}
            open={isModalOpen}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
            okText="Save"
            okButtonProps={{ style: { background: '#1b5e20' } }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                
                <Form.Item name="role" label="Role / Position" rules={[{ required: true }]}>
                    <Select placeholder="Select role">
                        <Option value="Priest">Parish Priest / Clergy</Option>
                        <Option value="Secretary">Secretary</Option>
                        <Option value="Treasurer">Treasurer</Option>
                        <Option value="Staff">Support Staff</Option>
                        <Option value="Volunteer">Volunteer</Option>
                        <Option value="Maintenance">Maintenance</Option>
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="phone" label="Phone Number">
                            <Input prefix={<PhoneOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label="Email Address">
                            <Input prefix={<MailOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="status" label="Employment Status" initialValue="Active">
                    <Select>
                        <Option value="Active">Active</Option>
                        <Option value="On Leave">On Leave</Option>
                        <Option value="Inactive">Inactive</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default ManageEmployees;