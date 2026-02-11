import React from 'react';
import { Card, Typography, Divider, Collapse } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const DataPrivacy = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#1b5e20' }} />
            <Title level={2} style={{ color: '#1b5e20', marginTop: '10px' }}>Data Privacy & Protection Policy</Title>
            <Text type="secondary">In compliance with Republic Act 10173 (Data Privacy Act of 2012)</Text>
        </div>

        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Title level={4}>1. General Policy</Title>
            <Paragraph>
                The Diocese of Butuan ("DIOSYS") is committed to protecting the privacy and security of personal data provided by our parishioners, employees, and partners. We ensure that all data is collected, processed, and stored in accordance with the principles of transparency, legitimate purpose, and proportionality.
            </Paragraph>

            <Divider />

            <Title level={4}>2. Collection of Data</Title>
            <Paragraph>
                We collect personal data (Name, Date of Birth, Parent's Names, Contact Info) strictly for the purpose of administering Sacraments (Baptism, Confirmation, Marriage) and maintaining Parish Records as required by Canon Law.
            </Paragraph>

            <Divider />

            <Title level={4}>3. Use and Disclosure</Title>
            <Paragraph>
                <ul style={{ paddingLeft: '20px' }}>
                    <li><strong>Internal Use:</strong> Data is used by authorized parish staff for record-keeping and certificate issuance.</li>
                    <li><strong>Public Search:</strong> To balance privacy and utility, our public search tool only confirms the <em>existence</em> of a record and does not reveal sensitive family details (e.g., legitimacy, addresses).</li>
                    <li><strong>Third Parties:</strong> We do not share data with third parties unless required by law or with the explicit consent of the data subject.</li>
                </ul>
            </Paragraph>

            <Divider />

            <Title level={4}>4. Security Measures</Title>
            <Collapse ghost>
                <Panel header="Digital Security" key="1">
                    <p>Our database is protected by encryption and restricted access control. Only authorized accounts (Admin, Secretary) can modify records.</p>
                </Panel>
                <Panel header="Physical Security" key="2">
                    <p>Physical record books are stored in a secure, locked archive within the Parish Office, accessible only to the Parish Priest and Archivist.</p>
                </Panel>
            </Collapse>


        </Card>
    </div>
  );
};

export default DataPrivacy;