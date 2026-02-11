import React, { useEffect, useState } from 'react';
import { Table, Card, Form, Input, Button, message, Popconfirm, Row, Col, Select, DatePicker, TimePicker } from 'antd';
import { DeleteOutlined, PlusOutlined, CalendarOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../../api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Option } = Select;

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [editingId, setEditingId] = useState(null); 
  const [form] = Form.useForm();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      message.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleEdit = (record) => {
    if (!record.id) {
        message.error("Error: This schedule is missing an ID.");
        return;
    }

    setEditingId(record.id);
    
    form.setFieldsValue({
        type: record.type,
        date: record.date ? dayjs(record.date) : null,
        time: record.time ? dayjs(record.time, 'h:mm A') : null,
        place: record.place,
        priest: record.priest
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('h:mm A'), 
      };

      if (editingId) {
        await api.put(`/schedules/${editingId}`, formattedValues);
        message.success('Schedule updated successfully');
        handleCancelEdit(); 
      } else {
        await api.post('/schedules', formattedValues);
        message.success('Schedule added successfully');
        form.resetFields();
      }

      fetchSchedules();
    } catch (error) {
      message.error(editingId ? 'Failed to update' : 'Failed to add');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    try {
      await api.delete(`/schedules/${id}`);
      message.success('Deleted');
      if (editingId === id) handleCancelEdit(); 
      fetchSchedules();
    } catch (error) {
      message.error('Failed to delete');
    }
  };

  const columns = [
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
    { 
        title: 'Time', 
        dataIndex: 'time', 
        key: 'time', 
        width: 100,
        render: (text) => <span style={{ color: '#1b5e20', fontWeight: 'bold' }}>{text}</span>
    },
    { title: 'Place', dataIndex: 'place', key: 'place' },
    { title: 'Priest', dataIndex: 'priest', key: 'priest' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
                type="text" 
                icon={<EditOutlined />} 
                style={{ color: '#faad14' }} 
                onClick={(e) => {
                    e.stopPropagation(); 
                    handleEdit(record);
                }}
            />
            <Popconfirm 
                title="Delete?" 
                onConfirm={(e) => handleDelete(e, record.id)}
                onCancel={(e) => e?.stopPropagation()}
            >
                <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={(e) => e.stopPropagation()} 
                />
            </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title={<span><CalendarOutlined /> Current Schedules</span>} bordered={false}>
            <Table 
                dataSource={schedules} 
                columns={columns} 
                rowKey="id" 
                loading={loading} 
                onRow={(record) => ({
                    onClick: () => handleEdit(record),
                    style: { cursor: 'pointer' }
                })}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={editingId ? "Edit Schedule" : "Add Schedule"} 
            bordered={false}
            extra={editingId && (
                <Button type="text" size="small" onClick={handleCancelEdit} icon={<CloseOutlined />}>
                    Cancel
                </Button>
            )}
            headStyle={{ background: editingId ? '#fffbe6' : 'white' }}
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              
              <Form.Item name="type" label="Event Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Option value="Matrimony">Matrimony</Option>
                  <Option value="Baptism">Baptism</Option>
                  <Option value="Confirmation">Confirmation</Option>
                  <Option value="Memorial">Memorial</Option>
                  <Option value="Conversion">Conversion</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="time" label="Time" rules={[{ required: true }]}>
                        <TimePicker use12Hours format="h:mm A" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
              </Row>

              <Form.Item name="place" label="Place" rules={[{ required: true }]}>
                <Input placeholder="e.g. St. Joseph Cathedral" />
              </Form.Item>

              <Form.Item name="priest" label="Priest">
                <Input placeholder="e.g. Fr. Michael Carter" />
              </Form.Item>

              <Form.Item>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={editingId ? <EditOutlined /> : <PlusOutlined />} 
                    block 
                    style={{ 
                        background: editingId ? '#faad14' : '#1b5e20', 
                        borderColor: editingId ? '#faad14' : '#1b5e20' 
                    }}
                >
                  {editingId ? "Update Schedule" : "Add Schedule"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManageSchedules;