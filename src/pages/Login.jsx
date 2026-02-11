import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (token) {
    return <Navigate to="/admin/dashboard" />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
      message.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: '#f0f2f5',
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}></div>

        <Card 
            style={{ width: 400, zIndex: 1, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
            title={
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <img src="/diosys.png" alt="logo" style={{ height: '60px', marginBottom: '10px' }} />
                    <h3 style={{ margin: 0, color: '#1b5e20' }}>Admin Login</h3>
                    <small style={{ color: '#888' }}>Diocesan Integrated Operations System</small>
                </div>
            }
        >
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}

            <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Email Address" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block style={{ background: '#1b5e20', borderColor: '#1b5e20' }}>
                        Sign In
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>
  );
};

export default Login;