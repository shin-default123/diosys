import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, Popconfirm, message, Tag, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, TeamOutlined, InfoCircleOutlined } from '@ant-design/icons';
import api from '../../api';

const { Option } = Select;
const { TextArea } = Input;

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const response = await api.get('/venues');
      setVenues(response.data);
    } catch (error) {
      message.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        await api.put(`/venues/${editingId}`, values);
        message.success('Venue updated');
      } else {
        await api.post('/venues', values);
        message.success('Venue added');
      }
      
      setIsModalOpen(false);
      fetchVenues();
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/venues/${id}`);
      message.success('Venue removed');
      fetchVenues();
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
      title: 'Venue Name',
      key: 'name',
      render: (text, record) => (
        <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1b5e20' }}>
                <EnvironmentOutlined /> {record.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.location}</div>
        </div>
      )
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (text) => text ? <span><TeamOutlined /> {text} pax</span> : <span style={{color: '#ccc'}}>-</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
          let color = status === 'Available' ? 'green' : status === 'Under Maintenance' ? 'orange' : 'red';
          return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ color: '#faad14' }} />
            <Popconfirm title="Remove venue?" onConfirm={() => handleDelete(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
        <Card 
            title={<span><EnvironmentOutlined /> Venues & Facilities</span>} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: '#1b5e20' }}>Add Venue</Button>}
            bordered={false}
        >
            <Table dataSource={venues} columns={columns} rowKey="id" loading={loading} />
        </Card>

        <Modal
            title={editingId ? "Edit Venue" : "Add New Venue"}
            open={isModalOpen}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
            okText="Save"
            okButtonProps={{ style: { background: '#1b5e20' } }}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Venue Name" rules={[{ required: true }]}>
                    <Input placeholder="e.g. St. Joseph Cathedral" />
                </Form.Item>
                
                <Form.Item name="description" label="Description">
                    <TextArea rows={2} placeholder="Brief description (e.g. Air-conditioned, Sound System included)" />
                </Form.Item>

                <Form.Item name="location" label="Location / Building">
                    <Input prefix={<EnvironmentOutlined />} placeholder="e.g. Main Building, Ground Floor" />
                </Form.Item>

                <Form.Item name="capacity" label="Seating Capacity">
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="e.g. 500" />
                </Form.Item>

                <Form.Item name="status" label="Availability Status" initialValue="Available">
                    <Select>
                        <Option value="Available">Available</Option>
                        <Option value="Under Maintenance">Under Maintenance</Option>
                        <Option value="Renovation">Renovation</Option>
                        <Option value="Closed">Closed</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default ManageVenues;