import React from 'react';
import { Collapse, Table, Typography } from 'antd';

const { Panel } = Collapse;

// --- Matrimony Data ---
const matrimonyColumns = [
  { title: 'Date of Marriage', dataIndex: 'date', key: 'date' },
  { title: 'Place of Marriage', dataIndex: 'place', key: 'place' },
  { title: 'Officiating Priest', dataIndex: 'priest', key: 'priest' },
];

const matrimonyData = [
  { key: '1', date: '2026-01-30', place: 'St. Joseph Cathedral', priest: 'Fr. Superman' },
  { key: '2', date: '2026-01-30', place: 'St. Joseph Cathedral', priest: 'Fr. Batman' },
  { key: '3', date: '2026-01-30', place: 'St. Joseph Cathedral', priest: 'Fr. Red Ranger' },
  { key: '4', date: '2026-01-30', place: 'St. Joseph Cathedral', priest: 'Fr. Flash' },
];

const Home = () => {
  const collapseStyle = { background: 'transparent', border: 'none' };
  const panelStyle = {
    background: '#1b5e20', // Dark Green 
    borderRadius: '4px',
    marginBottom: '10px',
    border: 'none',
    overflow: 'hidden',
  };
  const headerStyle = { color: 'white', fontWeight: 'bold', letterSpacing: '1px' };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', height: '100%' }}>
        <Collapse 
            accordion 
            defaultActiveKey={[]}
            bordered={false} 
            style={collapseStyle}
            expandIconPosition="end" 
        >
            <Panel header={<span style={headerStyle}>MATRIMONY</span>} key="1" style={panelStyle}>
                <Table 
                    columns={matrimonyColumns} 
                    dataSource={matrimonyData} 
                    pagination={false} 
                    size="small"
                    bordered
                />
            </Panel>

            <Panel header={<span style={headerStyle}>BAPTISMAL</span>} key="2" style={panelStyle}>
                <p style={{ padding: '10px', background: 'white', margin: 0 }}>Baptismal Schedule content goes here...</p>
            </Panel>
            
            <Panel header={<span style={headerStyle}>CONFIRMATION</span>} key="3" style={panelStyle}>
                    <p style={{ padding: '10px', background: 'white', margin: 0 }}>Confirmation Schedule content goes here...</p>
            </Panel>
            
            <Panel header={<span style={headerStyle}>MEMORIAL</span>} key="4" style={panelStyle}>
                    <p style={{ padding: '10px', background: 'white', margin: 0 }}>Memorial Services content goes here...</p>
            </Panel>

            <Panel header={<span style={headerStyle}>CONVERSION</span>} key="5" style={panelStyle}>
                    <p style={{ padding: '10px', background: 'white', margin: 0 }}>Conversion info goes here...</p>
            </Panel>
        </Collapse>
    </div>
  );
};

export default Home;