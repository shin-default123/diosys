import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [loading, setLoading] = useState(true);

    // Function to set token and user data
    const setTokenAndUser = (token, userData) => {
        setToken(token);
        setUser(userData);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    useEffect(() => {
        if (token) {
            api.get('/user')
                .then(({ data }) => {
                    setUser(data);
                })
                .catch(() => {
                    setTokenAndUser(null, null); d
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        setTokenAndUser(response.data.access_token, response.data.user);
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } finally {
            setTokenAndUser(null, null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);