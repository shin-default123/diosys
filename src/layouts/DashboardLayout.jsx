import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Badge, Breadcrumb, Dropdown, Popover, List, Empty, Button } from 'antd'; 
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api'; 
import { 
  HomeOutlined, UserOutlined, BookOutlined, TeamOutlined, 
  EnvironmentOutlined, CalendarOutlined, FileTextOutlined, 
  SettingOutlined, LockOutlined, BellOutlined, MessageOutlined,
  MenuUnfoldOutlined, MenuFoldOutlined, MailOutlined, HistoryOutlined, 
  SafetyCertificateOutlined, SoundOutlined, LogoutOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const breadcrumbNameMap = {
  '/admin': 'Admin',
  '/admin/dashboard': 'Dashboard',
  '/admin/employees': 'Employees',
  '/admin/schools': 'Manage Schools',
  '/admin/ministries': 'Manage Ministries',
  '/admin/parish': 'Manage Parish',
  '/admin/venues': 'Manage Venues',
  '/admin/schedules': 'Manage Schedules',
  '/admin/accounting/income': 'Income',
  '/admin/calendar': 'Parish Calendar',
  '/admin/announcements': 'Announcements',
  '/admin/bookings': 'Booking Requests',
  '/admin/registers/baptism': 'Baptism Records',
  '/admin/registers/confirmation': 'Confirmation Records',
  '/admin/registers/marriage': 'Marriage Records',
  '/admin/registers/death': 'Death Records',
  
  '/profile': 'User Profile',
  '/admin/settings': 'System Settings',
  '/admin/email-templates': 'Email Templates',
  '/admin/users': 'User Management',
  '/admin/messages': 'Messages',
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  useEffect(() => {
    const fetchData = () => {
        api.get('/notifications').then(res => setNotifications(res.data)).catch(() => {});
        api.get('/messages/unread').then(res => setUnreadMsgCount(res.data.count)).catch(() => {});
    };
    fetchData(); 
    
    // Poll every 15 seconds to keep counts updated
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
        await api.put('/notifications/read-all');
        const updated = notifications.map(n => ({ ...n, is_read: true }));
        setNotifications(updated);
    } catch (error) {
        console.error("Failed to mark notifications as read");
    }
  };

  const pathSnippets = location.pathname.split('/').filter((i) => i);
  
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const title = breadcrumbNameMap[url] || pathSnippets[index].charAt(0).toUpperCase() + pathSnippets[index].slice(1);
    
    return {
      key: url,
      title: <Link to={url}>{title}</Link>,
    };
  });

  const breadcrumbItems = [
    {
      key: '/admin/dashboard',
      title: <Link to="/admin/dashboard"><HomeOutlined /></Link>,
    },
    ...extraBreadcrumbItems.filter(item => item.key !== '/admin' && item.key !== '/admin/dashboard'), 
  ];

  const customMenuStyles = `
    .ant-menu-dark .ant-menu-item-selected {
      background-color: #ffffff !important;
      color: #1b5e20 !important;
    }
    .ant-menu-dark .ant-menu-item-selected .anticon {
      color: #1b5e20 !important;
    }
    .ant-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title {
       color: #ffffff !important;
    }
  `;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenu = {
    items: [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => navigate('/admin/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: handleLogout,
        },
    ]
  };

  const notificationContent = (
    <div style={{ width: 300 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <strong style={{ fontSize: '14px' }}>Notifications</strong>
            <Button type="link" size="small" onClick={markAllRead} style={{ padding: 0 }}>Mark all read</Button>
        </div>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {notifications.length > 0 ? (
                <List
                    dataSource={notifications}
                    renderItem={item => (
                        <List.Item style={{ padding: '10px', background: item.is_read ? '#fff' : '#f6ffed', cursor: 'default' }}>
                            <List.Item.Meta
                                title={<span style={{ fontSize: '12px', fontWeight: item.is_read ? 'normal' : 'bold' }}>{item.title}</span>}
                                description={<div style={{ fontSize: '11px', color: '#667', lineHeight: '1.2' }}>{item.message}</div>}
                            />
                        </List.Item>
                    )}
                />
            ) : <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '20px 0' }} />}
        </div>
    </div>
  );

  // Menu Items
  const items = [
    { key: '/admin/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/profile', icon: <UserOutlined />, label: 'Profile' },

    { key: 'sub1', icon: <BookOutlined />, label: 'Parish Registers', children: [
        { key: '/admin/registers/baptism', label: 'Baptism' },
        { key: '/admin/registers/confirmation', label: 'Confirmation' },
        { key: '/admin/registers/marriage', label: 'Marriage' },
        { key: '/admin/registers/death', label: 'Death/Burial' },
    ]},

    { key: 'sub2', icon: <FileTextOutlined />, label: 'Accounting', children: [
        { key: '/admin/accounting/income', label: 'Income' },
    ]},
    { key: '/admin/employees', icon: <TeamOutlined />, label: 'Employees' },
    { key: '/admin/ministries', icon: <TeamOutlined />, label: 'Ministries' },
    
    { key: '/admin/schools', icon: <HomeOutlined />, label: 'Schools' },
    { key: '/admin/parish', icon: <HomeOutlined />, label: 'Parish' },
    
    { key: '/admin/venues', icon: <EnvironmentOutlined />, label: 'Venues' },
    { key: '/admin/announcements', icon: <SoundOutlined />, label: 'Announcements' },
    { key: '/admin/calendar', icon: <CalendarOutlined />, label: 'Calendar' },
    { key: '/admin/bookings', icon: <BookOutlined />, label: 'Booking Requests' },
    { key: '/reports', icon: <FileTextOutlined />, label: 'Reports' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Users' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: 'System Settings' },
    { key: '/admin/email-templates', icon: <MailOutlined />, label: 'Email Templates' }, 
    { key: '/admin/privacy', icon: <LockOutlined />, label: 'Data Privacy Act' },
    { key: '/admin/permissions', icon: <SafetyCertificateOutlined />, label: 'Permissions' },
    { key: '/historical', icon: <HistoryOutlined />, label: 'Historical Data' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <style>{customMenuStyles}</style>

      {/* SIDEBAR */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={260}
        style={{ background: '#0e4812' }}
      >
        <div style={{ 
            height: '80px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            borderBottom: '1px solid rgba(255,255,255,0.1)' 
        }}>
            <div 
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                    position: 'absolute', 
                    left: '20px', 
                    color: 'white', 
                    fontSize: '20px', 
                    cursor: 'pointer' 
                }}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            {!collapsed && (
                <img src="/diosys.png" alt="Logo" style={{ height: '70px' }} />
            )}
        </div>

        <Menu 
          theme="dark" 
          mode="inline"
          defaultSelectedKeys={['/admin/dashboard']} 
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{ background: '#0e4812', fontSize: '15px' }} 
        />
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout>
        <Header style={{ 
            padding: '0 25px', 
            background: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            borderBottom: '1px solid #e8e8e8',
            height: '64px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                <span style={{ fontWeight: '500', color: '#333', fontSize: '16px' }}>
                    Diocese of Butuan
                </span>
                
                <Badge count={unreadMsgCount} size="small" offset={[-2, 2]}>
                    <MessageOutlined 
                        style={{ fontSize: '20px', color: '#1b5e20', cursor: 'pointer' }} 
                        onClick={() => navigate('/admin/messages')}
                    />
                </Badge>

                <Popover content={notificationContent} trigger="click" placement="bottomRight">
                    <Badge count={notifications.filter(n => !n.is_read).length} size="small" offset={[-2, 2]}>
                        <BellOutlined style={{ fontSize: '20px', color: '#1b5e20', cursor: 'pointer' }} />
                    </Badge>
                </Popover>
                
                {/* AVATAR WITH DROPDOWN */}
                <Dropdown menu={userMenu} placement="bottomRight" arrow trigger={['click']}>
                    <Avatar 
                        size="large" 
                        icon={<UserOutlined />} 
                        style={{ cursor: 'pointer', backgroundColor: '#e6f7ff', color: '#1b5e20' }} 
                    />
                </Dropdown>
            </div>
        </Header>

        <Content style={{ margin: '20px 25px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;