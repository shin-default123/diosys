import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Tag, Popconfirm, Modal, Form, DatePicker, TimePicker, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, BookOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api'; 

const { Option } = Select;

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [form] = Form.useForm();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      message.success(`Booking ${status}`);
      fetchBookings(); 
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const openEditModal = (record) => {
    setEditingBooking(record);
    form.setFieldsValue({
        date: dayjs(record.date), 
        time: dayjs(record.time, 'h:mm A'), 
        venue: record.venue
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
        const values = await form.validateFields();
        
        const payload = {
            date: values.date.format('YYYY-MM-DD'),
            time: values.time.format('h:mm A'),
            venue: values.venue
        };

        await api.put(`/bookings/${editingBooking.id}`, payload);
        
        message.success('Booking details updated');
        setIsModalOpen(false);
        setEditingBooking(null);
        fetchBookings(); 
    } catch (error) {
        console.error(error);
        message.error('Failed to update details');
    }
  };

  const columns = [
    {
      title: 'Event Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Requested Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'Requester',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
            <div>
                <div>{text}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{record.phone}</div>
            </div>
        )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Pending' ? 'orange' : status === 'Approved' ? 'green' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            
            {record.status === 'Pending' && (
                <Button 
                    icon={<EditOutlined />} 
                    size="small" 
                    onClick={() => openEditModal(record)}
                    title="Edit Details"
                />
            )}

            {record.status === 'Pending' && (
                <>
                    <Popconfirm title="Approve this booking?" onConfirm={() => handleStatus(record.id, 'Approved')}>
                        <Button type="primary" size="small" icon={<CheckCircleOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }} />
                    </Popconfirm>
                    
                    <Popconfirm title="Reject this booking?" onConfirm={() => handleStatus(record.id, 'Rejected')}>
                        <Button type="primary" danger size="small" icon={<CloseCircleOutlined />} />
                    </Popconfirm>
                </>
            )}

            {record.status === 'Approved' && <span style={{ color: 'green', fontSize: '12px' }}>Scheduled</span>}
            {record.status === 'Rejected' && <span style={{ color: 'red', fontSize: '12px' }}>Closed</span>}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
        <Card 
            title={<span><BookOutlined /> Booking Requests</span>} 
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
            <Table 
                dataSource={bookings} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 8 }}
            />
        </Card>

        <Modal
            title="Edit Booking Request"
            open={isModalOpen}
            onOk={handleEditSubmit}
            onCancel={() => setIsModalOpen(false)}
            okText="Update Details"
            okButtonProps={{ style: { background: '#1b5e20' } }}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="date" label="Requested Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.Item name="time" label="Requested Time" rules={[{ required: true }]}>
                    <TimePicker use12Hours format="h:mm A" style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.Item name="venue" label="Venue">
                    <Select>
                        <Option value="St. Joseph Cathedral">St. Joseph Cathedral</Option>
                        <Option value="Parish Hall">Parish Hall</Option>
                        <Option value="Chapel">Chapel</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default ManageBookings;