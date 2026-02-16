import React, { useState } from 'react';
import { Form, Input, Select, Button, Table, Card, Typography, Row, Col, Empty, Divider } from 'antd';
import { SearchOutlined, FileSearchOutlined, CheckCircleOutlined, UserOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const RecordSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [form] = Form.useForm();
  const recordType = Form.useWatch('type', form);

  const onFinish = async (values) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.post('/public/search', values);
      setResults(response.data);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date of Event',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      title: 'Name(s) on Record',
      dataIndex: 'display_name',
      key: 'display_name',
      render: (text) => <span style={{ fontWeight: 'bold', color: '#1b5e20' }}>{text}</span>
    },
    {
      title: 'Place',
      dataIndex: 'place',
      key: 'place',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => <Tag color="green"><CheckCircleOutlined /> Verified Available</Tag>
    }
  ];
  
  const Tag = ({ children, color }) => (
    <span style={{ background: '#f6ffed', border: '1px solid #b7eb8f', color: '#389e0d', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
        {children}
    </span>
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2} style={{ color: '#1b5e20' }}><FileSearchOutlined /> Parish Record Finder</Title>
        <Paragraph>
            Securely verify if your Baptismal, Confirmation, or Marriage record is available in our archives.
        </Paragraph>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ type: 'baptism' }}>
            
            <Row gutter={24}>
                {/* --- COMMON FIELDS --- */}
                <Col xs={24} md={8}>
                    <Form.Item name="type" label="Record Type" rules={[{ required: true }]}>
                        <Select size="large">
                            <Option value="baptism">Baptism</Option>
                            <Option value="confirmation">Confirmation</Option>
                            <Option value="marriage">Marriage</Option>
                            <Option value="death">Death</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item name="year" label="Event Year (Required)" rules={[{ required: true, message: 'Year is required' }]}>
                        <Input placeholder="e.g. 1995" size="large" type="number" prefix={<CalendarOutlined />} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item name="location" label="Location (Optional)">
                        <Input placeholder="e.g. Cathedral" size="large" prefix={<EnvironmentOutlined />} />
                    </Form.Item>
                </Col>
            </Row>

            <Divider dashed />

            {/* --- CONDITIONAL FIELDS --- */}
            
            {recordType === 'marriage' ? (
                // MARRIAGE FIELDS
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <h4 style={{ color: '#1b5e20' }}>Groom's Information</h4>
                            <Form.Item name="groom_last" label="Groom's Last Name" rules={[{ required: true }]}>
                                <Input placeholder="Surname" size="large" />
                            </Form.Item>
                            <Form.Item name="groom_first" label="Groom's First Name">
                                <Input placeholder="First Name" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <h4 style={{ color: '#1b5e20' }}>Bride's Information</h4>
                            <Form.Item name="bride_last" label="Bride's Maiden Last Name" rules={[{ required: true }]}>
                                <Input placeholder="Maiden Surname" size="large" />
                            </Form.Item>
                            <Form.Item name="bride_first" label="Bride's First Name">
                                <Input placeholder="First Name" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            ) : (
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                     <h4 style={{ color: '#1b5e20' }}>Individual's Information</h4>
                     <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                                <Input placeholder="Surname" size="large" prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                                <Input placeholder="Given Name" size="large" prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                     </Row>
                </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    loading={loading} 
                    icon={<SearchOutlined />} 
                    style={{ background: '#1b5e20', minWidth: '200px', height: '45px', fontSize: '16px' }}
                >
                    Search Records
                </Button>
            </div>
        </Form>
      </Card>

      <div style={{ marginTop: '40px' }}>
         {hasSearched && (
             <Card title="Search Results" bordered={false}>
                 {results.length > 0 ? (
                    <>
                        <Table 
                            dataSource={results} 
                            columns={columns} 
                            rowKey="id" 
                            pagination={false} 
                        />
                        <div style={{ marginTop: '20px', textAlign: 'center', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                            <Text strong>Record Found</Text>
                            <br />
                            <Text type="secondary">
                                Please visit the Parish Office with a valid ID to request an official copy.
                                <br/>
                                <small>Office Hours: Tue-Sat 8AM-5PM, Sun 8AM-12NN</small>
                            </Text>
                        </div>
                    </>
                 ) : (
                    <Empty description={
                        <span>
                            No records found.<br/> 
                            <small style={{color: '#888'}}>Ensure the Year and Spelling are exact. Try searching with just the Last Name if uncertain.</small>
                        </span>
                    } />
                 )}
             </Card>
         )}
      </div>

    </div>
  );
};

export default RecordSearch;