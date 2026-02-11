import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, DatePicker, Select, InputNumber, message, Row, Col, Statistic, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import api from '../../api';
import dayjs from 'dayjs';

const { Option } = Select;

const Income = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, totalRes] = await Promise.all([
          api.get('/incomes'),
          api.get('/incomes/total')
      ]);
      setData(listRes.data);
      setTotal(totalRes.data.total);
    } catch (error) {
      message.error('Failed to load income data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          recorded_by: 'Admin' 
      };
      
      await api.post('/incomes', payload);
      message.success('Income recorded');
      setIsModalOpen(false);
      form.resetFields();
      fetchData(); 
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/incomes/${id}`);
      message.success('Record deleted');
      fetchData();
    } catch (error) {
        message.error('Failed to delete');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Source / Category',
      dataIndex: 'source',
      key: 'source',
      render: (text) => <span style={{ fontWeight: '500', color: '#1b5e20' }}>{text}</span>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span style={{ color: '#666' }}>{text || '-'}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => (
        <span style={{ fontWeight: 'bold' }}>
            ₱ {parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: 'Recorded By',
      dataIndex: 'recorded_by',
      key: 'recorded_by',
      width: 150,
      render: (text) => <span style={{ fontSize: '12px', color: '#888' }}>{text}</span>
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm title="Delete record?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
        
        <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col xs={24} md={8}>
                <Card bordered={false} style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #43a047 100%)', color: 'white' }}>
                    <Statistic 
                        title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Recorded Income</span>} 
                        value={total} 
                        precision={2} 
                        prefix="₱" 
                        valueStyle={{ color: 'white', fontWeight: 'bold' }}
                        suffix={<RiseOutlined />}
                    />
                </Card>
            </Col>
        </Row>

        <Card 
            title={<span><DollarOutlined /> Income Records</span>} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ background: '#1b5e20' }}>Record Income</Button>}
            bordered={false}
        >
            <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
        </Card>

        <Modal
            title="Record New Income"
            open={isModalOpen}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
            okText="Save Record"
            okButtonProps={{ style: { background: '#1b5e20' } }}
        >
            <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
                <Form.Item name="date" label="Date Received" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="source" label="Source of Funds" rules={[{ required: true }]}>
                    <Select placeholder="Select category">
                        <Option value="Sunday Collection">Sunday Mass Collection</Option>
                        <Option value="Baptism Stipend">Baptism Stipend</Option>
                        <Option value="Wedding Stipend">Wedding Stipend</Option>
                        <Option value="Donation">Private Donation</Option>
                        <Option value="Fundraising">Fundraising Event</Option>
                        <Option value="Certificates">Certificate Issuance Fees</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="amount" label="Amount (PHP)" rules={[{ required: true }]}>
                    <InputNumber 
                        style={{ width: '100%' }} 
                        formatter={value => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\₱\s?|(,*)/g, '')}
                        min={0}
                    />
                </Form.Item>

                <Form.Item name="description" label="Remarks / Description">
                    <Input.TextArea rows={2} placeholder="e.g. 2nd Collection for Seminary Fund" />
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default Income;