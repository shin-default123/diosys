import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/Login';

// Public Pages
import Home from './pages/Home';
import Schools from './pages/Schools';
import Parish from './pages/Parish';
import Booking from './pages/Booking';
import FAQs from './pages/FAQs';
import RecordSearch from './pages/RecordSearch';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Profile from './pages/admin/Profile'; 
import ManageUsers from './pages/admin/ManageUsers';
import ManageSchools from './pages/admin/ManageSchools';
import ManageParish from './pages/admin/ManageParish';
import ManageMinistries from './pages/admin/ManageMinistries';
import AdminCalendar from './pages/admin/Calendar';
import Income from './pages/admin/Income';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageBookings from './pages/admin/ManageBookings';
import ParishRegisters from './pages/admin/ParishRegisters';
import ManageEmployees from './pages/admin/ManageEmployees';
import DataPrivacy from './pages/admin/DataPrivacy';
import Permissions from './pages/admin/Permissions';
import SystemSettings from './pages/admin/SystemSettings';
import EmailTemplates from './pages/admin/EmailTemplates';
import ManageVenues from './pages/admin/ManageVenues';
import Messages from './pages/admin/Messages';

// PROTECTED ROUTE COMPONENT
const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  
  if (loading) {
     return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>; 
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          {/*LOGIN ROUTE*/}
          <Route path="/login" element={<Login />} />

          {/*PUBLIC WEBSITE ROUTES*/}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="schools" element={<Schools />} />
            <Route path="parish" element={<Parish />} />
            <Route path="booking" element={<Booking />} />
            <Route path="faqs" element={<FAQs />} />
            <Route path="records" element={<RecordSearch />} /> 
          </Route>

          {/*PROTECTED ADMIN ROUTES*/}
          <Route element={<ProtectedRoute />}>
            
            <Route path="/admin" element={<DashboardLayout />}>
              
              {/* Admin */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="messages" element={<Messages />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<ManageUsers />} />
              
              <Route path="schools" element={<ManageSchools />} />
              <Route path="parish" element={<ManageParish />} />
              <Route path="ministries" element={<ManageMinistries />} />
              <Route path="employees" element={<ManageEmployees />} />
              <Route path="venues" element={<ManageVenues />} />
              
              <Route path="calendar" element={<AdminCalendar />} />
              <Route path="announcements" element={<ManageAnnouncements />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="accounting/income" element={<Income />} />
              
              <Route path="registers/baptism" element={<ParishRegisters />} />
              <Route path="registers/confirmation" element={<ParishRegisters />} />
              <Route path="registers/marriage" element={<ParishRegisters />} />
              <Route path="registers/death" element={<ParishRegisters />} />
              
              <Route path="records" element={<RecordSearch />} />
              <Route path="privacy" element={<DataPrivacy />} />
              <Route path="permissions" element={<Permissions />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="email-templates" element={<EmailTemplates />} />
            </Route>

            <Route path="/profile" element={<DashboardLayout />}>
               <Route index element={<Profile />} />
            </Route>

          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;