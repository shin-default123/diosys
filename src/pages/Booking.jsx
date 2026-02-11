import React, { useState, useEffect } from 'react';
import { 
  Steps, Form, Input, Select, DatePicker, 
  Button, Card, message, Alert, Calendar, Badge, Row, Col, Result
} from 'antd';
import { UserOutlined, CalendarOutlined, SolutionOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api'; 
import { useSettings } from '../context/SettingsContext';

const { Option } = Select;
const { Step } = Steps;

// 90 min interval
const generateTimeSlots = () => {
    const slots = [];
    let currentTime = dayjs().hour(8).minute(0).second(0); // Start 8:00 AM
    const endTime = dayjs().hour(17).minute(0).second(0); // End 5:00 PM

    while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
        slots.push(currentTime.format('h:mm A'));
        currentTime = currentTime.add(90, 'minute'); 
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots(); 

const Booking = () => {
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(dayjs()); 
  
  const [existingEvents, setExistingEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]); 

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/schedules');
        setExistingEvents(response.data);
      } catch (error) {
        console.error("Could not load schedules");
      }
    };
    fetchSchedules();
  }, []);

  if (settings.maintenance_mode) {
      return (
          <div style={{ padding: '50px', background: 'white', margin: '20px', borderRadius: '8px' }}>
              <Result
                status="warning"
                title="Booking System Offline"
                subTitle="We are currently performing maintenance or the office is closed. Please try again later."
                extra={
                    <Button type="primary" key="console" onClick={() => window.location.reload()} style={{ background: '#1b5e20' }}>
                        Check Again
                    </Button>
                }
              />
          </div>
      );
  }

  const handleDateSelect = (value) => {
    if (!value) return;
    
    setSelectedDate(value);
    
    form.setFieldsValue({ date: value });

    const dateString = value.format('YYYY-MM-DD');
    const eventsOnThisDay = existingEvents.filter(e => e.date === dateString);
    setSelectedDateEvents(eventsOnThisDay);
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue(true);
      
      const payload = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time, 
      };

      await api.post('/bookings', payload);
      
      message.success('Booking request submitted! We will contact you shortly.');
      setCurrentStep(3); 
    } catch (error) {
      message.error('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (err) {
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const dateCellRender = (value) => {
    const dateString = value.format('YYYY-MM-DD');
    const dayHasEvent = existingEvents.some(e => e.date === dateString);
    
    return dayHasEvent ? <Badge status="warning" /> : null;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: 
        return (
          <>
            <Form.Item name="type" label="Event Type" rules={[{ required: true }]}>
              <Select placeholder="Select event type">
                <Option value="Matrimony">Matrimony</Option>
                <Option value="Baptism">Baptism</Option>
                <Option value="Confirmation">Confirmation</Option>
                <Option value="Funeral">Funeral / Memorial</Option>
                <Option value="MassIntention">Mass Intention</Option>
              </Select>
            </Form.Item>
            <Form.Item name="venue" label="Preferred Venue" rules={[{ required: true }]}>
               <Select placeholder="Select venue">
                  <Option value="St. Joseph Cathedral">St. Joseph Cathedral</Option>
                  <Option value="Parish Hall">Parish Hall</Option>
                  <Option value="Chapel">Chapel</Option>
               </Select>
            </Form.Item>
          </>
        );

      case 1: 
        return (
          <>
            <Alert 
              message="Select Schedule" 
              description="Click a date on the calendar or use the date picker. Unavailable time slots will be disabled." 
              type="info" 
              showIcon 
              style={{ marginBottom: 20 }}
            />
            
            <Row gutter={24}>
                <Col xs={24} md={12}>
                     <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '10px' }}>
                        <Calendar 
                            fullscreen={false} 
                            dateCellRender={dateCellRender} 
                            value={selectedDate} 
                            onSelect={handleDateSelect} 
                        />
                     </div>
                </Col>
                <Col xs={24} md={12}>
                    <div style={{ marginTop: '20px' }}>
                        
                        <Form.Item name="date" label="Select Date" rules={[{ required: true }]}>
                            <DatePicker 
                                style={{ width: '100%' }} 
                                format="YYYY-MM-DD"
                                value={selectedDate} 
                                onChange={handleDateSelect} 
                                disabledDate={(current) => current && current < dayjs().endOf('day')}
                            />
                        </Form.Item>

                        {selectedDateEvents.length > 0 && (
                            <div style={{ marginBottom: '20px', background: '#fffbe6', padding: '10px', borderRadius: '4px', border: '1px solid #ffe58f' }}>
                                <div style={{ fontWeight: 'bold', color: '#faad14', marginBottom: '5px', fontSize: '12px' }}>
                                    <ClockCircleOutlined /> Taken Slots:
                                </div>
                                <div style={{ fontSize: '12px', color: '#888' }}>
                                    {selectedDateEvents.map(e => e.time).join(', ')}
                                </div>
                            </div>
                        )}

                        <Form.Item name="time" label="Select Time Slot" rules={[{ required: true }]}>
                            <Select placeholder="Select time">
                                {TIME_SLOTS.map(slot => {
                                    const isTaken = selectedDateEvents.some(e => e.time === slot);
                                    return (
                                        <Option key={slot} value={slot} disabled={isTaken}>
                                            {slot} {isTaken ? '(Booked)' : ''}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '-10px' }}>
                            * Slots are every 1 hour 30 mins (8AM - 5PM)
                        </div>

                    </div>
                </Col>
            </Row>
          </>
        );

      case 2: 
        return (
          <>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="e.g. Juan Dela Cruz" />
            </Form.Item>
            <Form.Item name="phone" label="Contact Number" rules={[{ required: true }]}>
              <Input prefix={<SolutionOutlined />} placeholder="e.g. 09123456789" />
            </Form.Item>
            <Form.Item name="email" label="Email Address (Optional)" rules={[{ type: 'email' }]}>
              <Input placeholder="e.g. juan@gmail.com" />
            </Form.Item>
          </>
        );

      case 3: 
        return (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ color: '#1b5e20' }}>Booking Request Sent!</h2>
            <p>Your request has been submitted to the parish office.</p>
            <p>We will review the schedule and contact you via phone/email for confirmation.</p>
            <Button type="primary" onClick={() => window.location.reload()}>Book Another</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <Card title="Book an Event" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        <Steps current={currentStep} style={{ marginBottom: '40px' }}>
          <Step title="Event" icon={<CalendarOutlined />} />
          <Step title="Schedule" icon={<CalendarOutlined />} />
          <Step title="Details" icon={<UserOutlined />} />
        </Steps>

        <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
            <div style={{ minHeight: '300px' }}>
                {renderStepContent()}
            </div>
            
            {currentStep < 3 && (
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {currentStep > 0 && (
                        <Button onClick={prev}>
                            Previous
                        </Button>
                    )}
                    {currentStep < 2 && (
                        <Button type="primary" onClick={next} style={{ background: '#1b5e20' }}>
                            Next
                        </Button>
                    )}
                    {currentStep === 2 && (
                        <Button type="primary" onClick={onFinish} loading={loading} style={{ background: '#1b5e20' }}>
                            Submit Request
                        </Button>
                    )}
                </div>
            )}
        </Form>
      </Card>
    </div>
  );
};

export default Booking;