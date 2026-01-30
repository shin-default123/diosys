import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Schools from './pages/Schools';

// CHANGE THE PLACEHOLDERS TO LARAVEL DATA!!!!!!!!!!!
const Placeholder = ({ title }) => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1 style={{ color: '#1b5e20' }}>{title} Page</h1>
    <p>Coming Soon...</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Home />} />
          <Route path="schools" element={<Schools />} />
          
          <Route path="parish" element={<Placeholder title="Parish" />} />
          <Route path="booking" element={<Placeholder title="Booking" />} />
          <Route path="faqs" element={<Placeholder title="FAQs" />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;