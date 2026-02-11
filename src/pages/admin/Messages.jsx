import React, { useEffect, useState, useRef } from 'react';
import { Layout, List, Avatar, Input, Button, Card, Badge, Spin } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

const { Sider, Content } = Layout;

const Messages = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        api.get('/messages/users').then(res => setUsers(res.data));
    }, []);

    // Load Conversation when user selected
    useEffect(() => {
        if (selectedUser) {
            setLoading(true);
            api.get(`/messages/${selectedUser.id}`).then(res => {
                setMessages(res.data);
                setLoading(false);
                scrollToBottom();
            });
            // Polling interval for real-time updates (every 5 seconds)
            const interval = setInterval(() => {
                 api.get(`/messages/${selectedUser.id}`).then(res => setMessages(res.data));
            }, 5000); 
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!inputText.trim() || !selectedUser) return;
        
        const payload = {
            receiver_id: selectedUser.id,
            message: inputText
        };

        const newMessage = {
            id: Date.now(),
            sender_id: user.id,
            message: inputText,
            created_at: new Date().toISOString()
        };
        setMessages([...messages, newMessage]);
        setInputText('');
        scrollToBottom();

        await api.post('/messages', payload);
    };

    return (
        <Layout style={{ height: '80vh', background: '#fff', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
            <Sider width={300} theme="light" style={{ borderRight: '1px solid #e8e8e8' }}>
                <div style={{ padding: '15px', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold' }}>
                    Conversations
                </div>
                <div style={{ overflowY: 'auto', height: 'calc(100% - 50px)' }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={users}
                        renderItem={item => (
                            <List.Item 
                                style={{ 
                                    padding: '15px', 
                                    cursor: 'pointer',
                                    background: selectedUser?.id === item.id ? '#e6f7ff' : 'transparent'
                                }}
                                onClick={() => setSelectedUser(item)}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={item.name}
                                    description={<span style={{ fontSize: '12px' }}>{item.role}</span>}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Sider>
            <Content style={{ display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <>
                        <div style={{ padding: '15px', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold' }}>
                            {selectedUser.name}
                        </div>
                        
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f9f9f9' }}>
                            {loading ? <Spin /> : messages.map(msg => {
                                const isMe = msg.sender_id === user.id;
                                return (
                                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                                        <div style={{ 
                                            maxWidth: '70%', 
                                            padding: '10px 15px', 
                                            borderRadius: '15px',
                                            background: isMe ? '#1b5e20' : '#fff',
                                            color: isMe ? '#fff' : '#333',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={{ padding: '15px', borderTop: '1px solid #e8e8e8', background: '#fff', display: 'flex', gap: '10px' }}>
                            <Input 
                                placeholder="Type a message..." 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onPressEnter={handleSend}
                            />
                            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} style={{ background: '#1b5e20' }} />
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
                        Select a user to start chatting
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default Messages;