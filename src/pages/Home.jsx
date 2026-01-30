import React from 'react';
import { Row, Col, Typography, Card, List, Collapse, Table, Button } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const announcements = [
  "Mandatory use of the prescribed uniform for continuing students shall be on August 5, 2024 (Monday).",
  "New students and transferees shall wear the prescribed uniform starting September 10, 2024 (Thursday).",
  "Temporary uniform exemption slip for new students and transferees may be acquired from the Office of Student and Alumni Affairs.",
  "Mandatory use of the prescribed uniform for continuing students shall be on August 5, 2024 (Monday).",
  "New students and transferees shall wear the prescribed uniform starting September 10, 2024 (Thursday).",
  "Temporary uniform exemption slip for new students and transferees may be acquired from the Office of Student and Alumni Affairs."
];

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
  
  const collapseStyle = {
    background: 'transparent',
    border: 'none',
  };

  const panelStyle = {
    background: '#1b5e20', // Dark Green 
    borderRadius: '4px',
    marginBottom: '10px',
    border: 'none',
    overflow: 'hidden',
  };

  const headerStyle = { color: 'white', fontWeight: 'bold', letterSpacing: '1px' };

  return (
    <>
      <div style={{ position: 'relative', height: '350px', background: 'white', display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: '1.5', height: '100%', position: 'relative' }}>
             <img 
                src="/cathedral.jpg" 
                alt="Cathedral" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', maskImage: 'linear-gradient(to right, black 80%, transparent 100%)' }} 
             />
          </div>
          
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '20px' }}>
              <Title level={2} style={{ color: '#7cb342', margin: 0, fontFamily: 'cursive', fontSize: '3rem' }}>Welcome to</Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '60px', color: '#1b5e20', fontWeight: 'bold' }}>⟳</span> 
                  <Title level={1} style={{ color: '#1b5e20', margin: 0, fontSize: '70px', fontWeight: 'bold', lineHeight: '1' }}>DIOSYS</Title>
              </div>
              <Text style={{ color: '#1b5e20', fontSize: '18px', fontWeight: '600', letterSpacing: '1px' }}>Diocesan Integrated Operations System</Text>
          </div>
      </div>

      <div style={{ padding: '40px 80px', maxWidth: '1600px', margin: '0 auto' }}>
        <Row gutter={[40, 40]}>
            
            <Col xs={24} lg={10}>
                <div style={{ border: '3px solid #69c0ff', padding: '30px', background: 'white', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                        <SoundOutlined style={{ fontSize: '24px' }} />
                        <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>Announcements</Title>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {announcements.map((item, index) => (
                            <Paragraph key={index} style={{ color: '#555', fontSize: '14px', marginBottom: '0' }}>
                                {item}
                            </Paragraph>
                        ))}
                    </div>
                </div>
            </Col>

            <Col xs={24} lg={14}>
                <Collapse 
                    accordion 
                    defaultActiveKey={['1']} 
                    bordered={false} 
                    style={collapseStyle}
                    expandIconPosition="end" 
                >

                    <Panel 
                        header={<span style={headerStyle}>MATRIMONY</span>} 
                        key="1" 
                        style={panelStyle}
                    >
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
            </Col>
        </Row>
      </div>

      <div style={{ background: 'white', marginTop: '40px', padding: '0 80px 80px 80px' }}>
          <Row align="middle">
             <Col xs={24} md={10} style={{ paddingRight: '40px' }}>
                <Title level={2} style={{ color: '#1b5e20', fontWeight: 'bold', fontStyle: 'italic' }}>Plan Your Visit</Title>
                
                <Paragraph style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
                    Easily book appointments for sacraments, parish services, or meetings with clergy.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', color: '#555' }}>
                    Explore available times and connect with our diocese to plan your visit today.
                </Paragraph>
                
                <Button 
                    type="primary" 
                    size="large" 
                    style={{ 
                        marginTop: '25px', 
                        background: '#7cb342', 
                        borderColor: '#7cb342',
                        borderRadius: '25px',
                        padding: '0 50px',
                        fontWeight: 'bold',
                        height: '50px',
                        fontSize: '16px'
                    }}
                >
                    Book now
                </Button>
             </Col>

             <Col xs={24} md={14}>
                 <div style={{ 
                     height: '400px', 
                     overflow: 'hidden', 
                     maskImage: 'linear-gradient(to right, transparent, black 20%)' 
                 }}>
                    <img 
                        src="/inside.jpg" 
                        alt="Church Interior" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                 </div>
             </Col>
          </Row>
      </div>
    </>
  );
};

export default Home;