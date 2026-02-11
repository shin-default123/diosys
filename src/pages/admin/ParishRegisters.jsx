import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, DatePicker, Select, InputNumber, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../api';

const { Option } = Select;

const ParishRegisters = () => {
  const location = useLocation();
  const type = location.pathname.split('/').pop(); 
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();


  const config = {
    baptism: {
      title: 'Baptismal Register',
      columns: [
        { title: 'Date', dataIndex: 'date' },
        { title: 'Name', dataIndex: 'name', width: 200 },
        { title: 'Sex', dataIndex: 'sex' },
        { title: 'Parents', render: (r) => `${r.father || '-'} & ${r.mother || '-'}` },
      ],
      fields: (
        <>
            <Form.Item name="name" label="Child's Name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="date" label="Date of Baptism" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="place" label="Place" initialValue="St. Joseph Cathedral"><Input /></Form.Item>
            <div style={{ display: 'flex', gap: 10 }}>
                <Form.Item name="sex" label="Sex" style={{ flex: 1 }}><Select><Option value="Male">Male</Option><Option value="Female">Female</Option></Select></Form.Item>
                <Form.Item name="age" label="Age" style={{ flex: 1 }}><InputNumber style={{ width: '100%' }} /></Form.Item>
            </div>
            <Form.Item name="father" label="Father's Name"><Input /></Form.Item>
            <Form.Item name="mother" label="Mother's Name"><Input /></Form.Item>
            <Form.Item name="grandparents" label="Grandparents"><Input /></Form.Item>
            <Form.Item name="godparents" label="Godparents"><Input.TextArea placeholder="Comma separated" /></Form.Item>
        </>
      )
    },
    confirmation: {
      title: 'Confirmation Register',
      columns: [
        { title: 'Date', dataIndex: 'date' },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Parents', render: (r) => `${r.father || '-'} & ${r.mother || '-'}` },
      ],
      fields: (
        <>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="date" label="Confirmation Date" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="place" label="Place" initialValue="St. Joseph Cathedral"><Input /></Form.Item>
            <Form.Item name="sex" label="Sex"><Select><Option value="Male">Male</Option><Option value="Female">Female</Option></Select></Form.Item>
            <Form.Item name="father" label="Father's Name"><Input /></Form.Item>
            <Form.Item name="mother" label="Mother's Name"><Input /></Form.Item>
            <Form.Item name="godparents" label="Godparents"><Input.TextArea /></Form.Item>
        </>
      )
    },
    marriage: {
      title: 'Marriage Register',
      columns: [
        { title: 'Date', dataIndex: 'date' },
        { title: 'Husband', dataIndex: 'husband_name' },
        { title: 'Wife', dataIndex: 'wife_name' },
      ],
      fields: (
        <>
            <Form.Item name="date" label="Marriage Date" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="place" label="Place" initialValue="St. Joseph Cathedral"><Input /></Form.Item>
            
            <div style={{ border: '1px solid #d9d9d9', padding: '15px', marginBottom: '15px', borderRadius: '8px', background: '#fafafa' }}>
                <strong style={{ display: 'block', marginBottom: '10px', color: '#1b5e20' }}>Groom's Details</strong>
                <Form.Item name="husband_name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Form.Item name="husband_father" label="Father" style={{ flex: 1 }}><Input /></Form.Item>
                    <Form.Item name="husband_mother" label="Mother" style={{ flex: 1 }}><Input /></Form.Item>
                </div>
                <Form.Item name="husband_grandparents" label="Grandparents"><Input /></Form.Item>
            </div>

            <div style={{ border: '1px solid #d9d9d9', padding: '15px', marginBottom: '15px', borderRadius: '8px', background: '#fafafa' }}>
                <strong style={{ display: 'block', marginBottom: '10px', color: '#1b5e20' }}>Bride's Details</strong>
                <Form.Item name="wife_name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Form.Item name="wife_father" label="Father" style={{ flex: 1 }}><Input /></Form.Item>
                    <Form.Item name="wife_mother" label="Mother" style={{ flex: 1 }}><Input /></Form.Item>
                </div>
                <Form.Item name="wife_grandparents" label="Grandparents"><Input /></Form.Item>
            </div>

            <Form.Item name="godparents" label="Witnesses/Godparents"><Input.TextArea /></Form.Item>
        </>
      )
    },
    death: {
        title: 'Death Register',
        columns: [
          { title: 'Date', dataIndex: 'date' },
          { title: 'Name', dataIndex: 'name' },
          { title: 'Cause', dataIndex: 'cause_of_death' },
          { title: 'Age', dataIndex: 'age' },
        ],
        fields: (
          <>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="date" label="Date of Death" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
              <Form.Item name="place" label="Place of Death"><Input /></Form.Item>
              
              <div style={{ display: 'flex', gap: 10 }}>
                <Form.Item name="age" label="Age" style={{ flex: 1 }}><InputNumber style={{ width: '100%' }} /></Form.Item>
                <Form.Item name="sex" label="Sex" style={{ flex: 1 }}><Select><Option value="Male">Male</Option><Option value="Female">Female</Option></Select></Form.Item>
              </div>

              <Form.Item name="cause_of_death" label="Cause of Death"><Input /></Form.Item>
              <Form.Item name="occupation" label="Occupation"><Input /></Form.Item>
              <Form.Item name="spouse" label="Spouse (if married)"><Input /></Form.Item>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                  <Form.Item name="surviving_children" label="Surviving Children"><Input.TextArea rows={2} placeholder="List names separated by comma" /></Form.Item>
                  <div style={{ display: 'flex', gap: 10 }}>
                      <Form.Item name="father" label="Father" style={{ flex: 1 }}><Input /></Form.Item>
                      <Form.Item name="mother" label="Mother" style={{ flex: 1 }}><Input /></Form.Item>
                  </div>
                  <Form.Item name="grandparents" label="Grandparents"><Input /></Form.Item>
              </div>
          </>
        )
      }
  };

  const currentConfig = config[type] || config.baptism; 

  const fetchData = async () => {
    setLoading(true);
    try {
        const res = await api.get(`/registers/${type}`);
        setData(res.data);
    } catch (err) {
        message.error("Failed to load records");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]); 

  const handleSave = async () => {
      try {
          const values = await form.validateFields();
          const payload = { ...values, date: values.date.format('YYYY-MM-DD') };
          
          if (editingId) {
              await api.put(`/registers/${type}/${editingId}`, payload);
              message.success('Record updated');
          } else {
              await api.post(`/registers/${type}`, payload);
              message.success('Record created');
          }
          setIsModalOpen(false);
          fetchData();
      } catch (err) {
          message.error('Failed to save record');
      }
  };

  const handleDelete = async (id) => {
      try {
          await api.delete(`/registers/${type}/${id}`);
          message.success('Deleted');
          fetchData();
      } catch (err) {
          message.error('Failed to delete');
      }
  };

  const openEdit = (record) => {
      setEditingId(record.id);
      form.setFieldsValue({
          ...record,
          date: dayjs(record.date)
      });
      setIsModalOpen(true);
  };

  const openAdd = () => {
      setEditingId(null);
      form.resetFields();
      setIsModalOpen(true);
  };

  const tableColumns = [
      ...currentConfig.columns,
      {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <>
                <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            </>
          )
      }
  ];

  return (
    <div style={{ padding: 24 }}>
        <Card 
            title={<span><BookOutlined /> {currentConfig.title}</span>} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: '#1b5e20' }}>Add Record</Button>}
            bordered={false}
        >
            <Table dataSource={data} columns={tableColumns} rowKey="id" loading={loading} />
        </Card>

        <Modal
            title={editingId ? `Edit ${currentConfig.title} Record` : `Add ${currentConfig.title} Record`}
            open={isModalOpen}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
            okText="Save Record"
            okButtonProps={{ style: { background: '#1b5e20' } }}
        >
            <Form form={form} layout="vertical">
                {currentConfig.fields}
            </Form>
        </Modal>
    </div>
  );
};

export default ParishRegisters;