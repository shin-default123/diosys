import React, { useEffect, useState } from 'react';
import { List, Card, Button, Modal, Form, Input, message, Typography, Tooltip } from 'antd';
import { MailOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import api from '../../api';

const { Text } = Typography;

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form] = Form.useForm();

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/email-templates');
      setTemplates(res.data);
    } catch (error) {
      message.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (item) => {
    setEditingTemplate(item);
    form.setFieldsValue(item);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await api.put(`/email-templates/${editingTemplate.id}`, values);
      message.success('Template updated successfully');
      setIsModalOpen(false);
      fetchTemplates();
    } catch (error) {
      message.error('Failed to update template');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
        <Card title={<span><MailOutlined /> Email Notification Templates</span>} bordered={false}>
            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={templates}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(item)}>Edit</Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<div style={{ background: '#e6f7ff', padding: '10px', borderRadius: '50%', color: '#1890ff' }}><MailOutlined /></div>}
                            title={<span style={{ fontWeight: 'bold' }}>{item.name}</span>}
                            description={
                                <div>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Subject: {item.subject}</Text>
                                    <div style={{ color: '#888', fontStyle: 'italic', marginTop: '5px', fontSize: '12px' }}>
                                        {item.body.substring(0, 80)}...
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>

        <Modal
            title={`Edit Template: ${editingTemplate?.name}`}
            open={isModalOpen}
            onOk={handleSave}
            onCancel={() => setIsModalOpen(false)}
            okText="Save Changes"
            okButtonProps={{ style: { background: '#1b5e20' } }}
            width={700}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="subject" label="Email Subject" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item 
                    name="body" 
                    label={
                        <span>
                            Email Content 
                            <Tooltip title="You can use variables like {name}, {date}, {type} to automatically insert data.">
                                <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                            </Tooltip>
                        </span>
                    } 
                    rules={[{ required: true }]}
                >
                    <Input.TextArea rows={8} showCount maxLength={1000} />
                </Form.Item>
                
                <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px', color: '#666' }}>
                    <strong>Available Variables:</strong> {'{name}'}, {'{date}'}, {'{type}'}, {'{venue}'}
                </div>
            </Form>
        </Modal>
    </div>
  );
};

export default EmailTemplates;