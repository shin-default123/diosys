import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Switch, message, Divider, Row, Col, Select } from 'antd';
import { SaveOutlined, SettingOutlined, GlobalOutlined } from '@ant-design/icons';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';

const SystemSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { reloadSettings } = useSettings();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        const data = { ...res.data, maintenance_mode: res.data.maintenance_mode === '1' };
        form.setFieldsValue(data);
      } catch (error) {
        message.error('Failed to load settings');
      }
    };
    fetchSettings();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values, maintenance_mode: values.maintenance_mode ? '1' : '0' };
      await api.post('/settings', payload);
      message.success('System settings updated successfully');
      
      reloadSettings();
    } catch (error) {
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
        <Card title={<span><SettingOutlined /> System Configuration</span>} bordered={false}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                
                <h4 style={{ color: '#1b5e20' }}><GlobalOutlined /> Parish Information</h4>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="parish_name" label="Parish Name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="parish_address" label="Address">
                            <Input.TextArea rows={2} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="contact_number" label="Contact Number">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label="Official Email">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <h4 style={{ color: '#1b5e20' }}>System Controls</h4>
                <Row gutter={16} align="middle">
                    <Col span={12}>
                        <Form.Item name="maintenance_mode" label="Maintenance Mode" valuePropName="checked">
                            <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                        </Form.Item>
                        <div style={{ color: '#888', fontSize: '12px', marginTop: '-10px' }}>
                            If ON, the public booking page will be disabled.
                        </div>
                    </Col>
                    
                    <Col span={12}>
                         <Form.Item name="theme_color" label="Theme Preference">
                            <Select>
                                <Select.Option value="light">Light Mode</Select.Option>
                                <Select.Option value="dark">Dark Mode</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} style={{ background: '#1b5e20' }} block>
                        Save Changes
                    </Button>
                </Form.Item>

            </Form>
        </Card>
    </div>
  );
};

export default SystemSettings;