import React from 'react';
import { Table, Card, Tag, Typography } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, KeyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Permissions = () => {

  const data = [
    { key: '1', module: 'Parish Registers', action: 'View Records', admin: true, secretary: true, staff: true, volunteer: false },
    { key: '2', module: 'Parish Registers', action: 'Create/Edit Records', admin: true, secretary: true, staff: false, volunteer: false },
    { key: '3', module: 'Parish Registers', action: 'Delete Records', admin: true, secretary: false, staff: false, volunteer: false },
    { key: '4', module: 'Bookings', action: 'View Calendar', admin: true, secretary: true, staff: true, volunteer: true },
    { key: '5', module: 'Bookings', action: 'Approve/Reject', admin: true, secretary: true, staff: false, volunteer: false },
    { key: '6', module: 'Employees', action: 'Manage Staff', admin: true, secretary: false, staff: false, volunteer: false },
    { key: '7', module: 'Financials', action: 'View Income', admin: true, secretary: false, staff: false, volunteer: false },
    { key: '8', module: 'System', action: 'Edit Settings', admin: true, secretary: false, staff: false, volunteer: false },
  ];

  const columns = [
    { 
        title: 'Module', 
        dataIndex: 'module', 
        key: 'module',
        render: (text) => <strong>{text}</strong>,
        onCell: (record, index) => {
            return {};
        }
    },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { 
        title: <Tag color="gold">Admin</Tag>, 
        dataIndex: 'admin', 
        key: 'admin', 
        align: 'center',
        render: (val) => val ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#ff4d4f' }} /> 
    },
    { 
        title: <Tag color="blue">Secretary</Tag>, 
        dataIndex: 'secretary', 
        key: 'secretary', 
        align: 'center',
        render: (val) => val ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#ff4d4f' }} /> 
    },
    { 
        title: <Tag color="cyan">Staff</Tag>, 
        dataIndex: 'staff', 
        key: 'staff', 
        align: 'center',
        render: (val) => val ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#eee' }} /> 
    },
    { 
        title: <Tag color="default">Volunteer</Tag>, 
        dataIndex: 'volunteer', 
        key: 'volunteer', 
        align: 'center',
        render: (val) => val ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#eee' }} /> 
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
        
        <div style={{ marginBottom: '20px' }}>
            <Title level={2} style={{ color: '#1b5e20', margin: 0 }}><KeyOutlined /> Role & Permissions Matrix</Title>
            <Paragraph>
                Reference guide for system access levels. To change a user's role, please go to the <strong>Users</strong> page.
            </Paragraph>
        </div>

        <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Table 
                dataSource={data} 
                columns={columns} 
                pagination={false} 
                bordered 
                size="middle"
            />
        </Card>
    </div>
  );
};

export default Permissions;