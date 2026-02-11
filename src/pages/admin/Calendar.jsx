import React, { useEffect, useState } from 'react';
import { Calendar, Badge, Modal, Form, Input, Select, Button, message, Radio, Popconfirm, TimePicker } from 'antd';
import { PlusOutlined, SoundOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api';

const { Option } = Select;

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [entryType, setEntryType] = useState('schedule');
  const [editingId, setEditingId] = useState(null); 
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedRes, annRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/announcements')
      ]);
      setEvents(schedRes.data);
      setAnnouncements(annRes.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditEvent = (e, item) => {
    e.stopPropagation(); 
    setEditingId(item.id);
    setEntryType('schedule'); 
    setSelectedDate(dayjs(item.date));
    
    form.setFieldsValue({
        type: item.type,
        date: dayjs(item.date),
        time: item.time ? dayjs(item.time, 'h:mm A') : null, // Parse time string back to object
        place: item.place,
        priest: item.priest
    });
    
    setIsModalOpen(true);
  };

  const dateCellRender = (value) => {
    const dateString = value.format('YYYY-MM-DD');
    const dayEvents = events.filter(e => e.date === dateString);

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayEvents.map(item => (
          <li 
            key={item.id} 
            onClick={(e) => handleEditEvent(e, item)}
            style={{ cursor: 'pointer', marginBottom: '2px' }}
          >
            <Badge 
                status={
                    item.type === 'Matrimony' ? 'warning' : 
                    item.type === 'Baptism' ? 'processing' : 
                    item.type === 'Confirmation' ? 'success' : 'default'
                } 
                text={
                    <span style={{ fontSize: '10px' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '4px' }}>{item.time}</span>
                        {item.type}
                    </span>
                } 
            />
          </li>
        ))}
      </ul>
    );
  };

  const onSelect = (value) => {
    setEditingId(null); 
    setEntryType('schedule');
    setSelectedDate(value);
    form.resetFields();
    form.setFieldsValue({ date: value });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (entryType === 'schedule') {
          const payload = {
              type: values.type,
              date: values.date.format('YYYY-MM-DD'),
              time: values.time ? values.time.format('h:mm A') : 'TBD', // Format Time
              place: values.place,
              priest: values.priest
          };

          if (editingId) {
             await api.put(`/schedules/${editingId}`, payload);
             message.success('Schedule updated');
          } else {
             await api.post('/schedules', payload);
             message.success('Schedule added');
          }
      } else {
          await api.post('/announcements', {
              content: values.content,
              is_active: true
          });
          message.success('Announcement posted');
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchData(); 
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const handleDelete = async () => {
      try {
          await api.delete(`/schedules/${editingId}`);
          message.success('Event deleted');
          setIsModalOpen(false);
          setEditingId(null);
          fetchData();
      } catch (error) {
          message.error('Failed to delete event');
      }
  };

  return (
    <div style={{ padding: '24px', background: 'white', borderRadius: '8px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h2 style={{ margin: 0, color: '#1b5e20' }}><CalendarOutlined /> Parish Calendar</h2>
         <Button 
            type="primary" 
            onClick={() => onSelect(dayjs())} 
            icon={<PlusOutlined />} 
            style={{ background: '#1b5e20' }}
         >
            Add Entry
         </Button>
      </div>

      <Calendar 
        dateCellRender={dateCellRender} 
        onSelect={onSelect} 
      />

      <Modal 
        title={editingId ? "Edit Event" : `Add Entry for ${selectedDate.format('MMM DD')}`} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText={editingId ? "Update" : "Save"}
        okButtonProps={{ style: { background: '#1b5e20' } }}
        footer={[
            editingId && (
                <Popconfirm key="delete" title="Delete this event?" onConfirm={handleDelete}>
                    <Button danger icon={<DeleteOutlined />} style={{ float: 'left' }}>Delete</Button>
                </Popconfirm>
            ),
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
            <Button key="submit" type="primary" onClick={handleOk} style={{ background: '#1b5e20' }}>
                {editingId ? "Update" : "Save"}
            </Button>
        ]}
      >
        {!editingId && (
            <Radio.Group 
                value={entryType} 
                onChange={e => setEntryType(e.target.value)} 
                buttonStyle="solid"
                style={{ marginBottom: '20px', width: '100%', textAlign: 'center' }}
            >
                <Radio.Button value="schedule" style={{ width: '50%' }}>Schedule Event</Radio.Button>
                <Radio.Button value="announcement" style={{ width: '50%' }}>Announcement</Radio.Button>
            </Radio.Group>
        )}

        <Form form={form} layout="vertical" initialValues={{ date: selectedDate }}>
            
            <Form.Item name="date" hidden><Input /></Form.Item>

            {entryType === 'schedule' ? (
                <>
                    <Form.Item name="type" label="Event Type" rules={[{ required: true }]}>
                        <Select disabled={!!editingId}>
                            <Option value="Matrimony">Matrimony (Wedding)</Option>
                            <Option value="Baptism">Baptism</Option>
                            <Option value="Confirmation">Confirmation</Option>
                            <Option value="Memorial">Memorial</Option>
                            <Option value="Conversion">Conversion</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="time" label="Time" rules={[{ required: true }]}>
                        <TimePicker use12Hours format="h:mm A" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="place" label="Location" initialValue="St. Joseph Cathedral" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="priest" label="Officiating Priest">
                        <Input placeholder="e.g. Fr. Michael Carter" />
                    </Form.Item>
                </>
            ) : (
                <>
                     <div style={{ marginBottom: '15px', color: '#666', fontSize: '12px' }}>
                        <SoundOutlined /> Announcements will appear on the Home Page sidebar.
                     </div>
                    <Form.Item name="content" label="Announcement Text" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} placeholder="e.g. No office on Monday due to holiday..." />
                    </Form.Item>
                </>
            )}

        </Form>
      </Modal>
    </div>
  );
};

export default AdminCalendar;