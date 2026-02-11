import React from 'react';
import { Collapse, Typography, Card, Row, Col, Divider } from 'antd';
import { CaretRightOutlined, QuestionCircleOutlined, FileProtectOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const FAQs = () => {

  const themeColor = '#1b5e20';

  const baptismFaqs = [
    {
      q: "What are the requirements for Baptism?",
      a: "Parents must provide a photocopy of the child's PSA Birth Certificate. Godparents must be practicing Catholics. A pre-baptismal seminar attendance is also required."
    },
    {
      q: "How do I schedule a Baptism?",
      a: "You can schedule a baptism through our 'Booking' page or visit the parish office. Baptisms are typically held on Sundays at 10:00 AM."
    },
    {
      q: "Is there a fee for Baptism?",
      a: "There is a standard stipend for the church services. Please contact the parish office for the current rates. Voluntary donations are also accepted."
    }
  ];

  const weddingFaqs = [
    {
      q: "How early should we book our wedding date?",
      a: "We recommend booking at least 6 months in advance to ensure your preferred date is available and to allow ample time for canonical requirements."
    },
    {
      q: "What documents do we need?",
      a: "You will need Baptismal and Confirmation Certificates (marked 'For Marriage Purposes'), Marriage License, CENOMAR, and completion of the Pre-Cana Seminar."
    }
  ];

  const documentsFaqs = [
    {
      q: "How can I request a Baptismal Certificate?",
      a: "You may request certificates at the parish office during office hours. Please bring a valid ID. Processing usually takes 2-3 working days."
    },
    {
      q: "Can I request certificates online?",
      a: "Currently, requests must be made in person or by an authorized representative with an authorization letter, to ensure data privacy."
    }
  ];

  const customPanelStyle = {
    marginBottom: 10,
    background: '#ffffff',
    borderRadius: 8,
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
  };

  const renderFaqSection = (title, icon, data) => (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
         {icon}
         <Title level={4} style={{ margin: 0, color: '#333' }}>{title}</Title>
      </div>
      <Collapse
        bordered={false}
        defaultActiveKey={['0']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ color: themeColor }} />}
        style={{ background: 'transparent' }}
      >
        {data.map((item, index) => (
          <Panel 
            header={<span style={{ fontWeight: 600, fontSize: '15px', color: '#444' }}>{item.q}</span>} 
            key={index} 
            style={customPanelStyle}
          >
            <Paragraph style={{ color: '#666', margin: 0 }}>{item.a}</Paragraph>
          </Panel>
        ))}
      </Collapse>
    </div>
  );

  return (
    <div style={{ padding: '20px 0' }}>
       
       <Card 
        bordered={false} 
        style={{ 
            marginBottom: '40px', 
            background: 'linear-gradient(to right, #1b5e20, #2e7d32)', 
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
        }}
       >
           <Title level={2} style={{ color: 'white', margin: 0 }}>Frequently Asked Questions</Title>
           <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
               Find answers to common questions about sacraments, services, and schedules.
           </Text>
       </Card>

       <Row gutter={[48, 24]}>
           <Col xs={24} lg={12}>
               {renderFaqSection(
                   "Baptism", 
                   <QuestionCircleOutlined style={{ fontSize: '24px', color: themeColor }} />, 
                   baptismFaqs
               )}
               {renderFaqSection(
                   "Matrimony (Wedding)", 
                   <QuestionCircleOutlined style={{ fontSize: '24px', color: themeColor }} />, 
                   weddingFaqs
               )}
           </Col>

           <Col xs={24} lg={12}>
                {renderFaqSection(
                   "Certificates & Documents", 
                   <FileProtectOutlined style={{ fontSize: '24px', color: themeColor }} />, 
                   documentsFaqs
               )}
               
               <Card 
                  title={<span><ClockCircleOutlined /> Parish Office Hours</span>} 
                  bordered={false}
                  headStyle={{ borderBottom: `2px solid ${themeColor}`, color: themeColor }}
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
               >
                   <p><strong>Tuesday - Saturday:</strong><br />8:00 AM - 12:00 NN | 1:00 PM - 5:00 PM</p>
                   <p><strong>Sunday:</strong><br />8:00 AM - 12:00 NN only</p>
                   <p style={{ color: 'red', margin: 0 }}><strong>Monday:</strong> CLOSED</p>
                   <Divider />
                   <Text type="secondary" style={{ fontSize: '12px' }}>
                       For urgent sick calls, you may visit the convent directly or call our emergency hotline.
                   </Text>
               </Card>
           </Col>
       </Row>

    </div>
  );
};

export default FAQs;