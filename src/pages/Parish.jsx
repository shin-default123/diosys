import React from 'react';
import { Card, List, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const parishData = [
  "Buenavista: St. James the Great Parish",
  "Cabadbaran City: Virgen de la Candelaria Parish",
  "Carmen: Our Lady of Mount Carmel Parish",
  "Jabonga: Our Lady of Assumption Parish, Sts. Peter and Paul Mission Station (Baleguian)",
  "Kitcharao: Immaculate Heart of Mary Parish",
  "Nasipit: St. Michael the Archangel Parish (Kinabjangan)",
  "Kitcharao: Immaculate Heart of Mary Parish",
  "Nasipit: St. Michael the Archangel Parish (Kinabjangan)",
  "Santiago: St. James the Great Parish",
  "Las Nieves: Church of Our Lady of Snows "
];

const Parish = () => {
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
        title={<span style={{ color: 'white', fontWeight: 'bold', letterSpacing: '0.5px' }}>PARISH</span>}
        extra={<DownOutlined style={{ color: 'white', fontSize: '14px' }} />}
      >
        <List
            size="large"
            dataSource={parishData}
            renderItem={(item) => (
                <List.Item style={{ 
                    padding: '15px 25px', 
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                }}
                >
                    <span style={{ fontSize: '15px', color: '#333' }}>{item}</span>
                </List.Item>
            )}
        />
    </Card>
  );
};

export default Parish;