import React from 'react';
import { Card, List, Typography } from 'antd';

const schoolsData = [
  "Father Saturnino Urios University",
  "Father Urios Institute of Technology - Ampayon",
  "Sacred Heart School of Butuan",
  "Saint Michael College of Caraga",
  "Saint James High School",
  "Candelaria Institute"
];

const Schools = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Typography.Title level={2} style={{ color: '#1b5e20' }}>Diocesan Schools</Typography.Title>
      
      <Card 
        bordered={false} 
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        title={<span style={{ color: '#1b5e20', fontWeight: 'bold' }}>List of Schools</span>}
      >
        <List
            size="large"
            dataSource={schoolsData}
            renderItem={(item) => (
                <List.Item style={{ padding: '15px 20px', borderBottom: '1px solid #f0f0f0' }}>
                    {item}
                </List.Item>
            )}
        />
      </Card>
    </div>
  );
};

export default Schools;