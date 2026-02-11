import React, { useEffect, useState } from 'react';
import { Card, List, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import api from '../api'; 

const Parish = () => {
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParishes = async () => {
      try {
        const response = await api.get('/parishes');
        setParishes(response.data);
      } catch (error) {
        console.error("Error fetching parishes:", error);
        setParishes([
            { name: "Buenavista: St. James the Great Parish" },
            { name: "Cabadbaran City: Virgen de la Candelaria Parish" },
            { name: "Carmen: Our Lady of Mount Carmel Parish" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchParishes();
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
        title={<span style={{ color: 'white', fontWeight: 'bold', letterSpacing: '0.5px' }}>PARISHES</span>}
        extra={<DownOutlined style={{ color: 'white', fontSize: '14px' }} />}
      >
        {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
        ) : (
            <List
                size="large"
                dataSource={parishes}
                renderItem={(item) => (
                    <List.Item style={{ 
                        padding: '15px 25px', 
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                    }}
                    >
                        <span style={{ fontSize: '15px', color: '#333' }}>{item.name}</span>
                        
                        {item.priest && (
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                                Priest: {item.priest}
                            </div>
                        )}
                    </List.Item>
                )}
            />
        )}
    </Card>
  );
};

export default Parish;