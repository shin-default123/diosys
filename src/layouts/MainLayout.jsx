import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, Button, Drawer, Menu, Grid } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SoundOutlined, MenuOutlined } from '@ant-design/icons';
import api from '../api';
import { useSettings } from '../context/SettingsContext';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  
  const [announcements, setAnnouncements] = useState([]);

  const isMobile = !screens.md;
  
  const isBookingPage = location.pathname === '/booking';

  const menuItems = [
    { label: 'Home', key: '/' },
    { label: 'Parish', key: '/parish' },
    { label: 'Schools', key: '/schools' },
    { label: 'Records', key: '/records' },
    { label: 'Booking', key: '/booking' },
    { label: 'FAQs', key: '/faqs' },
  ];

  // Fetch Announcements 
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([
           { content: "System Offline: Unable to load latest announcements." },
           { content: "Please contact the diocese office for urgent inquiries." }
        ]);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      
      <Header style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        background: '#1b5e20', padding: isMobile ? '0 20px' : '0 50px', height: '64px', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/diosys.png" alt="logo" style={{ height: '50px', borderRadius: '50%' }} />
          <div style={{ lineHeight: '1.2' }}>
            <img src="/text.png" alt="DIOSYS Text" style={{ height: '20px'}} />
            {!isMobile && <div style={{ color: 'white', fontSize: '10px' }}>{settings.parish_name || 'Diocesan Integrated Operations System'}</div>}
          </div>
        </div>

        {!isMobile ? (
          <div style={{ display: 'flex', height: '100%' }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.key;
              return (
                <div 
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
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
        ) : (
          <Button 
            type="text" 
            icon={<MenuOutlined style={{ color: 'white', fontSize: '20px' }} />} 
            onClick={() => setMobileMenuOpen(true)}
          />
        )}
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => handleMenuClick(e.key)}
        />
      </Drawer>

      <div style={{ 
          position: 'relative', 
          height: isMobile ? 'auto' : '350px', 
          background: 'white', 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          overflow: 'hidden' 
      }}>
          <div style={{ flex: isMobile ? 'none' : '1.5', height: isMobile ? '200px' : '100%', position: 'relative' }}>
             <img 
                src="/cathedral.jpg" 
                alt="Cathedral" 
                style={{ 
                    width: '100%', height: '100%', objectFit: 'cover', 
                    maskImage: isMobile ? 'none' : 'linear-gradient(to right, black 80%, transparent 100%)',
                    WebkitMaskImage: isMobile ? 'none' : 'linear-gradient(to right, black 80%, transparent 100%)'
                }} 
             />
          </div>
          
          <div style={{ 
              flex: '1', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              padding: isMobile ? '30px 20px' : '0 0 0 40px',
              textAlign: isMobile ? 'center' : 'left' 
          }}>
              <Title level={1} style={{ 
                  color: '#7cb342', 
                  marginBottom: '0', 
                  marginTop: '0',
                  fontFamily: 'cursive', 
                  fontSize: isMobile ? '2rem' : '3.5rem',
                  lineHeight: 1
              }}>
                Welcome to
              </Title>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ 
                    width: '80%', 
                    maxWidth: '450px',
                    height: 'auto', 
                    objectFit: 'contain', 
                    alignSelf: isMobile ? 'center' : 'flex-start' 
                }} 
              />
          </div>
      </div>

      <Content style={{ 
          padding: isMobile ? '20px' : '40px 80px',
          maxWidth: '1600px', 
          margin: '0 auto', 
          width: '100%' 
      }}>
        <Row gutter={[40, 40]}>
            
            <Col xs={24} lg={10}>
                <div style={{ border: '3px solid #69c0ff', padding: '30px', background: 'white', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                        <SoundOutlined style={{ fontSize: '24px' }} />
                        <Title level={4} style={{ margin: 0, fontWeight: 'bold' }}>Announcements</Title>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {announcements.length > 0 ? (
                            announcements.map((item, index) => (
                                <Paragraph key={index} style={{ color: '#555', fontSize: '14px', marginBottom: '0' }}>
                                    {typeof item === 'string' ? item : item.content}
                                </Paragraph>
                            ))
                        ) : (
                            <Paragraph>No announcements available.</Paragraph>
                        )}
                    </div>
                </div>
            </Col>

            <Col xs={24} lg={14}>
                 <Outlet />
            </Col>

        </Row>
      </Content>

      {!isBookingPage && (
          <div style={{ background: 'white', marginTop: 'auto', padding: isMobile ? '40px 0' : '40px 0 80px 0' }}>
              <Row align="middle" style={{ margin: 0 }}>
                 <Col xs={24} md={10} style={{ 
                     paddingLeft: isMobile ? '30px' : '80px', 
                     paddingRight: isMobile ? '30px' : '40px',
                     textAlign: isMobile ? 'center' : 'left',
                     marginBottom: isMobile ? '40px' : '0'
                 }}>
                    <Title level={2} style={{ color: '#1b5e20', fontWeight: 'bold', fontStyle: 'italic' }}>Plan Your Visit</Title>
                    <Paragraph style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
                        Easily book appointments for sacraments, parish services, or meetings with clergy.
                    </Paragraph>
                    <Paragraph style={{ fontSize: '16px', color: '#555' }}>
                        Explore available times and connect with our diocese to plan your visit today.
                    </Paragraph>
                    <Button 
                        type="primary" size="large" 
                        onClick={() => navigate('/booking')} 
                        style={{ marginTop: '20px', background: '#7cb342', borderColor: '#7cb342', padding: '0px 30px', fontWeight: 'bold', height: '40px', borderRadius: '15px', fontSize: '16px' }}
                    >
                        Book now
                    </Button>
                 </Col>

                 <Col xs={24} md={14}>
                     <div style={{ 
                         height: '400px', 
                         overflow: 'hidden', 
                         maskImage: isMobile ? 'none' : 'linear-gradient(to right, transparent, black 20%)', 
                         WebkitMaskImage: isMobile ? 'none' : 'linear-gradient(to right, transparent, black 20%)' 
                     }}>
                        <img src="/inside.jpg" alt="Church Interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                 </Col>
              </Row>
          </div>
      )}

      <Footer style={{ 
        textAlign: 'center', 
        background: '#1b5e20', 
        color: 'rgba(255,255,255,0.7)', 
        padding: '20px 0',
        display: 'flex',           
        justifyContent: 'center',  
        alignItems: 'center',      
        gap: '15px'                
      }}>
        <img src="/diosys.png" alt="logo" style={{ height: '50px' }} /> 
        <span>©2026 DIOSYS. All rights reserved.</span>
      </Footer>
    </Layout>
  );
};

export default MainLayout;