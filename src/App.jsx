import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Schools from './pages/Schools';
import Parish from './pages/Parish';

const Placeholder = ({ title }) => (
  <div style={{ background: 'white', padding: '50px', borderRadius: '8px', textAlign: 'center', height: '100%' }}>
    <h1 style={{ color: '#1b5e20' }}>{title} Page</h1>
    <p>Content coming soon...</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Home />} />
          <Route path="schools" element={<Schools />} />
          
          <Route path="parish" element={<Parish />} />
          <Route path="booking" element={<Placeholder title="Booking" />} />
          <Route path="faqs" element={<Placeholder title="FAQs" />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;