import React from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

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
        background: '#1b5e20', padding: '0 50px', height: '64px' 
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
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  fontWeight: 500,
                  height: '100%',
                  transition: 'all 0.3s'
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </Header>

      {/* PAGE CONTENT ATTACH HEREEEEE */}
      <Content style={{ padding: '0' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', background: '#1b5e20', color: 'rgba(255,255,255,0.7)' }}>
        ©2026 DIOSYS. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default MainLayout;