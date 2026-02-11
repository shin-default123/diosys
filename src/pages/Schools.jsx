import React, { useEffect, useState } from 'react';
import { Card, List, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import api from '../api'; 

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get('/schools');
        setSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([
            { name: "Father Saturnino Urios University (Offline Mode)" },
            { name: "Father Urios Institute of Technology" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return (
    <Card 
        bordered={false} 
        style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            borderRadius: '8px',
            overflow: 'hidden',
            height: '100%' 
        }}
        headStyle={{ 
            backgroundColor: '#1b5e20', 
            color: 'white', 
            borderBottom: 'none',
            padding: '15px 25px'
        }}
        bodyStyle={{ padding: '0' }}
        title={<span style={{ color: 'white', fontWeight: 'bold', letterSpacing: '0.5px' }}>SCHOOLS</span>}
        extra={<DownOutlined style={{ color: 'white', fontSize: '14px' }} />}
      >
        {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
        ) : (
            <List
                size="large"
                dataSource={schools}
                renderItem={(item) => (
                    <List.Item style={{ 
                        padding: '15px 25px', 
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                    }}
                    >
                        <span style={{ fontSize: '15px', color: '#333' }}>{item.name}</span>
                        {item.location && <span style={{ fontSize: '12px', color: '#888', float: 'right' }}>{item.location}</span>}
                    </List.Item>
                )}
            />
        )}
    </Card>
  );
};

export default Schools;