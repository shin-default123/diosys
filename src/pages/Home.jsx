import React, { useEffect, useState } from 'react';
import { Collapse, Table, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import api from '../api'; // Import your central API helper

const { Panel } = Collapse;

const Home = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/schedules');
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
    {/*    setSchedules([
            { id: 1, type: 'Matrimony', date: '2026-03-18', place: 'St. Joseph Cathedral', priest: 'Fr. Michael Carter' },
            { id: 2, type: 'Baptism', date: '2026-04-10', place: 'St. Joseph Cathedral', priest: 'Fr. John Doe' }
        ]);*/}
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const getSchedulesByType = (type) => {
    return schedules.filter(item => item.type === type);
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Place', dataIndex: 'place', key: 'place' },
    { title: 'Officiating Priest', dataIndex: 'priest', key: 'priest' },
  ];

  const panelStyle = {
    background: '#1b5e20', 
    borderRadius: '4px',
    marginBottom: '10px',
    border: 'none',
    overflow: 'hidden',
  };

  const headerStyle = { color: 'white', fontWeight: 'bold', letterSpacing: '1px' };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minHeight: '100%' }}>
        {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
        ) : (
            <Collapse 
                accordion 
                defaultActiveKey={['1']}
                bordered={false} 
                style={{ background: 'transparent' }}
                expandIconPosition="end" 
                expandIcon={({ isActive }) => (
                    <DownOutlined rotate={isActive ? 180 : 0} style={{ color: 'white', fontSize: '14px' }} />
                )}
            >
                <Panel header={<span style={headerStyle}>MATRIMONY</span>} key="1" style={panelStyle}>
                    <Table 
                        columns={columns} 
                        dataSource={getSchedulesByType('Matrimony')} 
                        rowKey="id"
                        pagination={false} 
                        size="small"
                        bordered
                        locale={{ emptyText: 'No scheduled matrimonies' }}
                        style={{ background: 'white' }}
                    />
                </Panel>

                <Panel header={<span style={headerStyle}>BAPTISMAL</span>} key="2" style={panelStyle}>
                    <Table 
                        columns={columns} 
                        dataSource={getSchedulesByType('Baptism')} 
                        rowKey="id"
                        pagination={false} 
                        size="small"
                        bordered
                        locale={{ emptyText: 'No scheduled baptisms' }}
                        style={{ background: 'white' }}
                    />
                </Panel>
                
                <Panel header={<span style={headerStyle}>CONFIRMATION</span>} key="3" style={panelStyle}>
                    <Table 
                        columns={columns} 
                        dataSource={getSchedulesByType('Confirmation')} 
                        rowKey="id"
                        pagination={false} 
                        size="small"
                        bordered
                        locale={{ emptyText: 'No scheduled confirmations' }}
                        style={{ background: 'white' }}
                    />
                </Panel>
                
                <Panel header={<span style={headerStyle}>MEMORIAL</span>} key="4" style={panelStyle}>
                     <Table 
                        columns={columns} 
                        dataSource={getSchedulesByType('Memorial')} 
                        rowKey="id"
                        pagination={false} 
                        size="small"
                        bordered
                        locale={{ emptyText: 'No scheduled memorials' }}
                        style={{ background: 'white' }}
                    />
                </Panel>

                <Panel header={<span style={headerStyle}>CONVERSION</span>} key="5" style={panelStyle}>
                     <Table 
                        columns={columns} 
                        dataSource={getSchedulesByType('Conversion')} 
                        rowKey="id"
                        pagination={false} 
                        size="small"
                        bordered
                        locale={{ emptyText: 'No scheduled conversions' }}
                        style={{ background: 'white' }}
                    />
                </Panel>
            </Collapse>
        )}
    </div>
  );
};

export default Home;