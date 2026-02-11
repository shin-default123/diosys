import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Alert, Divider, Avatar, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useAuth(); 
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await api.put(`/users/${user.id}`, {
                ...values,
                role: user.role 
            });
            
            message.success({
                content: 'Profile updated successfully!',
                style: { marginTop: '10vh' },
                duration: 3,
            });
            

        } catch (error) {
            message.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ textAlign: 'center', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1b5e20', fontSize: '40px' }} />
                        </div>
                        <h2 style={{ margin: '10px 0 5px 0', color: '#1b5e20' }}>{user?.name}</h2>
                        <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
                            {user?.role}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card title="Edit Profile Details" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Form 
                            form={form} 
                            layout="vertical" 
                            onFinish={onFinish}
                        >
                            <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} size="large" />
                            </Form.Item>

                            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input prefix={<MailOutlined />} size="large" />
                            </Form.Item>

                            <Divider orientation="left" style={{ fontSize: '14px', color: '#888' }}>Change Password</Divider>

                            <Form.Item label="New Password" name="password" rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}>
                                <Input.Password prefix={<LockOutlined />} size="large" placeholder="Enter new password" />
                            </Form.Item>

                            <Form.Item style={{ marginTop: '30px' }}>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading} 
                                    icon={<SaveOutlined />} 
                                    size="large" 
                                    block
                                    style={{ background: '#1b5e20', borderColor: '#1b5e20' }}
                                >
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;