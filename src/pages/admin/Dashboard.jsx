import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Spin, message } from 'antd';
import { DownOutlined, CaretUpFilled, CaretDownFilled, MenuOutlined } from '@ant-design/icons';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, CartesianGrid 
} from 'recharts';
import api from '../../api';

const { Title, Text } = Typography;

const StatCard = ({ title, value, growth }) => {
  const isPositive = growth >= 0;
  return (
    <Card 
      bordered={false} 
      style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
      bodyStyle={{ padding: '0' }}
    >
      <div style={{ padding: '15px 15px 5px 15px', fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
          {title}
      </div>

      <div style={{ margin: '0 15px', background: '#7cb342', padding: '5px 15px', borderRadius: '4px', color: 'white', display: 'flex', justifyContent: 'space-between', fontSize: '12px', alignItems: 'center' }}>
          <span>This Month</span>
          <DownOutlined style={{ fontSize: '10px' }} />
      </div>
      
      <div style={{ padding: '15px', textAlign: 'center' }}>
          <Title level={1} style={{ margin: 0, fontSize: '38px', color: '#333', fontWeight: 'bold' }}>{value}</Title>
          <div style={{ 
              color: isPositive ? '#5b8c00' : '#cf1322', 
              fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '16px' 
          }}>
              {isPositive ? <CaretUpFilled /> : <CaretDownFilled />} {Math.abs(growth)}%
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>vs last month</Text>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  const [cards, setCards] = useState({
      Baptism: { value: 0, growth: 0 },
      Confirmation: { value: 0, growth: 0 },
      Matrimony: { value: 0, growth: 0 },
      Memorial: { value: 0, growth: 0 }
  });
  const [lineData, setLineData] = useState([]);
  const [pyramidData, setPyramidData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setCards(response.data.cards);
        setLineData(response.data.lineChart);
        setPyramidData(response.data.pyramid);
      } catch (error) {
        console.error(error);
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
      return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
            <StatCard title="Baptism" value={cards.Baptism.value} growth={cards.Baptism.growth} />
        </Col>
        <Col xs={24} sm={12} md={6}>
            <StatCard title="Confirmation" value={cards.Confirmation.value} growth={cards.Confirmation.growth} />
        </Col>
        <Col xs={24} sm={12} md={6}>
            <StatCard title="Matrimony" value={cards.Matrimony.value} growth={cards.Matrimony.growth} />
        </Col>
        <Col xs={24} sm={12} md={6}>
            <StatCard title="Death / Memorial" value={cards.Memorial.value} growth={cards.Memorial.growth} />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        
        <Col xs={24} lg={12}>
            <Card 
                title={<span style={{ fontWeight: 'bold' }}>Demographics (Active Parishioners)</span>} 
                extra={<MenuOutlined style={{ color: '#999' }} />} 
                bordered={false} 
                style={{ height: '100%', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderRadius: '8px' }}
            >
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart layout="vertical" data={pyramidData} stackOffset="sign" barCategoryGap="15%">
                        <CartesianGrid horizontal={false} vertical={true} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="age" type="category" width={40} tick={{ fontSize: 10, fill: '#666' }} interval={0} />
                        <YAxis yAxisId="right" orientation="right" dataKey="age" type="category" width={40} tick={{ fontSize: 10, fill: '#666' }} interval={0} />
                        
                        <Tooltip />
                        <Bar dataKey="male" fill="#1b5e20" stackId="a" name="Male" />
                        <Bar dataKey="female" fill="#7cb342" stackId="a" name="Female" />
                    </BarChart>
                </ResponsiveContainer>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <span style={{ color: '#1b5e20', marginRight: '15px', fontSize: '12px' }}>● Male</span>
                    <span style={{ color: '#7cb342', fontSize: '12px' }}>● Female</span>
                </div>
            </Card>
        </Col>

        <Col xs={24} lg={12}>
            <Card 
                title={<div style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>RECORDS TRENDS</div>} 
                extra={<MenuOutlined style={{ color: '#999' }} />} 
                bordered={false} 
                style={{ height: '100%', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderRadius: '8px' }}
            >
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#999', marginBottom: '20px', letterSpacing: '0.5px' }}>
                    YEARLY COMPARISON
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} />
                        <Tooltip />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}/>
                        
                        <Line type="monotone" dataKey="Matrimony" stroke="#1b5e20" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Baptism" stroke="#7cb342" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Confirmation" stroke="#00e676" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="Memorial" stroke="#ff5722" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: '24px' }}>
          <Col span={24}>
              <div style={{ height: '300px', background: '#e8e8e8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                 Additional Widgets (Calendar Summary, Recent Logs)
              </div>
          </Col>
      </Row>
    </div>
  );
};

export default Dashboard;