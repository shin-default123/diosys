import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    parish_name: 'Diocese of Butuan', 
    maintenance_mode: false,
    theme_color: 'light',
    contact_number: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      const formatted = {
        ...response.data,
        maintenance_mode: response.data.maintenance_mode === '1'
      };
      setSettings(formatted);
    } catch (error) {
      console.error("Could not load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Force reload
  const reloadSettings = () => fetchSettings();

  return (
    <SettingsContext.Provider value={{ settings, loading, reloadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);