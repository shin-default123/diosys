import React from 'react';
import { Layout, Row, Col, Typography, Button, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SoundOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const announcements = [
  "Mandatory use of the prescribed uniform for continuing students shall be on August 5, 2024 (Monday).",
  "New students and transferees shall wear the prescribed uniform starting September 10, 2024 (Thursday).",
  "Temporary uniform exemption slip for new students and transferees may be acquired from the Office of Student and Alumni Affairs.",
  "Mandatory use of the prescribed uniform for continuing students shall be on August 5, 2024 (Monday).",
  "New students and transferees shall wear the prescribed uniform starting September 10, 2024 (Thursday).",
  "Temporary uniform exemption slip for new students and transferees may be acquired from the Office of Student and Alumni Affairs."
];

{/* MainLayout contains the Hero Section, Plan your visit section, header and footer and Announcements */}


const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Parish', path: '/parish' },
    { label: 'Schools', path: '/schools' },
    { label: 'Booking', path: '/booking' },
    { label: 'FAQs', path: '/faqs' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      
      <Header style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        background: '#1b5e20', padding: '0 50px', height: '64px', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/cathedral.jpg" alt="logo" style={{ height: '40px', borderRadius: '50%' }} />
          <div style={{ lineHeight: '1.2' }}>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>DIOSYS</div>
            <div style={{ color: 'white', fontSize: '10px' }}>Diocesan Integrated Operations System</div>
          </div>
        </div>

        <div style={{ display: 'flex', height: '100%' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div 
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{ 
                  color: isActive ? '#1b5e20' : 'white', 
                  background: isActive ? 'white' : 'transparent',
                  padding: '0 25px', 
                  display: 'flex', alignItems: 'center', cursor: 'pointer',
                  fontWeight: 500, height: '100%', transition: 'all 0.3s'
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </Header>

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

      <Content style={{ padding: '40px 80px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
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
                 <Outlet />
            </Col>

        </Row>
      </Content>

      <div style={{ background: 'white', marginTop: 'auto', padding: '40px 0 80px 0' }}>
          <Row align="middle" style={{ margin: 0 }}>
             <Col xs={24} md={10} style={{ paddingLeft: '80px', paddingRight: '40px' }}>
                <Title level={2} style={{ color: '#1b5e20', fontWeight: 'bold', fontStyle: 'italic' }}>Plan Your Visit</Title>
                <Paragraph style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
                    Easily book appointments for sacraments, parish services, or meetings with clergy.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', color: '#555' }}>
                    Explore available times and connect with our diocese to plan your visit today.
                </Paragraph>
                <Button 
                    type="primary" size="large" 
                    style={{ marginTop: '20px', background: '#7cb342', borderColor: '#7cb342', padding: '0px 30px', fontWeight: 'bold', height: '40px', borderRadius: '15px', fontSize: '16px' }}
                >
                    Book now
                </Button>
             </Col>
             <Col xs={24} md={14}>
                 <div style={{ height: '400px', overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)' }}>
                    <img src="/inside.jpg" alt="Church Interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 </div>
             </Col>
          </Row>
      </div>

      <Footer style={{ textAlign: 'center', background: '#1b5e20', color: 'rgba(255,255,255,0.7)', padding: '20px 0' }}>
        ©2026 DIOSYS. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default MainLayout;